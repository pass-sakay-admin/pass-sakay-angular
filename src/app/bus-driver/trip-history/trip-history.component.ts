import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';
import { BusDriverComponent } from '../bus-driver.component';
import jsPDF from 'jspdf'; 

@Component({
  selector: 'app-bus-driver-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.scss'],
})
export class TripHistoryComponent implements OnInit {
  @ViewChild('content') content!:ElementRef;  
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
    private busDriverData: BusDriverComponent
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
    console.log(this.busDriverData.userData);
    this.passSakayAPIService
      .getAllTripHistoryDataViaBusAccount(this.busDriverData.userData._userId)
      .then((data: any) => {
        data.forEach((tripHistory: any, index: number) => {
          const passenger = tripHistory.passengerAccount;
          const fullname = `
            ${passenger.lastname}, 
            ${passenger.firstname} 
            ${passenger.middlename ? passenger.middlename : ""}
          `
          this.tripHistoryList.push({
            _id: tripHistory._id,
            Date: moment(tripHistory.date).format('MMM DD YYYY'),
            Time: moment(tripHistory.time).format('HH:mm:ss A'),
            rowId: index + 1,
            PassengerName: fullname,
            BusName: `${tripHistory.busAccount.busName}`,
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

  save(): void {  
    console.log("sdafahdsfka")
    let content=this.content.nativeElement;  
    let doc: any = new jsPDF('p','mm','a4');  
    let _elementHandlers =  
    {  
      '#editor':function(element: any, renderer: any){  
        return true;  
      }  
    };  
    doc.html(content.innerHTML, {  
      'x': 15,
      'y': 15,
      'width':190,  
      'elementHandlers':_elementHandlers  
    });  
  
    doc.save('test.pdf');  
  }  

  ngDoCheck(): void { }
}
