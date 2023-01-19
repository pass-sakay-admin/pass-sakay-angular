import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { PassSakayCollectionService } from 'src/services/pass-sakay-api.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bus-driver',
  templateUrl: './bus-driver.component.html',
  styleUrls: ['./bus-driver.component.scss']
})
export class BusDriverComponent implements OnInit {

  sideNavOpened: boolean = true;
  public userData: any = {};
  public busProfileData: any = {};

  constructor(
    public authService: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private snackbarService: MatSnackBar,
    private passSakayAPIService: PassSakayCollectionService
  ) { }


  ngOnInit(): void {
    const loginData = this.authService.checkAuth(environment.STORAGE_KEY).data;
    const parsedLoginData = JSON.parse(loginData);
    if (loginData && parsedLoginData && parsedLoginData.userRole == environment.USER_ROLE.BusDriver) {
      this.userData = parsedLoginData;
    } else {
      this.router.navigate(['/welcome/login']);
    }
    this.getBusProfile();
  }

  getBusProfile = () => {
    this.passSakayAPIService
      .getOneBusAccountData(this.userData._userId)
      .then((response: any) => {
        if (response.error) {
          console.log(response);
        }
        if (!response.error) {
          this.busProfileData = response;
        }
      })
      .catch((err: any) => {
        console.log('add passenger error', err);
      });
  }

  sideNavToggler = () => {
    this.sideNavOpened = !this.sideNavOpened;
  }

}
