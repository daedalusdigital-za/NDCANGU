import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReportComponent } from './add-report/add-report.component';
import { CustomReportsComponent } from './custom-reports/custom-reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'custom-reports', pathMatch: 'full' },
  { path: 'add-report', component: AddReportComponent },
  { path: 'custom-reports', component: CustomReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }