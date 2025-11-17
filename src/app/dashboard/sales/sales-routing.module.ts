import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { SalesReportsComponent } from './sales-reports/sales-reports.component';
import { ProductManagementComponent } from './product-management/product-management.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      {
        path: '',
        component: SalesDashboardComponent
      },
      {
        path: 'dashboard',
        component: SalesDashboardComponent
      },
      {
        path: 'add',
        component: AddSaleComponent
      },
      {
        path: 'edit/:id',
        component: AddSaleComponent
      },
      {
        path: 'list',
        component: ListSalesComponent
      },
      {
        path: 'reports',
        component: SalesReportsComponent
      },
      {
        path: 'products',
        component: ProductManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
