import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStatsComponent } from './add-stats/add-stats.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { ReportsComponent } from './reports.component';
import { ListStatsComponent } from './list-stats/list-stats.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path: 'stats',
        component: ListStatsComponent
      },
      {
        path: 'document/upload',
        component: AddStatsComponent
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
       {
        path: 'tests',
        loadChildren: () => import('./tests/tests.module').then(m => m.TestsModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'training',
        loadChildren: () => import('./training/training.module').then(m => m.TrainingModule),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
