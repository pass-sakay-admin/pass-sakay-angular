import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { PassengerComponent } from '../passenger.component';

@Component({
  selector: 'app-passenger-trip-history',
  templateUrl: './passenger-trip-history.component.html',
  styleUrls: ['./passenger-trip-history.component.scss'],
})
export class PassengerTripHistoryComponent implements OnInit {
  public breakpoint: number = 0;

  public tripHistoryList: Array<any> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService,
    private passengerData: PassengerComponent
  ) {}

  ngOnInit() {
    this.getAllTripHistory();
  }

  // /scanned-qr/trip-history/:passenger_id

  getAllTripHistory = () => {
    console.log(this.passengerData.userData);
    this.passSakayAPIService
      .getAllTripHistoryDataViaPassenger(this.passengerData.userData._userId)
      .then((data: any) => {
        data.forEach((tripHistory: any, index: number) => {
          this.tripHistoryList.push({
            _id: tripHistory._id,
            Date: moment(tripHistory.date).format('MMM DD YYYY'),
            Time: moment(tripHistory.time).format('HH:mm:ss A'),
            rowId: index + 1,
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
}
