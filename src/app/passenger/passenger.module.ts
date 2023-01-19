import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { QRCodeModule } from 'angularx-qrcode';

import { PassengerRoutingModule } from './passenger-routing.module';
import { PassengerComponent } from './passenger.component';
import { LayoutModule } from './layout/layout.module';
import { PassengerProfileComponent } from './profile/passenger-profile.component';
import { PassengerTripHistoryComponent } from './trip-history/passenger-trip-history.component';
import { PassengerTripScheduleComponent } from './trip-schedules/trip-schedule.component';
import { PassengerAccountSettingsComponent } from './account-settings/passenger-account-settings.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    PassengerComponent,
    PassengerProfileComponent,
    PassengerTripHistoryComponent,
    PassengerAccountSettingsComponent,
    PassengerTripScheduleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PassengerRoutingModule,
    LayoutModule,
    QRCodeModule,

    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
    NgbModule,
  ]
})
export class PassengerModule { }
