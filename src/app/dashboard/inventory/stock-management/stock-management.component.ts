import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import {
  InventoryItem,
  InventoryCategory,
  InventoryStatus,
  InventoryStockUpdateModel
} from 'src/app/shared/interfaces/common.interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss']
})
export class StockManagementComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  loading = false;
  searchTerm = '';

  // Stock update modal
  selectedItem: InventoryItem | null = null;
  stockUpdateModal = false;
  newStockQuantity: number = 0;
  updateType: 'add' | 'set' = 'add';

  // Edit modal
  editModal = false;
  editForm: any = {};

  // Delete modal
  deleteModal = false;

  constructor(
    private inventoryService: InventoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInventoryItems();
  }

  loadInventoryItems(): void {
    this.loading = true;
    this.inventoryService.getAllItems().subscribe({
      next: (items: InventoryItem[]) => {
        this.inventoryItems = items;
        this.filteredItems = items;
        this.loading = false;
        this.toastr.success(`Loaded ${items.length} inventory items`, 'Success');
      },
      error: (error: any) => {
        console.error('Error loading inventory items:', error);
        this.loading = false;
        this.toastr.error('Failed to load inventory items', 'Error');
      }
    });
  }

  filterItems(): void {
    if (!this.searchTerm.trim()) {
      this.filteredItems = this.inventoryItems;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredItems = this.inventoryItems.filter(item =>
      (item.description || '').toLowerCase().includes(searchLower) ||
      (item.name || '').toLowerCase().includes(searchLower) ||
      (item.sku || '').toLowerCase().includes(searchLower)
    );
  }

  openStockUpdateModal(item: InventoryItem): void {
    this.selectedItem = item;
    this.newStockQuantity = 0;
    this.updateType = 'add';
    this.stockUpdateModal = true;
  }

  closeStockUpdateModal(): void {
    this.selectedItem = null;
    this.newStockQuantity = 0;
    this.stockUpdateModal = false;
  }

  updateStock(): void {
    if (!this.selectedItem || this.newStockQuantity < 0) {
      this.toastr.error('Please enter a valid stock quantity', 'Invalid Input');
      return;
    }

    const finalStockAmount = this.updateType === 'add'
      ? (this.selectedItem.stockAvailable || 0) + this.newStockQuantity
      : this.newStockQuantity;

    const stockUpdate: InventoryStockUpdateModel = {
      id: this.selectedItem.id,
      stockAvailable: finalStockAmount
    };

    this.loading = true;

    this.inventoryService.updateStock(stockUpdate).subscribe({
      next: (updatedItem: InventoryItem) => {
        // Update the item in our arrays
        const index = this.inventoryItems.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          this.inventoryItems[index] = updatedItem;
        }

        const filteredIndex = this.filteredItems.findIndex(item => item.id === updatedItem.id);
        if (filteredIndex !== -1) {
          this.filteredItems[filteredIndex] = updatedItem;
        }

        this.loading = false;
        this.closeStockUpdateModal();

        const action = this.updateType === 'add' ? 'Added' : 'Set';
        this.toastr.success(
          `${action} stock for ${updatedItem.description || updatedItem.name}. New total: ${finalStockAmount}`,
          'Stock Updated'
        );
      },
      error: (error: any) => {
        console.error('Error updating stock:', error);
        this.loading = false;
        this.toastr.error('Failed to update stock', 'Error');
      }
    });
  }

  openEditModal(item: InventoryItem): void {
    this.selectedItem = item;
    this.editForm = {
      id: item.id,
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      category: Number(item.category),
      unitPrice: item.unitPrice || 0,
      unitOfMeasure: item.unitOfMeasure || 'units',
      reorderLevel: item.reorderLevel || 0,
      supplier: item.supplier || '',
      status: Number(item.status),
      stockAvailable: item.stockAvailable || 0
    };
    console.log('Opening edit modal with item:', item);
    console.log('Edit form initialized:', this.editForm);
    this.editModal = true;
  }

  closeEditModal(): void {
    this.selectedItem = null;
    this.editForm = {};
    this.editModal = false;
  }

  updateItem(): void {
    if (!this.selectedItem || !this.editForm.name || !this.editForm.sku) {
      this.toastr.error('Please fill in all required fields', 'Invalid Input');
      return;
    }

    this.loading = true;

    // Prepare the data according to InventoryItemModel interface
    const updateData = {
      id: this.editForm.id,
      name: this.editForm.name,
      description: this.editForm.description || '',
      category: Number(this.editForm.category),
      sku: this.editForm.sku,
      unitOfMeasure: this.editForm.unitOfMeasure || 'units',
      unitPrice: Number(this.editForm.unitPrice) || 0,
      stockAvailable: Number(this.editForm.stockAvailable) || 0,
      reorderLevel: Number(this.editForm.reorderLevel) || 0,
      minimumStockLevel: Number(this.editForm.reorderLevel) || 0, // Use reorderLevel as minimumStockLevel
      supplier: this.editForm.supplier || '',
      supplierContact: '',
      status: Number(this.editForm.status),
      notes: ''
    };

    console.log('Edit form data:', this.editForm);
    console.log('Update data being sent:', updateData);

    this.inventoryService.updateItem(updateData).subscribe({
      next: (updatedItem: InventoryItem) => {
        // Update the item in our arrays
        const index = this.inventoryItems.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          this.inventoryItems[index] = updatedItem;
        }

        const filteredIndex = this.filteredItems.findIndex(item => item.id === updatedItem.id);
        if (filteredIndex !== -1) {
          this.filteredItems[filteredIndex] = updatedItem;
        }

        this.loading = false;
        this.closeEditModal();
        this.toastr.success(
          `Updated ${updatedItem.name || updatedItem.description}`,
          'Item Updated'
        );
      },
      error: (error: any) => {
        console.error('Error updating item:', error);
        this.loading = false;
        this.toastr.error('Failed to update item', 'Error');
      }
    });
  }

  openDeleteModal(item: InventoryItem): void {
    this.selectedItem = item;
    this.deleteModal = true;
  }

  closeDeleteModal(): void {
    this.selectedItem = null;
    this.deleteModal = false;
  }

  deleteItem(): void {
    if (!this.selectedItem) {
      return;
    }

    this.loading = true;
    const itemId = this.selectedItem.id;
    const itemName = this.selectedItem.name || this.selectedItem.description;

    this.inventoryService.deleteItem(itemId).subscribe({
      next: () => {
        // Remove the item from our arrays
        this.inventoryItems = this.inventoryItems.filter(item => item.id !== itemId);
        this.filteredItems = this.filteredItems.filter(item => item.id !== itemId);

        this.loading = false;
        this.closeDeleteModal();
        this.toastr.success(
          `Deleted ${itemName}`,
          'Item Deleted'
        );
      },
      error: (error: any) => {
        console.error('Error deleting item:', error);
        this.loading = false;
        this.toastr.error('Failed to delete item', 'Error');
      }
    });
  }  getCategoryName(category: InventoryCategory): string {
    const categoryMap = {
      [InventoryCategory.MedicalSupplies]: 'Medical Supplies',
      [InventoryCategory.Consumables]: 'Consumables',
      [InventoryCategory.Equipment]: 'Equipment',
      [InventoryCategory.Pharmaceuticals]: 'Pharmaceuticals',
      [InventoryCategory.Other]: 'Other'
    };
    return categoryMap[category] || 'Unknown';
  }

  getStatusName(status: InventoryStatus): string {
    const statusMap = {
      [InventoryStatus.Active]: 'Active',
      [InventoryStatus.Inactive]: 'Inactive',
      [InventoryStatus.Discontinued]: 'Discontinued'
    };
    return statusMap[status] || 'Unknown';
  }

  getStockStatusClass(item: InventoryItem): string {
    const qty = item.stockAvailable || 0;
    const reorderLevel = item.reorderLevel || 10;

    if (qty === 0) return 'out-of-stock';
    if (qty <= reorderLevel) return 'low-stock';
    return 'in-stock';
  }

  getStockStatusText(item: InventoryItem): string {
    const qty = item.stockAvailable || 0;
    const reorderLevel = item.reorderLevel || 10;

    if (qty === 0) return 'Out of Stock';
    if (qty <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  }
}
