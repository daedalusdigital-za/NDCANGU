import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ListFaqsComponent } from './list-faqs/list-faqs.component';
import { ListTutorialsComponent } from './list-tutorials/list-tutorials.component';
import { ListReportsComponent } from './list-reports/list-reports.component';
import { AddReportComponent } from './add-report/add-report.component';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { ListStatsComponent } from './list-stats/list-stats.component';
import { GuiGridModule } from '@generic-ui/ngx-grid';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLayoutComponent,
    ListUsersComponent,
    AddUserComponent,
    ListFaqsComponent,
    ListTutorialsComponent,
    ListReportsComponent,
    AddReportComponent,
    AddStatsComponent,
    ListStatsComponent
  ],
  imports: [
    CommonModule,
    GuiGridModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
