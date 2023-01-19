import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';

@Component({
  selector: 'app-trip-schedules',
  templateUrl: './trip-schedule.component.html',
  styleUrls: ['./trip-schedule.component.scss'],
})
export class PassengerTripScheduleComponent implements OnInit {
  public breakpoint: number = 0;
  public tripScheduleList: Array<any> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private route: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService
  ) {}

  ngOnInit() {
    this.getAllTripSchedules();
  }

  getAllTripSchedules = () => {
    this.passSakayAPIService
      .getAllTripScheduleData()
      .then((data: any) => {
        data.forEach((tripSched: any, index: number) => {
          this.tripScheduleList.push({
            _id: tripSched._id,
            rowId: index + 1,
            ScheduleName: tripSched.name,
            BusName: tripSched.busAccount.busName,
            Days: tripSched.daysRoutine.join(', '),
            Time: `${tripSched.startTime} - ${tripSched.endTime}`,
            Route: `${tripSched.startingPoint} - ${tripSched.finishingPoint}`,
            Status: tripSched.status,
          });
        });
      })
      .catch((error: any) => {
        console.log(error)
        this.snackBarService.open(
          'Failed to load trip schedule data. Check your internet connection.',
          'Got it'
        );
      });
  };

  onSelectRow = (busAccountData: any) => {
    console.log(busAccountData);
  };
}
