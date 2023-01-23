import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutModule } from './layout/layout.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PassengerComponent } from './passenger/passenger.component';
import { PassengerAddEditComponent } from './passenger-addEdit/passenger-addEdit.component';
import { BusAccountComponent } from './bus-accounts/bus-accounts.component';
import { BusAccountAddEditComponent } from './bus-accounts-addEdit/bus-accounts-addEdit.component';
import { TripScheduleComponent } from './trip-schedules/trip-schedule.component';
import { TripScheduleAddEditComponent } from './trip-schedules-addEdit/trip-schedules-addEdit.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { AdminReportsComponent } from './reports/admin-reports.component';
import { ContactTracingComponent } from './contact-tracing/contact-tracing.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    PassengerComponent,
    BusAccountComponent,
    TripScheduleComponent,
    PassengerAddEditComponent,
    BusAccountAddEditComponent,
    TripScheduleAddEditComponent,
    TripHistoryComponent,
    AdminReportsComponent,
    ContactTracingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    ZXingScannerModule,
    LayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatStepperModule,

    NgbModule,
  ]
})
export class AdminModule { }
