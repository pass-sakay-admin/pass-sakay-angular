import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DOHRoutingModule } from './doh-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutModule } from './layout/layout.module';
import { DOHComponent } from './doh.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TripScheduleComponent } from './trip-schedules/trip-schedule.component';
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
    DOHComponent,
    DashboardComponent,
    TripScheduleComponent,
    TripHistoryComponent,
    AdminReportsComponent,
    ContactTracingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DOHRoutingModule,
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
export class DOHModule { }
