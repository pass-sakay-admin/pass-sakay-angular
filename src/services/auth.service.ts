import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from 'src/services/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import jwt_decode from "jwt-decode";
import { Login } from 'src/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClientNoInterceptor: HttpClient,
    public localStorageService: LocalStorageService,
    private snackBarService: MatSnackBar,
    private router: Router,
  ) { }

  public hasError: Boolean = false;
  public userData: Object = {};

  openSnackBar(message: string, action: string) {
    this.snackBarService.open(message, action);  
  }

  public checkAuth(data: any): any {
    const loginData = this.localStorageService.get(data)
    if (!loginData) {
      this.router.navigate(['/welcome/login']).then(() => {
        this.openSnackBar("Missing access token. Please login first.", "Got it");
      });
    } else {
      return jwt_decode(loginData.accessToken);
    }
  }

  public async loginUser(body: any): Promise<any> {
    try {
      return await new Promise<any>((resolve: any, reject: any) => {
        this.apiLoginUser(body).subscribe((data: any) => {
          const loginData: any = jwt_decode(data.accessToken);
          const parsedLoginData = JSON.parse(loginData.data)
          console.log("auth loginData", parsedLoginData);
          this.userData = parsedLoginData;
          resolve(data);
        }),
          (error: any) => {
            reject(error);
          };
      });
    } catch (error) {
      return error;
    }
  }

  private apiLoginUser(body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });
    const endpoint = 'http://localhost:4300/pass-sakay-v1/api/auth/login';
    return this.httpClientNoInterceptor
      .post(endpoint, body, { headers: headers })
      .pipe(
        map((data: Object) => data),
        catchError(async (err) => console.log('http-error', err))
      );
  }
}
