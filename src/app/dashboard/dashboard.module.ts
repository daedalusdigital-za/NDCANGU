import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ListFaqsComponent } from './list-faqs/list-faqs.component';
import { ListTutorialsComponent } from './list-tutorials/list-tutorials.component';
import { ListReportsComponent } from './reports/list-reports/list-reports.component';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { ListStatsComponent } from './list-stats/list-stats.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from '../shared/shared.module';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLayoutComponent,
    ListFaqsComponent,
    ListTutorialsComponent,
    ListReportsComponent,
    // AddReportComponent,
    AddStatsComponent,
    ListStatsComponent,
    VerifyPhoneNumberComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MultiSelectModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgApexchartsModule
  ]
})
export class DashboardModule { }
