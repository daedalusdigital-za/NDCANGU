import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { ListTrainingComponent } from './list-training/list-training.component';
import { TrainersComponent } from './trainers/trainers.component';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditTrainingComponent } from './edit-training/edit-training.component';

@NgModule({
  declarations: [
    TrainingComponent,
    AddTrainingComponent,
    ListTrainingComponent,
    TrainersComponent,
    EditTrainingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TrainingRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DynamicDialogModule,
    TooltipModule,
    FileUploadModule,
    InputNumberModule,
    InputTextareaModule
  ]
})
export class TrainingModule { }
