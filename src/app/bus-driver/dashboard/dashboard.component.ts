import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { BusDriverComponent } from '../bus-driver.component';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public breakpoint: number = 0;
  public tripHistoryToday: number = 0;
  public tripHistoryAll: number = 0;
  public tripHistoryMonthly: number = 0;

  public busProfileDataFormGroup: FormGroup = new FormGroup({});

  public genderList: Array<string> = ['Male', 'Female'];
  public busAccountData: { [key:string]: string } = {};
  public passengerQRData!: string;
  public editMode: boolean = false;
  public busAccountDataFormGroup!: FormGroup;

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService,
    private busDriverData: BusDriverComponent
  ) {}

  ngOnInit() {
    this.getCounts();
    this.initFormGroup();
    this.initBusAccountData(this.busDriverData.userData._userId);

    Object.keys(this.busAccountDataFormGroup.controls).forEach((key: any) => {
      // if (!["status", "isApproved"].includes(key)) {
        this.busAccountDataFormGroup.controls[key].disable();
      // }
    });
  }

  initFormGroup = () => {
    this.busAccountDataFormGroup = new FormGroup({
      // Bus Details
      busName: new FormControl('', Validators.required),
      busNumber: new FormControl('', Validators.required),
      busProvince: new FormControl('', Validators.required),
      // Operator Details
      operatorFullName: new FormControl('', Validators.required),
      operatorPosition: new FormControl('', Validators.required),
      operatorPhoneNumber: new FormControl('', Validators.required),
      operatorEmail: new FormControl('', [
        Validators.required, 
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]),
      acceptHighTemp: new FormControl("", Validators.required),
      acceptNoVaccination: new FormControl("", Validators.required),
      // Account Details
      isApproved: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  getCounts = (): void => {
    const allBody = { busAccount: this.busDriverData.userData._userId }
    this.getTripHistoryCountAll(allBody);

    const todayBody = { today: new Date(), busAccount: this.busDriverData.userData._userId };
    this.getTripHistoryCountToday(todayBody);

    const thisMonth = { 
      dateFrom:  moment().startOf('month'), 
      dateTo: moment().endOf('month'),
      busAccount: this.busDriverData.userData._userId
    };
    this.getTripHistoryCountMonth(thisMonth);
  }

  getTripHistoryCountToday = (body: any): void => {
    this.passSakayAPIService.getTripHistoryCount(body)
      .then((response: any) => {
        this.tripHistoryToday = response;
      })
      .catch(error => console.log(error))
  }

  getTripHistoryCountMonth = (body: any): void => {
    this.passSakayAPIService.getTripHistoryCount(body)
      .then((response: any) => {
        this.tripHistoryMonthly = response;
      })
      .catch(error => console.log(error))
  }

  getTripHistoryCountAll = (body: any): void => {
    this.passSakayAPIService.getTripHistoryCount(body)
      .then((response: any) => {
        this.tripHistoryAll = response;
      })
      .catch(error => console.log(error))
  }

  initBusAccountData = (id: any) => {
    this.passSakayAPIService
    .getOneBusAccountData(id)
      .then((response: any) => {
        if (response.error) {
          this.snackBarService.open(
            response.error.message.error_message,
            'Got it'
          );
        }
        if (!response.error) {
          console.log(response)
          this.setFormValues(response);
          this.busAccountData = response;
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
    // this.busAccountData = []
  };
  
  setFormValues = (data: any) => {
    const busName = this.busAccountDataFormGroup.get('busName');
    const busNumber = this.busAccountDataFormGroup.get('busNumber');
    const busProvince = this.busAccountDataFormGroup.get('busProvince');
    const operatorFullName = this.busAccountDataFormGroup.get('operatorFullName');
    const operatorPhoneNumber = this.busAccountDataFormGroup.get('operatorPhoneNumber');
    const operatorPosition = this.busAccountDataFormGroup.get('operatorPosition');
    const operatorEmail = this.busAccountDataFormGroup.get('operatorEmail');
    const isApproved = this.busAccountDataFormGroup.get('isApproved');
    const status = this.busAccountDataFormGroup.get('status');

    const dateObj = new Date(data.birthdate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const birthDateValue = new NgbDate(year, month, day);

    busName?.setValue(data.busName);
    busNumber?.setValue(data.busNumber);
    busProvince?.setValue(data.busProvince);
    operatorFullName?.setValue(data.operatorFullName);
    operatorPhoneNumber?.setValue(data.operatorPhoneNumber);
    operatorPosition?.setValue(data.operatorPosition);
    operatorEmail?.setValue(this.busDriverData.userData.email);
    isApproved?.setValue(data.isApproved ? "Approved" : "Disapproved");
    status?.setValue(data.status ? "Active" : "Inactive");

    console.log(this.busAccountDataFormGroup.get('status'))
  };
}
