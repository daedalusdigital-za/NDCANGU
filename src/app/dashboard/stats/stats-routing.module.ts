import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { ListStatsComponent } from './list-stats/list-stats.component';

const routes: Routes = [
  {
    path: 'upload',
    component: AddStatsComponent
  },
  {
    path: 'list',
    component: ListStatsComponent
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
