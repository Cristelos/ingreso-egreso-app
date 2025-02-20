import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dasboard.routes';
// import { isAuthenticatedGuard } from '../services/auth.guard';

const rutasHijas: Routes = [
    {
      path: '',
      component: DashboardComponent,
      children: dashboardRoutes,
      // canActivate: [isAuthenticatedGuard]
    },
]

@NgModule({
  imports: [RouterModule.forChild(rutasHijas)],
  exports: [RouterModule]
})
export class DasboardRoutesModule { }
