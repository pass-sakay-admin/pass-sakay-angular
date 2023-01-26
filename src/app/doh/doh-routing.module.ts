import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DOHComponent } from './doh.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TripScheduleComponent } from './trip-schedules/trip-schedule.component';
import { TripHistoryComponent } from './trip-history/trip-history.component';
import { AdminReportsComponent } from './reports/admin-reports.component';
import { ContactTracingComponent } from './contact-tracing/contact-tracing.component';

const routes: Routes = [
  {
    path: 'doh',
    component: DOHComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'trip-schedules',
        component: TripScheduleComponent,
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
export class DOHRoutingModule { }
