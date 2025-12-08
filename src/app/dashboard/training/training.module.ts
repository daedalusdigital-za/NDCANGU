import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { TrainersComponent } from './trainers/trainers.component';
import { TrainingSessionsListComponent } from './training-sessions-list/training-sessions-list.component';
import { TrainingReportsComponent } from './training-reports/training-reports.component';

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
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { UploadTrainingDocumentsComponent } from './components/upload-training-documents/upload-training-documents.component';

// PrimeNG Services
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    TrainingComponent,
    AddTrainingComponent,
    TrainersComponent,
    EditTrainingComponent,
    TrainingSessionsListComponent,
    TrainingReportsComponent,
    UploadTrainingDocumentsComponent
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
    TooltipModule,
    FileUploadModule,
    InputNumberModule,
    InputTextareaModule,
    ProgressBarModule
  ],
  providers: [
    DialogService,
    ConfirmationService
  ]
})
export class TrainingModule { }
