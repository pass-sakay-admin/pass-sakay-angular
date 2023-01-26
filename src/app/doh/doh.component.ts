import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doh',
  templateUrl: './doh.component.html',
  styleUrls: ['./doh.component.scss']
})
export class DOHComponent implements OnInit {

  public sideNavOpened: boolean = true;
  public userData: any = {};

  constructor(
    public authService: AuthService,
    public localStorageService: LocalStorageService,
    private router: Router,
    private snackbarService: MatSnackBar,
  ) { }


  ngOnInit(): void {
    const loginData = this.authService.checkAuth(environment.STORAGE_KEY).data;
    const parsedLoginData = JSON.parse(loginData);
    if (loginData && parsedLoginData && parsedLoginData.userRole == environment.USER_ROLE.DOH) {
      this.userData = parsedLoginData;
    } else {
      this.router.navigate(['/welcome/login']);
    }
    console.log(this.userData);
  }

  sideNavToggler = () => {
    this.sideNavOpened = !this.sideNavOpened;
  }

}
