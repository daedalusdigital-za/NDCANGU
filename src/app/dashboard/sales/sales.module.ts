import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { SalesReportsComponent } from './sales-reports/sales-reports.component';
import { ProductManagementComponent } from './product-management/product-management.component';

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

@NgModule({
  declarations: [
    SalesComponent,
    SalesDashboardComponent,
    AddSaleComponent,
    ListSalesComponent,
    SalesReportsComponent,
    ProductManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SalesRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule
  ]
})
export class SalesModule { }
