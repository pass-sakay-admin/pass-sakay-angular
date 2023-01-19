import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { BusAccountComponent } from './bus-accounts/bus-accounts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PassengerComponent } from './passenger/passenger.component';
import { PassengerAddEditComponent } from './passenger-addEdit/passenger-addEdit.component';
import { BusAccountAddEditComponent } from './bus-accounts-addEdit/bus-accounts-addEdit.component';
import { TripScheduleComponent } from './trip-schedules/trip-schedule.component';
import { TripScheduleAddEditComponent } from './trip-schedules-addEdit/trip-schedules-addEdit.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { AdminReportsComponent } from './reports/admin-reports.component';
import { ContactTracingComponent } from './contact-tracing/contact-tracing.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'passengers',
        component: PassengerComponent,
      },
      {
        path: 'passengers/:id',
        component: PassengerAddEditComponent,
      },
      {
        path: 'passengers/add',
        component: PassengerAddEditComponent,
      },
      {
        path: 'bus-accounts',
        component: BusAccountComponent,
      },
      {
        path: 'bus-accounts/:id',
        component: BusAccountAddEditComponent,
      },
      {
        path: 'bus-accounts/add',
        component: BusAccountAddEditComponent,
      },
      {
        path: 'trip-schedules',
        component: TripScheduleComponent,
      },
      {
        path: 'trip-schedules/:id',
        component: TripScheduleAddEditComponent,
      },
      {
        path: 'trip-schedules/add',
        component: TripScheduleAddEditComponent,
      },
      {
        path: 'trip-history',
        component: TripHistoryComponent,
      },
      {
        path: 'trip-history/:id',
        component: TripHistoryComponent,
      },
      {
        path: 'reports',
        component: AdminReportsComponent,
      },
      {
        path: 'contact-tracing',
        component: ContactTracingComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
