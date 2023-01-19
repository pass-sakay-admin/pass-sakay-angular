import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public tripHistoryToday: number = 0;
  public tripHistoryAll: number = 0;
  public tripHistoryMonthly: number = 0;
  public passengerCount: number = 0;
  public busAccountsCount: number = 0;

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService
  ) { }

  ngOnInit() {
    this.getCounts();
  }

  getCounts = (): void => {
    this.getPassengerCountAll(true);
    this.getBusAccountsCountAll(true);

    const allBody = { All: true }
    this.getTripHistoryCountAll(allBody);

    const todayBody = { today: new Date() };
    this.getTripHistoryCountToday(todayBody);

    const thisMonth = { 
      dateFrom:  moment().startOf('month'), 
      dateTo: moment().endOf('month')
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

  getPassengerCountAll = (body: any): void => {
    this.passSakayAPIService.getPassengerCount({All: body})
      .then((response: any) => {
        this.passengerCount = response;
      })
      .catch(error => console.log(error))
  }

  getBusAccountsCountAll = (body: any): void => {
    this.passSakayAPIService.getBusAccountsCount({All: body})
      .then((response: any) => {
        this.busAccountsCount = response;
      })
      .catch(error => console.log(error))
  }
}
