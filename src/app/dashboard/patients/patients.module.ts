import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPatientsComponent } from './list-patients/list-patients.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { PatientsRoutingModule } from './patients-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    ListPatientsComponent,
    AddPatientComponent,
    MedicalHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ButtonModule,
    PatientsRoutingModule
  ]
})
export class PatientsModule { }
