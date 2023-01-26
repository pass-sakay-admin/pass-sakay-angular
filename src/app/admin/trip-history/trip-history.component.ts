import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-bus-driver-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.scss'],
})
export class TripHistoryComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
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
    private adminData: AdminComponent
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
    // console.log(this.adminData.userData);
    this.passSakayAPIService
      .getAllTripHistoryData()
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
              ${tripHistory.landmark} - 
              ${tripHistory.tripPlaceOfScan}
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

  save(): void {
    console.log('sdafahdsfka');
    let content = this.content.nativeElement;
    let doc: any = new jsPDF('p', 'mm', 'a4');
    let _elementHandlers = {
      '#editor': function (element: any, renderer: any) {
        return true;
      },
    };
    doc.html(content.innerHTML, {
      x: 15,
      y: 15,
      width: 190,
      elementHandlers: _elementHandlers,
    });

    doc.save('test.pdf');
  }

  openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('trip-history-list.pdf');
    });
  }
}
