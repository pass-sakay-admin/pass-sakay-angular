import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusDriverComponent } from './bus-driver.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ReportsComponent } from '../bus-driver/reports/reports.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';

const routes: Routes = [
  {
    path: 'bus-driver',
    component: BusDriverComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'qr-scanner',
        component: QrScannerComponent,
      },
      {
        path: 'trip-history',
        component: TripHistoryComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusDriverRoutingModule { }
