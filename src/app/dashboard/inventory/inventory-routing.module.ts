import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockManagementComponent } from './stock-management/stock-management.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full'
  },
  {
    path: 'stock',
    component: StockManagementComponent,
    data: { title: 'Stock Management' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
