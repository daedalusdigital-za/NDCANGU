import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingComponent } from './training.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { ListTrainingComponent } from './list-training/list-training.component';
import { TrainersComponent } from './trainers/trainers.component';
import { TrainingSessionsListComponent } from './training-sessions-list/training-sessions-list.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingComponent
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
    path: 'sessions',
    component: TrainingSessionsListComponent
  },
  {
    path: 'trainers',
    component: TrainersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
