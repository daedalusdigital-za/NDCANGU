import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { ListFaqsComponent } from './list-faqs/list-faqs.component';
import { ListReportsComponent } from './list-reports/list-reports.component';
import { ListStatsComponent } from './list-stats/list-stats.component';
import { ListTutorialsComponent } from './list-tutorials/list-tutorials.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path: 'faqs',
        component: ListFaqsComponent
      },
      {
        path: 'tutorials',
        component: ListTutorialsComponent
      },
      {
        path: 'reports',
        component: ListReportsComponent
      },

      {
        path: 'stats',
        component: ListStatsComponent
      },
      {
        path: 'document/upload',
        component: AddStatsComponent
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'patients',
        loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
