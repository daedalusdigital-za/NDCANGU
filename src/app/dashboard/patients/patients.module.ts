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
import { ModalRecordTestComponent } from './list-patients/modal-record-test/modal-record-test.component';
import { MultiSelectModule } from 'primeng/multiselect';



@NgModule({
  declarations: [
    ListPatientsComponent,
    AddPatientComponent,
    MedicalHistoryComponent,
    ModalRecordTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ButtonModule,
    PatientsRoutingModule,
    MultiSelectModule
  ]
})
export class PatientsModule { }
