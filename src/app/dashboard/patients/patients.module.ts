import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { PatientsRoutingModule } from './patients-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListPatientsComponent,
    AddPatientComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientsRoutingModule
  ]
})
export class PatientsModule { }
