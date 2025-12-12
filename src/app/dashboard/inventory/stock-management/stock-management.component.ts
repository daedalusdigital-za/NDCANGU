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
      category: String(item.category), // Store as string for dropdown binding
      unitPrice: item.unitPrice || 0,
      unitOfMeasure: item.unitOfMeasure || 'units',
      reorderLevel: item.reorderLevel || 0,
      supplier: item.supplier || '',
      status: String(item.status), // Store as string for dropdown binding
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

    // Parse string values from form dropdowns back to numbers
    const categoryValue = typeof this.editForm.category === 'string' ? parseInt(this.editForm.category) : Number(this.editForm.category);
    const statusValue = typeof this.editForm.status === 'string' ? parseInt(this.editForm.status) : Number(this.editForm.status);
    const isActive = statusValue === 0; // Only status 0 (Active) maps to true

    // Prepare the data according to InventoryItemModel interface
    const updateData = {
      id: this.editForm.id,
      name: this.editForm.name,
      description: this.editForm.description || '',
      category: categoryValue,
      sku: this.editForm.sku,
      unitOfMeasure: this.editForm.unitOfMeasure || 'units',
      unitPrice: Number(this.editForm.unitPrice) || 0,
      stockAvailable: Number(this.editForm.stockAvailable) || 0,
      reorderLevel: Number(this.editForm.reorderLevel) || 0,
      minimumStockLevel: Number(this.editForm.reorderLevel) || 0,
      supplier: this.editForm.supplier || '',
      supplierContact: '',
      status: statusValue,
      isActive: isActive,
      notes: ''
    };

    console.log('=== INVENTORY UPDATE DEBUG ===');
    console.log('Original item - ID:', this.selectedItem.id, 'Status:', this.selectedItem.status, 'isActive:', this.selectedItem.status === 0);
    console.log('Form status dropdown value:', this.editForm.status, '(type:', typeof this.editForm.status, ')');
    console.log('Parsed status:', statusValue, 'Parsed isActive:', isActive);
    console.log('Full payload being sent:', JSON.stringify(updateData, null, 2));

    this.inventoryService.updateItem(updateData).subscribe({
      next: (updatedItem: InventoryItem) => {
        console.log('=== API RESPONSE ===');
        console.log('Returned item ID:', updatedItem.id);
        console.log('Returned status:', updatedItem.status, '(type:', typeof updatedItem.status, ')');
        console.log('Full returned item:', JSON.stringify(updatedItem, null, 2));

        // WORKAROUND: Backend returns empty item data, so we use form data as primary source
        // Only take the status confirmation from the API response
        const mergedItem: InventoryItem = {
          ...this.editForm, // Use our form data as the base (preserves SKU, description, category, supplier, etc.)
          id: this.editForm.id, // Keep original ID
          status: updatedItem.status !== undefined ? updatedItem.status : statusValue, // Use API-confirmed status
          // Don't spread updatedItem to avoid null/empty values overwriting form data
        };

        console.log('Merged item (what we\'ll use to update UI):', JSON.stringify(mergedItem, null, 2));

        // Update the item in our arrays using merged data
        const index = this.inventoryItems.findIndex(item => item.id === mergedItem.id);
        if (index !== -1) {
          this.inventoryItems[index] = mergedItem;
        }

        const filteredIndex = this.filteredItems.findIndex(item => item.id === mergedItem.id);
        if (filteredIndex !== -1) {
          this.filteredItems[filteredIndex] = mergedItem;
        }

        this.loading = false;
        this.closeEditModal();
        this.toastr.success(
          `Updated ${mergedItem.name || mergedItem.description}`,
          'Item Updated'
        );

        // Log status change if it was modified
        if (this.selectedItem && this.selectedItem.status !== mergedItem.status) {
          console.log(`✓ Status changed: ${this.getStatusName(this.selectedItem.status)} → ${this.getStatusName(mergedItem.status)}`);
        } else {
          console.warn(`✗ Status NOT changed: Still showing status ${updatedItem.status}`);
        }
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
