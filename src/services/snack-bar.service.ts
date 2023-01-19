import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(
    private snackBar: MatSnackBar,
  ) {}

  public showSnackBar(message: string, action: any, duration?: any) {
    if (duration) {
        return this.snackBar.open(message, action, { duration: duration });
    }
    return this.snackBar.open(message, action)
  }
}
