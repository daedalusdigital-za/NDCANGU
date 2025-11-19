import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from './training.component';
import { TrainingUploadComponent } from './training-upload/training-upload.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { ListTrainingComponent } from './list-training/list-training.component';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { TrainersComponent } from './trainers/trainers.component';
import { TrainingReportsComponent } from './training-reports/training-reports.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingComponent
  },
  {
    path: 'upload',
    component: TrainingUploadComponent
  },
  {
    path: 'add',
    component: AddTrainingComponent
  },
  {
    path: 'list',
    component: ListTrainingComponent
  },
  {
    path: 'edit/:id',
    component: EditTrainingComponent
  },
  {
    path: 'trainers',
    component: TrainersComponent
  },
  {
    path: 'reports',
    component: TrainingReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
