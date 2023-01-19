import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusDriverRoutingModule } from './bus-driver-routing.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutModule } from './layout/layout.module';
import { BusDriverComponent } from './bus-driver.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { ReportsComponent } from '../bus-driver/reports/reports.component';

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

@NgModule({
  declarations: [
    BusDriverComponent,
    QrScannerComponent,
    DashboardComponent,
    TripHistoryComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusDriverRoutingModule,
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

    NgbModule,
  ]
})
export class BusDriverModule { }
