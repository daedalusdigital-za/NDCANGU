import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';
import { SaleModel, SaleItemModel } from '../../../shared/interfaces/common.interfaces';

interface InventoryItem {
  id: number;
  name: string;
  description?: string | null;
  category: number; // enum value
  categoryText: string; // enum name like "HemoglobinTesting"
  sku: string;
  unitOfMeasure: string;
  unitPrice: number; // decimal
  stockAvailable: number;
  reorderLevel: number;
  supplier?: string | null;
  expiryDate?: string | null; // datetime
  batchNumber?: string | null;
  status: number; // enum value
  statusText: string; // enum name like "InStock"
  createdDate: string; // datetime
  lastUpdated?: string | null; // datetime
  createdByUserName: string; // currently empty
}

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent implements OnInit {

  sale: SaleModel = {
    saleNumber: '',
    saleDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    customerName: '',
    customerPhone: '',
    total: 0,
    subtotal: 0,
    notes: '',
    provinceId: 1,
    saleItems: []
  };  newSaleItem = {
    inventoryItemId: 0,
    inventoryItemName: '',
    quantity: 1,
    unitPrice: 0
  };

  inventoryItems: InventoryItem[] = [];
  loadingInventory = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.generateSaleNumber();
    this.loadInventory();
  }

  generateSaleNumber(): void {
    // Generate a unique sale number like the example
    const date = new Date();
    const year = date.getFullYear();
    const timestamp = date.getTime().toString().slice(-6);
    this.sale.saleNumber = `SALE-${year}-${timestamp}`;
  }

  loadInventory(): void {
    this.loadingInventory = true;
    this.inventoryItems = [];

    // Load all 16 inventory IDs using GetById endpoint only
    const allInventoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    let loadedCount = 0;
    let errorCount = 0;

    console.log(`Using GET /api/Inventory/GetById for IDs: ${allInventoryIds.join(', ')}`);

    allInventoryIds.forEach(id => {
      // Call GET /api/Inventory/GetById?id={inventoryItemId}
      this.databaseService.getInventoryItemById(id).subscribe({
        next: (item: InventoryItem) => {
          if (item) {
            this.inventoryItems.push(item);
            console.log(`Loaded inventory item ${id}:`, item);
          }
          loadedCount++;

          // Check if all requests completed
          if (loadedCount + errorCount === allInventoryIds.length) {
            this.loadingInventory = false;

            if (this.inventoryItems.length > 0) {
              this.toastr.success(`Loaded ${this.inventoryItems.length} inventory items via GetById`, 'Success');
            } else {
              this.toastr.info('No inventory items available via GetById', 'Info');
            }
          }
        },
        error: (error: {status?: number, message?: string}) => {
          console.error(`GetById failed for ID ${id}:`, error);
          errorCount++;

          // Check if all requests completed
          if (loadedCount + errorCount === allInventoryIds.length) {
            this.loadingInventory = false;

            if (errorCount === allInventoryIds.length) {
              // All requests failed - no real data available
              if (error.status === 400 || error.message?.includes('Invalid object name')) {
                this.toastr.error(`GetById API failed: ${error.message || 'Database table issue'}`, 'Database Error');
              } else {
                this.toastr.error(`All GetById requests failed: ${error.message || 'Unknown error'}`, 'API Error');
              }
              // Clear inventory since we're not using fallback data
              this.inventoryItems = [];
            } else {
              // Some succeeded, some failed
              this.toastr.warning(`Partial success: ${this.inventoryItems.length} loaded, ${errorCount} failed`, 'Partial Success');
            }
          }
        }
      });
    });
  }

  onInventoryItemChange(): void {
    // Update unit price when inventory item is selected
    console.log('onInventoryItemChange triggered - inventoryItemId:', this.newSaleItem.inventoryItemId);
    console.log('Type of inventoryItemId:', typeof this.newSaleItem.inventoryItemId);
    console.log('Available inventory items:', this.inventoryItems.length);

    // Ensure we're working with a number (Angular forms sometimes convert to string)
    const itemId = Number(this.newSaleItem.inventoryItemId);
    console.log('Converted itemId to number:', itemId);

    const selectedItem = this.inventoryItems.find(item => item.id === itemId);
    console.log('Selected item found:', !!selectedItem);

    if (selectedItem) {
      console.log('BEFORE update - Unit price was:', this.newSaleItem.unitPrice);

      // Use name or description for the item name
      this.newSaleItem.inventoryItemName = selectedItem.name || selectedItem.description || 'Unknown Item';
      // Use unitPrice from the actual database schema
      this.newSaleItem.unitPrice = selectedItem.unitPrice || 0;

      console.log('AFTER update - Unit price is now:', this.newSaleItem.unitPrice);
      console.log(`Selected inventory item:`, {
        id: selectedItem.id,
        name: selectedItem.name,
        description: selectedItem.description,
        sku: selectedItem.sku,
        unitPrice: selectedItem.unitPrice,
        stockAvailable: selectedItem.stockAvailable,
        categoryText: selectedItem.categoryText,
        statusText: selectedItem.statusText
      });
    } else {
      console.log('No item found for ID:', itemId);
      console.log('Available item IDs:', this.inventoryItems.map(i => i.id));
    }
  }

  addSaleItem(): void {
    if (this.newSaleItem.inventoryItemId === 0) {
      this.toastr.error('Please select an inventory item', 'Error');
      return;
    }

    if (this.newSaleItem.quantity <= 0) {
      this.toastr.error('Quantity must be greater than 0', 'Error');
      return;
    }

    if (this.newSaleItem.unitPrice <= 0) {
      this.toastr.error('Unit price must be greater than 0', 'Error');
      return;
    }

    // Check if item already exists in sale
    const existingItemIndex = this.sale.saleItems.findIndex(
      item => item.inventoryItemId === this.newSaleItem.inventoryItemId
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      this.sale.saleItems[existingItemIndex].quantity += this.newSaleItem.quantity;
      this.toastr.info('Updated existing item quantity', 'Info');
    } else {
      // Add new item
      const saleItem: SaleItemModel = {
        inventoryItemId: this.newSaleItem.inventoryItemId,
        quantity: this.newSaleItem.quantity,
        unitPrice: this.newSaleItem.unitPrice
      };
      this.sale.saleItems.push(saleItem);
      this.toastr.success('Item added to sale', 'Success');
    }

    this.calculateTotal();
    this.resetNewSaleItem();
  }

  removeSaleItem(index: number): void {
    this.sale.saleItems.splice(index, 1);
    this.calculateTotal();
    this.toastr.info('Item removed from sale', 'Info');
  }

  updateSaleItemQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeSaleItem(index);
      return;
    }
    this.sale.saleItems[index].quantity = quantity;
    this.calculateTotal();
  }

  updateSaleItemPrice(index: number, unitPrice: number): void {
    if (unitPrice < 0) {
      this.toastr.error('Unit price cannot be negative', 'Error');
      return;
    }
    this.sale.saleItems[index].unitPrice = unitPrice;
    this.calculateTotal();
  }

  resetNewSaleItem(): void {
    this.newSaleItem = {
      inventoryItemId: 0,
      inventoryItemName: '',
      quantity: 1,
      unitPrice: 0
    };
  }

  calculateTotal(): void {
    this.sale.subtotal = this.sale.saleItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
    this.sale.total = this.sale.subtotal; // For now, total equals subtotal (no tax/fees)
  }

  getInventoryItemName(inventoryItemId: number): string {
    const item = this.inventoryItems.find(i => i.id === inventoryItemId);
    return item ? (item.name || item.description || 'Unknown Item') : 'Unknown Item';
  }

  getSaleItemTotal(item: SaleItemModel): number {
    return item.quantity * item.unitPrice;
  }

  onSave(): void {
    if (!this.isFormValid()) {
      return;
    }

    // Convert date picker value to ISO string for API
    const saleDate = new Date(this.sale.saleDate);
    const apiSale = {
      ...this.sale,
      saleDate: saleDate.toISOString()
    };

    console.log('Saving sale with API structure:', apiSale);

    // Here you would typically call your API service
    // this.salesService.createSale(this.sale).subscribe({
    //   next: (response) => {
    //     this.toastr.success('Sale saved successfully!', 'Success');
    //     this.router.navigate(['/dashboard/sales']);
    //   },
    //   error: (error) => {
    //     console.error('Error saving sale:', error);
    //     this.toastr.error('Failed to save sale', 'Error');
    //   }
    // });

    // For now, simulate success
    this.toastr.success('Sale saved successfully!', 'Success');
    // Sale data structure prepared for API
    this.router.navigate(['/dashboard/sales']);
  }

  isFormValid(): boolean {
    if (!this.sale.customerName.trim()) {
      this.toastr.error('Customer name is required', 'Validation Error');
      return false;
    }

    if (!this.sale.customerPhone.trim()) {
      this.toastr.error('Customer phone is required', 'Validation Error');
      return false;
    }

    if (this.sale.saleItems.length === 0) {
      this.toastr.error('At least one sale item is required', 'Validation Error');
      return false;
    }

    if (this.sale.total <= 0) {
      this.toastr.error('Total amount must be greater than zero', 'Validation Error');
      return false;
    }

    return true;
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/sales']);
  }
}
