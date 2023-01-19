import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { BusDriverComponent } from '../../bus-driver/bus-driver.component';
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
  selector: 'app-bus-driver-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  @ViewChild('typeAheadInstance', { static: true })
  typeAheadInstance!: NgbTypeahead;
  public focus$ = new Subject<string>();
  public click$ = new Subject<string>();
  public model!: NgbDateStruct;
  @ViewChild('content') content!: ElementRef;
  public breakpoint: number = 0;

  public tripHistoryList: Array<any> = [];
  public generateReportForm!: FormGroup;

  public toggleDatePicker: Boolean = true;
  public minDate: any;
  public maxDate: any;

  public busProfileData: Array<any> = [];

  public pdfBody: Array<any> = [];
  public pdfHeaders: Array<any> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService,
    private busDriverData: BusDriverComponent
  ) {}

  ngOnInit() {
    this.getBusProfile();
    this.initGenerateReportForm();
  }

  initGenerateReportForm = () => {
    this.generateReportForm = new FormGroup({
      busAccount: new FormControl("", Validators.required),
      passengerAccount: new FormControl('', Validators.required),
      scanType: new FormControl('', Validators.required),
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required),
      today: new FormControl('', Validators.required),
    });
  };

  getBusProfile = () => {
    this.passSakayAPIService
      .getOneBusAccountData(this.busDriverData.userData._userId)
      .then((response: any) => {
        if (response.error) {
          console.log(response);
        }
        if (!response.error) {
          this.busProfileData.push({
            text: response.busName,
            value: response._id
          });
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
  }

  getAllTripHistory = (payload: any) => {
    console.log(this.busDriverData.userData);
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
    const today = this.generateReportForm.get('today');
    const dateFrom = this.generateReportForm.get('dateFrom');
    const dateTo = this.generateReportForm.get('dateTo');
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
    const dateTo = this.generateReportForm.get('dateTo');
    this.maxDate = this.setDateObject(dateTo?.value);
    console.log('setMax', this.setDateObject(dateTo?.value));
  };

  setMinDate = () => {
    const dateFrom = this.generateReportForm.get('dateFrom');
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
    const busAccount = this.generateReportForm.get('busAccount');
    const passengerAccount = this.generateReportForm.get('passengerAccount');
    const dateFrom = this.generateReportForm.get('dateFrom');
    const dateTo = this.generateReportForm.get('dateTo');
    const today = this.generateReportForm.get('today');

    const payload: any = {};
    Object.keys(this.generateReportForm.controls).forEach(key => {
      if (this.generateReportForm.controls[key].value) {
        payload[key] = this.generateReportForm.controls[key].value;
      }
    });
    console.log(payload);
    return payload;
  };

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
    console.log(this.generateReportForm);
    // this.generatePDFReport();
  };

  ngDoCheck(): void {}
}
