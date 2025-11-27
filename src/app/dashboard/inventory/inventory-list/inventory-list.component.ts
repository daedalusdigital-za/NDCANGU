import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InventoryService } from 'src/app/services/inventory/inventory.service';
import {
  InventoryItem,
  InventoryCategory,
  InventoryStatus
} from 'src/app/shared/interfaces/common.interfaces';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  loading = false;

  // Filter properties
  searchTerm = '';
  selectedCategory: InventoryCategory | null = null;
  selectedStatus: InventoryStatus | null = null;
  showLowStockOnly = false;

  // Dropdown options
  categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Medical Supplies', value: InventoryCategory.MedicalSupplies },
    { label: 'Consumables', value: InventoryCategory.Consumables },
    { label: 'Equipment', value: InventoryCategory.Equipment },
    { label: 'Pharmaceuticals', value: InventoryCategory.Pharmaceuticals },
    { label: 'Other', value: InventoryCategory.Other }
  ];

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: InventoryStatus.Active },
    { label: 'Inactive', value: InventoryStatus.Inactive },
    { label: 'Discontinued', value: InventoryStatus.Discontinued }
  ];

  // Table columns for dynamic grid
  columns = [
    {
      header: 'SKU',
      field: 'sku',
      sortable: true,
      getValue: (item: InventoryItem) => item.sku
    },
    {
      header: 'Name',
      field: 'name',
      sortable: true,
      getValue: (item: InventoryItem) => item.name
    },
    {
      header: 'Category',
      field: 'categoryText',
      sortable: true,
      getValue: (item: InventoryItem) => item.categoryText
    },
    {
      header: 'Stock',
      field: 'stockAvailable',
      sortable: true,
      getValue: (item: InventoryItem) => item.stockAvailable,
      template: 'stock'
    },
    {
      header: 'Unit Price',
      field: 'unitPrice',
      sortable: true,
      getValue: (item: InventoryItem) => `R ${item.unitPrice.toFixed(2)}`
    },
    {
      header: 'Status',
      field: 'statusText',
      sortable: true,
      getValue: (item: InventoryItem) => item.statusText,
      template: 'status'
    },
    {
      header: 'Supplier',
      field: 'supplier',
      sortable: true,
      getValue: (item: InventoryItem) => item.supplier || '-'
    },
    {
      header: 'Actions',
      field: 'actions',
      sortable: false,
      template: 'actions'
    }
  ];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadInventoryItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all inventory items
   */
  loadInventoryItems(): void {
    this.loading = true;

    this.inventoryService.getAllItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.inventoryItems = items;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading inventory items:', error);
          this.toastr.error('Failed to load inventory items', 'Error');
          this.loading = false;
        }
      });
  }

  /**
   * Apply search and filter criteria
   */
  applyFilters(): void {
    this.filteredItems = this.inventoryItems.filter(item => {
      // Search term filter
      const matchesSearch = !this.searchTerm ||
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = this.selectedCategory === null || item.category === this.selectedCategory;

      // Status filter
      const matchesStatus = this.selectedStatus === null || item.status === this.selectedStatus;

      // Low stock filter
      const matchesLowStock = !this.showLowStockOnly || item.stockAvailable <= item.reorderLevel;

      return matchesSearch && matchesCategory && matchesStatus && matchesLowStock;
    });
  }

  /**
   * Handle search input change
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Handle category filter change
   */
  onCategoryChange(): void {
    this.applyFilters();
  }

  /**
   * Handle status filter change
   */
  onStatusChange(): void {
    this.applyFilters();
  }

  /**
   * Handle low stock toggle
   */
  onLowStockToggle(): void {
    this.applyFilters();
  }

  /**
   * Navigate to add new item
   */
  addNewItem(): void {
    this.router.navigate(['/dashboard/inventory/add']);
  }

  /**
   * Navigate to edit item
   */
  editItem(item: InventoryItem): void {
    this.router.navigate(['/dashboard/inventory/edit', item.id]);
  }

  /**
   * Confirm and delete item
   */
  deleteItem(item: InventoryItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.performDelete(item.id);
      }
    });
  }

  /**
   * Perform the deletion
   */
  private performDelete(itemId: number): void {
    this.inventoryService.deleteItem(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success('Item deleted successfully', 'Success');
          this.loadInventoryItems(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          this.toastr.error('Failed to delete item', 'Error');
        }
      });
  }

  /**
   * Check if stock is low
   */
  isLowStock(item: InventoryItem): boolean {
    return item.stockAvailable <= item.reorderLevel;
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: InventoryStatus): string {
    switch (status) {
      case InventoryStatus.Active:
        return 'status-active';
      case InventoryStatus.Inactive:
        return 'status-inactive';
      case InventoryStatus.Discontinued:
        return 'status-discontinued';
      default:
        return 'status-unknown';
    }
  }

  /**
   * Quick stock update
   */
  quickStockUpdate(item: InventoryItem): void {
    // This could open a quick edit modal or navigate to a stock update page
    // For now, we'll navigate to the edit page
    this.editItem(item);
  }

  /**
   * Refresh the inventory list
   */
  refresh(): void {
    this.loadInventoryItems();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.selectedStatus = null;
    this.showLowStockOnly = false;
    this.applyFilters();
  }

  /**
   * Track by function for ngFor performance optimization
   */
  trackByItemId(index: number, item: InventoryItem): number {
    return item.id;
  }
}
