import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import * as XLSX from 'xlsx';
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
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
})
export class AdminReportsComponent implements OnInit {
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
  public passengerList: Array<any> = [];

  public pdfBody: Array<any> = [];
  public pdfHeaders: Array<any> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService,
  ) {}

  ngOnInit() {
    this.getAllBusProfile();
    this.getAllPassengers();
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

  getAllBusProfile = () => {
    this.passSakayAPIService
      .getAllBusAccountData()
      .then((response: any) => {
        if (response.error) {
          console.log(response);
        }
        if (!response.error) {
          response.forEach((data: any) => {
            this.busProfileData.push({
              text: data.busName,
              value: data._id
            });
          });
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
  }

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
    const busAccount = this.generateReportForm.get('busAccount');
    const passengerAccount = this.generateReportForm.get('passengerAccount');
    const dateFrom = this.generateReportForm.get('dateFrom');
    const dateTo = this.generateReportForm.get('dateTo');
    const today = this.generateReportForm.get('today');
    const body: any = {};
    if (today) {
      body.today = new Date();
    }
    if (dateFrom) {
      body.dateFrom = dateFrom?.value;
    }
    if (dateTo) {
      body.dateTo = dateTo?.value;
    }
    if (busAccount) {
      body.busAccount = busAccount?.value;
    }
    if (passengerAccount) {
      body.passengerAccount = passengerAccount?.value;
    }

    this.passSakayAPIService.generateTripReport(body)
      .then(data => {
        const xlsxData: Array<any> = [];
        if (data.length > 0) {
          data.forEach((tripHistory: any, idx: number) => {
            const passenger = tripHistory.passengerAccount;
            const xlsxRow: any = {
              ID: idx + 1,
              Lastname: passenger.lastname || "",
              Firstname: passenger.firstname || "",
              Middlename: passenger.middlename || "",
              Date: tripHistory.date ? moment(tripHistory.date).format('MMM DD YYYY') : "",
              "Time In": tripHistory.timeIn ? moment(tripHistory.timeIn).format('HH:mm:ss A') : "",
              "Time Out": tripHistory.timeOut ? moment(tripHistory.timeOut).format('HH:mm:ss A') : "",
              "Place Of PickUp": `
                ${tripHistory.landmark ? tripHistory.landmark : ''} - 
                ${tripHistory.tripPlaceOfScan ? tripHistory.tripPlaceOfScan : ''}
              `,
              "Place Of Dropoff": `
                ${tripHistory.landmarkOut ? tripHistory.landmarkOut : ''} - 
                ${tripHistory.tripPlaceOfScanOut ? tripHistory.tripPlaceOfScanOut : ''}
              `,
              "Bus Name": tripHistory.busAccount.busName || "",
              "Bus Plate Number": tripHistory.busAccount.busNumber || "",
              "Trip Schedule": `
                ${tripHistory.tripSched.name} 
                (${tripHistory.tripSched.startTime} - ${tripHistory.tripSched.endTime})
              `,
              Temperature: tripHistory.temperature || "N/A",
              "Seat Number": tripHistory.seatNumber || "N/A",
              "Vaccine Code": tripHistory.vaccineCode || "N/A",
            }
            xlsxData.push(xlsxRow);
          });
        } else {
          xlsxData.push({
            "NO DATA RETRIEVED": "No records found with the given report parameters."
          })
        }

        const ws = XLSX.utils.json_to_sheet(xlsxData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        const fileName = `trip-report-${Date.now()}.csv`;
        XLSX.utils.book_append_sheet(wb, ws, 'Trip Report ' + moment().format('MMM DD YYYY'));
        XLSX.writeFile(wb, fileName);
      })
      .catch(error => {
        console.error(error);
      });
  };

  ngDoCheck(): void {}
}
