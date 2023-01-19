import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/welcome/login', pathMatch: 'full' },
  { path: 'bus-driver', redirectTo: '/bus-driver/dashboard', pathMatch: 'full' },
  { path: 'passenger', redirectTo: '/passenger/profile', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  {
    path: 'passenger',
    loadChildren: () =>
      import('./passenger/passenger.module').then((m) => m.PassengerModule),
  },
  {
    path: 'bus-driver',
    loadChildren: () =>
      import('./bus-driver/bus-driver.module').then((m) => m.BusDriverModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
