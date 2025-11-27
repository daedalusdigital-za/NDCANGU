import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Routing
import { InventoryRoutingModule } from './inventory-routing.module';

// Services
import { InventoryService } from '../../services/inventory/inventory.service';

// Components
import { StockManagementComponent } from './stock-management/stock-management.component';

@NgModule({
  declarations: [
    StockManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InventoryRoutingModule
  ],
  providers: [
    InventoryService
  ]
})
export class InventoryModule { }
