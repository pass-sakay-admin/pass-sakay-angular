import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/services/local-storage.service';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';

@Component({
  selector: 'app-bus-accounts',
  templateUrl: './bus-accounts.component.html',
  styleUrls: ['./bus-accounts.component.scss'],
})
export class BusAccountComponent implements OnInit {
  public breakpoint: number = 0;
  public busAccountList: Array<any> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService
  ) {}

  ngOnInit() {
    this.getAllBusAccounts();
  }

  getAllBusAccounts = () => {
    this.passSakayAPIService
      .getAllBusAccountData()
      .then((data: any) => {
        data.forEach((busAccountData: any, index: number) => {
          const fullname = `
            ${busAccountData.lastname}, 
            ${busAccountData.firstname} 
            ${busAccountData.middlename ? busAccountData.middlename : ''}
          `;
          this.busAccountList.push({
            _id: busAccountData._id,
            rowId: index + 1,
            BusName: busAccountData.busName,
            BusNumber: busAccountData.busNumber,
            BusProvince: busAccountData.busProvince,
            isVerified: busAccountData.isApproved,
            Status: busAccountData.status,
          });
        });
      })
      .catch((error: any) => {
        this.snackBarService.open(
          'Failed to load bus account data. Check your internet connection.',
          'Got it'
        );
      });
  };

  onSelectRow = (busAccountData: any) => {
    console.log(busAccountData);
    this.router.navigate(['/admin/bus-accounts/' + busAccountData._id]);
  };
}
