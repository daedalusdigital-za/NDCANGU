import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';
import { ReportsComponent } from './reports.component';

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
        loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule)
      },
      {
        path: 'document/upload',
        redirectTo: 'stats/upload',
        pathMatch: 'full'
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
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
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
