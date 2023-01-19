import { LocalStorageService } from './local-storage.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private snackBarService: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error) {
          this.snackBarService.open(error.error.message, 'Got it', {
            duration: 5000,
          });
        }
        return throwError(() => new Error(error.error.message));
      })
    );
  }
}
