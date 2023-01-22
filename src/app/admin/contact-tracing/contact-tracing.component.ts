import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  NgbDate,
  NgbDateStruct,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

interface IReportBody {
  busAccount: string,
  passengerAccount: string,
  dateFrom: Date,
  dateTo: Date,
  today: Date,
}

@Component({
  selector: 'app-contact-tracing',
  templateUrl: './contact-tracing.component.html',
  styleUrls: ['./contact-tracing.component.scss'],
})
export class ContactTracingComponent implements OnInit {
  @ViewChild('typeAheadInstance', { static: true })
  typeAheadInstance!: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model!: NgbDateStruct;
  @ViewChild('content') content!: ElementRef;
  public breakpoint: number = 0;
  public isFormIncomplete: boolean = true;

  public tripHistoryList: Array<any> = [];
  public contactTracingForm!: FormGroup;

  public toggleDatePicker: Boolean = true;
  public minDate: any;
  public maxDate: any;

  public passengerList: Array<any> = [];
  public statusList: Array<any> = [
    { text: "New Case", value: "New Case" },
    { text: "Hospital Quarantined", value: "Hospital Quarantined" },
    { text: "Home Quarantined", value: "Home Quarantined" },
    { text: "Recovered", value: "Recovered" },
    { text: "Deceased", value: "Deceased" },
  ];
  public progressList: Array<any> = [
    { text: "Passenger successfully added to positive list.", status: "success" },
    { text: "Tracked trip history 5 days prior to the date tagged as positive", status: "success" },
    { text: "Collecting exposed passengers...", status: "warning" },
    { text: "Failed to save exposed passengers to close contact list", status: "danger" },
    { text: "Failed to send emails to passengers exposed.", status: "muted" },
  ];

  public pdfBody: Array<any> = [];
  public pdfHeaders: Array<any> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService,
  ) {}

  ngOnInit() {
    this.getAllPassengers();
    this.initGenerateReportForm();
  }

  initGenerateReportForm = () => {
    this.contactTracingForm = new FormGroup({
      passengerAccount: new FormControl('', Validators.required),
      dateTaggedAsPositive: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
    });
  };

  getAllPassengers = () => {
    this.passSakayAPIService
      .getAllPassengerData()
      .then((response: any) => {
        if (response.error) {
          console.log(response);
        }
        if (!response.error) {
          response.forEach((data: any) => {
            this.passengerList.push({
              text: data.firstname + " " + data.middlename + " " + data.lastname,
              value: data._id
            });
          });
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
  }

  getAllTripHistory = (payload: any) => {
    this.passSakayAPIService
      .getAllTripHistoryReport(payload)
      .then((data: any) => {
        data.forEach((tripHistory: any, index: number) => {
          const passenger = tripHistory.passengerAccount;
          const fullname = `
            ${passenger.lastname}, 
            ${passenger.firstname} 
            ${passenger.middlename ? passenger.middlename : ''}
          `;
          this.tripHistoryList.push({
            _id: tripHistory._id,
            Date: moment(tripHistory.date).format('MMM DD YYYY'),
            Time: moment(tripHistory.time).format('HH:mm:ss A'),
            rowId: index + 1,
            PassengerName: fullname,
            BusName: `${tripHistory.busAccount.busName}`,
            ScanType: tripHistory.tripType,
            TripSched: `
              ${tripHistory.tripSched.name} 
              (${tripHistory.tripSched.startTime} - ${tripHistory.tripSched.endTime})
            `,
            TripRoute: `
              ${tripHistory.tripSched.startingPoint} - 
              ${tripHistory.tripSched.finishingPoint}
            `,
          });
        });
      })
      .catch((error: any) => {
        console.log(error);
        this.snackBarService.open(
          'Failed to load trip history data. Check your internet connection.',
          'Got it'
        );
      });
  };

  onChangeJustToday = () => {
    const today = this.contactTracingForm.get('today');
    const dateFrom = this.contactTracingForm.get('dateFrom');
    const dateTo = this.contactTracingForm.get('dateTo');
    console.log(today?.value);

    if (today?.value) {
      dateFrom?.disable();
      dateFrom?.setValue('');
      dateTo?.disable();
      dateTo?.setValue('');
      this.toggleDatePicker = false;
    } else {
      dateFrom?.enable();
      dateTo?.enable();
      this.toggleDatePicker = true;
    }
  };

  setDateObject = (date: any): any => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const parsedDate = new NgbDate(year, month, day);
    return parsedDate;
  };

  setMaxDate = () => {
    const dateTo = this.contactTracingForm.get('dateTo');
    this.maxDate = this.setDateObject(dateTo?.value);
    console.log('setMax', this.setDateObject(dateTo?.value));
  };

  setMinDate = () => {
    const dateFrom = this.contactTracingForm.get('dateFrom');
    this.minDate = this.setDateObject(dateFrom?.value);
    console.log('setMin', this.setDateObject(dateFrom?.value));
  };

  // export to PDF

  //excel button click functionality
  // exportExcel() {
  //   import("xlsx").then(xlsx => {
  //       const worksheet = xlsx.utils.json_to_sheet(this.sales); // Sale Data
  //       const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //       const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //       this.saveAsExcelFile(excelBuffer, "sales");
  //   });
  // }
  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   import("file-saver").then(FileSaver => {
  //     let EXCEL_TYPE =
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //     let EXCEL_EXTENSION = ".xlsx";
  //     const data: Blob = new Blob([buffer], {
  //       type: EXCEL_TYPE
  //     });
  //     FileSaver.saveAs(
  //       data,
  //       fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
  //     );
  //   });
  // }

  getFormValues = (): IReportBody => {
    const busAccount = this.contactTracingForm.get('busAccount');
    const passengerAccount = this.contactTracingForm.get('passengerAccount');
    const dateFrom = this.contactTracingForm.get('dateFrom');
    const dateTo = this.contactTracingForm.get('dateTo');
    const today = this.contactTracingForm.get('today');

    const payload: any = {};
    Object.keys(this.contactTracingForm.controls).forEach(key => {
      if (this.contactTracingForm.controls[key].value) {
        payload[key] = this.contactTracingForm.controls[key].value;
      }
    });
    console.log(payload);
    return payload;
  };

  onClearForm = () => {
    Object.keys(this.contactTracingForm.controls).forEach(key => {
      const control = this.contactTracingForm.get(key);
      if (control) {
        control.setErrors(null);
        control.setValue(null);
      }
    });
    this.contactTracingForm.markAsPristine();
    this.contactTracingForm.markAsUntouched();
  }

  onTraceCloseContacts = () => {
    const passengerAccount = this.contactTracingForm.get('passengerAccount');
    const dateTaggedAsPositive = this.contactTracingForm.get('dateTaggedAsPositive');

    const body = {
      passengerAccount: passengerAccount,
      dateFrom: moment(dateTaggedAsPositive?.value).subtract(5,'days'),
      dateTo: moment(dateTaggedAsPositive?.value)
    }
    console.log(body)

    this.passSakayAPIService.getTripHistoryOfPositive(body)
      .then((data: any) => {
        console.log(data)
        this.tripHistoryList = data;
      })
      .catch((error: any) => {
        console.error(error);
      })
  }

  // save = (): void => {
  //   let content = this.content.nativeElement;
  //   let doc: any = new jsPDF('p', 'mm', 'a4');
  //   let _elementHandlers = {
  //     '#editor': function (element: any, renderer: any) {
  //       return true;
  //     },
  //   };
  //   doc.html(content.innerHTML, {
  //     x: 15,
  //     y: 15,
  //     width: 190,
  //     elementHandlers: _elementHandlers,
  //   });

  //   doc.save('test.pdf');
  // };

  generatePDFReport = (data: any, fileName: string) => {
    const doc = new jsPDF('p', 'pt', 'letter');
    let y = 10;
    doc.setLineWidth(2);
    doc.text('Trip Report - ' + moment().format("MMMDDYYYY"), 200, (y = y + 30));
    autoTable(doc, {
      columnStyles: { price: { halign: 'right' } },
      body: [
        {
          s_no: '1',
          product_name: 'GIZMORE Multimedia Speaker with Remote Control, Black',
          price: '75000',
        },
        { s_no: '2', product_name: 'Realme', price: '25000' },
        { s_no: '3', product_name: 'Oneplus', price: '30000' },
      ],
      columns: [
        { header: 'SL.No', dataKey: 's_no' },
        { header: 'Product Name', dataKey: 'product_name' },
        { header: 'Price', dataKey: 'price' },
      ],
      startY: 70,
      foot: [[' ', 'Price total', '130000', '  ']],
      headStyles: { textColor: [255, 255, 255] },
      footStyles: { textColor: [255, 255, 255] },
      theme: 'grid',
    });
    // save the data to this file
    doc.save('');
  };

  apiGenerateReportData = () => {
    const body = this.getFormValues();
    this.passSakayAPIService.getAllTripHistoryReport(body)
      .then(data => {
        data.forEach((tripHistory: any, idx: number) => {
          const passenger = tripHistory.passengerAccount;
          const fullname = `
            ${passenger.lastname}, 
            ${passenger.firstname} 
            ${passenger.middlename ? passenger.middlename : ""}
          `;

          const tripSched = tripHistory.tripSched;
          const tripSchedRoutine = tripSched.daysRoutine.map((day: any) => day[0]).join('');
          const tripSchedRoute = `${tripSched.startingPoint} - ${tripSched.finishingPoint}`;
          const tripSchedTime = `${tripSched.startTime} - ${tripSched.endTime}`;
          const tripSchedData = `${tripSched.name} (
            ${tripSchedRoutine} | 
            ${tripSchedRoute} | 
            ${tripSchedTime}
          )`;

          this.pdfBody.push({
            id: idx + 1,
            passengerName: fullname,
            busName: `${tripHistory.busAccount.busName}`,
            tripSched: tripSchedData,
            date: moment(tripHistory.date).format('MMM DD YYYY'),
            time: moment(tripHistory.time).format('HH:mm:ss A'),
          });
        });
        this.generatePDFReport(this.pdfBody, "trip-report-" + moment().format("MMMDDYYYY"));
      })
      .catch(error => {
        console.error(error);
      });
  };

  generateHeaderFooterTable = () => {
    const fileTitle = ``;
    console.log(this.contactTracingForm);
    // this.generatePDFReport();
  };

  ngDoCheck(): void {
    let isInputNull: number = 0;
    Object.keys(this.contactTracingForm.controls).forEach((key: string) => {
      const controlValue = this.contactTracingForm.controls[key];
      if (!controlValue.value) {
        isInputNull++;
      }
    });
    if (isInputNull) {
      this.isFormIncomplete = true;
    } else {
      this.isFormIncomplete = false;
    }
  }
}
