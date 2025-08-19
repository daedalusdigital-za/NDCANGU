import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { AddReportComponent } from './add-report/add-report.component';
import { CustomReportsComponent } from './custom-reports/custom-reports.component';

@NgModule({
  declarations: [
    AddReportComponent,
    CustomReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
