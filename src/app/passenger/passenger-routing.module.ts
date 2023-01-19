import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PassengerComponent } from './passenger.component';
import { PassengerProfileComponent } from './profile/passenger-profile.component';
import { PassengerTripHistoryComponent } from './trip-history/passenger-trip-history.component';
import { PassengerAccountSettingsComponent } from './account-settings/passenger-account-settings.component';
import { PassengerTripScheduleComponent } from './trip-schedules/trip-schedule.component';

const routes: Routes = [
  { 
    path: 'passenger',
    component: PassengerComponent,
    children: [
      {
        path: 'profile',
        component: PassengerProfileComponent
      },
      {
        path: 'trip-history',
        component: PassengerTripHistoryComponent
      },
      {
        path: 'trip-schedule',
        component: PassengerTripScheduleComponent
      },
      {
        path: 'account-settings',
        component: PassengerAccountSettingsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerRoutingModule { }
