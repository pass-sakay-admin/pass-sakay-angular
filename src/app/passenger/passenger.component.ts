import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.component.html',
  styleUrls: ['./passenger.component.scss']
})
export class PassengerComponent implements OnInit {

  public userData: any;

  constructor(
    private router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    const loginData = this.authService.checkAuth(environment.STORAGE_KEY).data;
    const parsedLoginData = JSON.parse(loginData)
    if (loginData && parsedLoginData && parsedLoginData.userRole == environment.USER_ROLE.Passenger) {
      this.userData = parsedLoginData;
    } else {
      this.router.navigate(['/welcome/login']);
    }
  }

}
