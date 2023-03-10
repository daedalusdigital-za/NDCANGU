import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReportComponent } from './add-report/add-report.component';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { ListFaqsComponent } from './list-faqs/list-faqs.component';
import { ListReportsComponent } from './list-reports/list-reports.component';
import { ListStatsComponent } from './list-stats/list-stats.component';
import { ListTutorialsComponent } from './list-tutorials/list-tutorials.component';
import { ListUsersComponent } from './list-users/list-users.component';

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
        path: 'list-users',
        component: ListUsersComponent
      },
      {
        path: 'add-user',
        component: AddUserComponent
      },
      {
        path: 'list-faqs',
        component: ListFaqsComponent
      },
      {
        path: 'list-tutorials',
        component: ListTutorialsComponent
      },
      {
        path: 'list-reports',
        component: ListReportsComponent
      },
      {
        path: 'add-report',
        component: AddReportComponent
      },
      {
        path: 'list-stats',
        component: ListStatsComponent
      },
      {
        path: 'add-stats',
        component: AddStatsComponent
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
