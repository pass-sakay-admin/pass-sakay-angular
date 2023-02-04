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
  public filteredTripHistoryList: Array<any> = [];
  public scanType: string = "";
  public filterMode: boolean = false;

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

  handleFilterTripHistory = (scanType: string) => {
    this.filteredTripHistoryList = this.tripHistoryList;
    this.scanType = scanType;
    this.filterMode = true;
    this.filterTripHistory(scanType);
  }

  filterTripHistory = (scanType: string): any => {
    if (scanType == "scan-in" || scanType == "scan-out") {
      this.filteredTripHistoryList = 
        this.filteredTripHistoryList.filter((trip: any) => trip.ScanType === scanType);
    }
    console.log(this.filteredTripHistoryList);
    return this.filteredTripHistoryList
  }

  getAllTripHistory = () => {
    console.log(this.passengerData.userData);
    this.passSakayAPIService
      .getAllTripHistoryDataViaPassenger(this.passengerData.userData._userId)
      .then((data: any) => {
        data.forEach((tripHistory: any, index: number) => {
          const passenger = tripHistory.passengerAccount;
          const fullname = `
            ${passenger.lastname}, 
            ${passenger.firstname} 
            ${passenger.middlename ? passenger.middlename : ""}
          `;
          const busDetails = `
              ${tripHistory.busAccount.busName} - 
              ${tripHistory.busAccount.busNumber}
            `;
          this.tripHistoryList.push({
            _id: tripHistory._id,
            Date: moment(tripHistory.date).format('MMM DD YYYY'),
            Time: moment(tripHistory.time).format('HH:mm:ss A'),
            TimeIn: tripHistory.timeIn ? moment(tripHistory.timeIn).format('HH:mm:ss A') : "--:--:-- --",
            TimeOut: tripHistory.timeOut ? moment(tripHistory.timeOut).format('HH:mm:ss A') : "--:--:-- --",
            rowId: index + 1,
            PassengerName: fullname,
            BusName: busDetails,
            ScanType: tripHistory.tripType,
            Temperature: tripHistory.temperature || "N/A",
            SeatNumber: tripHistory.seatNumber || "N/A",
            VaccineCode: tripHistory.vaccineCode || "N/A",
            TripSched: `
              ${tripHistory.tripSched.name} 
              (${tripHistory.tripSched.startTime} - ${tripHistory.tripSched.endTime})
            `,
            PlaceOfPickUp: `
            ${tripHistory.landmark ? tripHistory.landmark : 'N/A'} - 
            ${tripHistory.tripPlaceOfScan ? tripHistory.tripPlaceOfScan : 'N/A'}
            `,
            PlaceOfDropoff: `
              ${tripHistory.landmarkOut ? tripHistory.landmarkOut : 'N/A'} - 
              ${tripHistory.tripPlaceOfScanOut ? tripHistory.tripPlaceOfScanOut : 'N/A'}
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
