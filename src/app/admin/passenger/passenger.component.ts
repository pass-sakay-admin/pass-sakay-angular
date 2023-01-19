import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.scss']
})
export class PassengerComponent implements OnInit {
  public breakpoint: number = 0;
  public passengerList: Array<any> = []

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService
  ) { }

  ngOnInit() {
    this.getAllPassengers();
  }

  getAllPassengers = () => {
    this.passSakayAPIService.getAllPassengerData()
      .then((data: any) => {
        data.forEach((passengerData: any, index: number) => {
          const fullname = `
            ${passengerData.lastname}, 
            ${passengerData.firstname} 
            ${passengerData.middlename ? passengerData.middlename : ""}
          `
          this.passengerList.push({
            _id: passengerData._id,
            rowId: index+1,
            Fullname: fullname,
            Address: passengerData.currentAddress,
            PhoneNumber: passengerData.phoneNumber,
            Status: passengerData.status
          })
        });
      })
      .catch((error: any) => {
        this.snackBarService.open("Failed to load passenger data. Check your internet connection.", "Got it")
      })
  }

  onSelectRow = (passengerData: any) =>{
    console.log("dfasdfasdf", passengerData);
    this.router.navigate(['/admin/passengers/'+passengerData._id]);
  }

  onAddPassenger = () => {
    this.router.navigate(['/admin/passengers/add']);
  }
}