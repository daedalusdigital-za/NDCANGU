import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ListFaqsComponent } from './list-faqs/list-faqs.component';
import { ListTutorialsComponent } from './list-tutorials/list-tutorials.component';
import { ReportsComponent } from './reports.component';
import { AuthDebugComponent } from './auth-debug.component';
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
    ReportsComponent,
    AuthDebugComponent,
    // AddReportComponent,
    AddStatsComponent,
    ListStatsComponent,
    VerifyPhoneNumberComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    MultiSelectModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class DashboardModule { }
