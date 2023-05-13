import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReportComponent } from './add-report/add-report.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'add',
        component: AddReportComponent
      },
      {
        path: 'add/:id',
        component: AddReportComponent
      },
      // {
      //   path: 'add',
      //   component: AddPatientComponent
      // },
      // {
      //   path: 'edit/:id',
      //   component: AddPatientComponent
      // },
      { path: '', redirectTo: 'add', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
