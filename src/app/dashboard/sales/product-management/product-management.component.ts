import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  description: string;
  status: string;
  lastRestocked: Date;
}

// Local interface for display compatibility - combines API and UI needs
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
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  inventoryItems: InventoryItem[] = [];
  filteredInventoryItems: InventoryItem[] = [];
  showAddForm: boolean = false;
  editingProduct: Product | null = null;
  currentView: 'products' | 'inventory' = 'inventory';

  // Inventory editing properties
  showInventoryEditForm: boolean = false;
  editingInventoryItem: InventoryItem | null = null;
  newInventoryItem: InventoryItem = this.getEmptyInventoryItem();

  searchTerm: string = '';
  selectedCategory: string = 'All';
  selectedStatus: string = 'All';

  categories = [
    'All', 'Hemoglobin Testing', 'Glucose Testing', 'HBA1C Testing',
    'Multiparameter Testing', 'Quality Control', 'Equipment Accessories',
    'Disposables', 'Medical Equipment'
  ];

  statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  southAfricanSuppliers = [
    'Adcock Ingram Healthcare',
    'Aspen Pharmacare',
    'Pharma Dynamics',
    'BE-Tabs Pharmaceuticals',
    'Dis-Chem Pharmacies',
    'Clicks Group',
    'Medi-Rite Pharmacy',
    'Alpha Pharm',
    'Fresenius Kabi',
    'Bodene Healthcare'
  ];

  newProduct: Product = {
    id: 0,
    name: '',
    category: '',
    price: 0,
    stock: 0,
    supplier: '',
    description: '',
    status: 'In Stock',
    lastRestocked: new Date()
  };

  constructor(
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadProducts(): void {
    // Generate products from real API inventory items
    this.products = this.inventoryItems.map(item => ({
      id: item.id,
      name: `${item.name} - ${item.description || 'No description'}`,
      category: this.getCategoryFromDescription(item.description || ''),
      price: item.unitPrice,
      stock: item.stockAvailable,
      supplier: item.supplier || 'Unknown Supplier',
      description: item.description || 'No description',
      status: this.getStatusFromStock(item.stockAvailable),
      lastRestocked: new Date('2024-01-15')
    }));

    this.filteredProducts = [...this.products];
    console.log(`📦 Generated ${this.products.length} products from inventory data`);
  }  private getCategoryFromDescription(description: string): string {
    if (!description) return 'Medical Equipment';

    const upperDesc = description.toUpperCase();
    if (upperDesc.includes('HEMOGLOBIN') || upperDesc.includes('HB ')) return 'Hemoglobin Testing';
    if (upperDesc.includes('GLUCOSE') || upperDesc.includes('GLUCOMETER')) return 'Glucose Testing';
    if (upperDesc.includes('HBA1C') || upperDesc.includes('A1C')) return 'HBA1C Testing';
    if (upperDesc.includes('MULTIPARAMETER') || upperDesc.includes('MULTI-PARAMETER')) return 'Multiparameter Testing';
    if (upperDesc.includes('QUALITY CONTROL') || upperDesc.includes('QC')) return 'Quality Control';
    if (upperDesc.includes('BATTERY') || upperDesc.includes('POWER')) return 'Equipment Accessories';
    if (upperDesc.includes('LANCET') || upperDesc.includes('STRIP') || upperDesc.includes('DISPOSABLE')) return 'Disposables';
    return 'Medical Equipment';
  }

  private getStatusFromStock(stockAvailable: number): string {
    if (stockAvailable <= 0) return 'Out of Stock';
    if (stockAvailable < 100) return 'Low Stock';
    return 'In Stock';
  }

  loadInventoryData(): void {
    console.log('🔄 Loading inventory data from API...');

    // Use real API call to get all inventory items
    this.databaseService.getInventoryItems().subscribe({
      next: (items: any[]) => {
        console.log(`✅ Loaded ${items.length} inventory items from API:`, items);
        // Use API data directly since interface now matches
        this.inventoryItems = items;
        this.filteredInventoryItems = [...this.inventoryItems];
        this.loadProducts(); // Generate products from real inventory data

        if (items.length > 0) {
          this.toastr.success(`Loaded ${items.length} inventory items from API`, 'Inventory Loaded');
        } else {
          this.toastr.info('No inventory items found in API', 'Info');
        }
      },
      error: (error) => {
        console.error('❌ Error loading inventory from API:', error);
        this.toastr.error('Failed to load inventory data from API', 'API Error');

        // Clear arrays on error
        this.inventoryItems = [];
        this.filteredInventoryItems = [];
        this.products = [];
        this.filteredProducts = [];
      }
    });
  }

  /**
   * Convert real API inventory items to display format for backwards compatibility
   */
  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.supplier.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesStatus = this.selectedStatus === 'All' || product.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.selectedStatus = 'All';
    this.filteredProducts = [...this.products];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock': return 'badge-success';
      case 'Low Stock': return 'badge-warning';
      case 'Out of Stock': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  showAddProductForm(): void {
    this.showAddForm = true;
    this.editingProduct = null;
    this.resetNewProduct();
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.newProduct = { ...product };
    this.showAddForm = true;
  }

  saveProduct(): void {
    if (this.editingProduct) {
      // Update existing product by finding and updating corresponding inventory item
      const inventoryItem = this.inventoryItems.find(item => item.id === this.editingProduct!.id);

      if (inventoryItem) {
        // Convert product changes back to inventory item format
        const updatedInventoryItem: InventoryItem = {
          ...inventoryItem,
          name: this.newProduct.name,
          description: this.newProduct.description,
          category: this.getCategoryEnumFromName(this.newProduct.category),
          categoryText: this.newProduct.category,
          unitPrice: this.newProduct.price,
          stockAvailable: this.newProduct.stock,
          reorderLevel: Math.floor(this.newProduct.stock * 0.2),
          supplier: this.newProduct.supplier,
          status: this.getStatusEnumFromName(this.newProduct.status),
          statusText: this.newProduct.status,
          lastUpdated: new Date().toISOString()
        };

        // Update via API
        this.databaseService.updateInventoryItem(updatedInventoryItem).subscribe({
          next: (updatedItem) => {
            console.log('✅ Product updated in API:', updatedItem);
            this.toastr.success('Product updated successfully in database', 'Success');

            // Reload data to reflect changes
            this.loadInventoryData();
            this.cancelForm();
          },
          error: (error) => {
            console.error('❌ Error updating product in API:', error);
            this.toastr.error('Failed to update product in database', 'API Error');

            // Fallback: update locally only
            const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
            if (index !== -1) {
              this.products[index] = { ...this.newProduct };
              this.toastr.warning('Product updated locally only (API unavailable)', 'Local Update');
              this.applyFilters();
            }
            this.cancelForm();
          }
        });
      } else {
        this.toastr.error('Cannot find corresponding inventory item for this product', 'Update Error');
        this.cancelForm();
      }
    } else {
      // Add new product to API as inventory item
      const newInventoryItem = this.convertProductToInventoryItem(this.newProduct);

      this.databaseService.createInventoryItem(newInventoryItem).subscribe({
        next: (createdItem) => {
          console.log('✅ Product saved to API:', createdItem);
          this.toastr.success('Product added successfully to database', 'Success');
          // Reload data to show the new item
          this.loadInventoryData();
          this.cancelForm();
        },
        error: (error) => {
          console.error('❌ Error saving product to API:', error);
          this.toastr.error('Failed to save product to database', 'API Error');

          // Fallback: add to local array only
          this.newProduct.id = Math.max(0, ...this.products.map(p => p.id)) + 1;
          this.products.push({ ...this.newProduct });
          this.applyFilters();
          this.cancelForm();
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.applyFilters();
      this.toastr.success('Product deleted successfully', 'Success');
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.resetNewProduct();
  }

  private resetNewProduct(): void {
    this.newProduct = {
      id: 0,
      name: '',
      category: '',
      price: 0,
      stock: 0,
      supplier: '',
      description: '',
      status: 'In Stock',
      lastRestocked: new Date()
    };
  }

  /**
   * Convert Product to InventoryItem for API submission
   */
  private convertProductToInventoryItem(product: Product): Partial<InventoryItem> {
    return {
      name: product.name,
      description: product.description,
      category: this.getCategoryEnumFromName(product.category),
      categoryText: product.category,
      sku: this.generateSKU(product.name),
      unitOfMeasure: 'Unit', // Default UOM
      unitPrice: product.price,
      stockAvailable: product.stock,
      reorderLevel: Math.floor(product.stock * 0.2), // 20% of stock as reorder level
      supplier: product.supplier,
      status: this.getStatusEnumFromName(product.status),
      statusText: product.status,
      createdByUserName: 'Admin' // Default user
    };
  }

  /**
   * Generate SKU from product name
   */
  private generateSKU(productName: string): string {
    const prefix = productName.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  /**
   * Convert category name to enum value
   */
  private getCategoryEnumFromName(categoryName: string): number {
    const categoryMap: { [key: string]: number } = {
      'Hemoglobin Testing': 1,
      'Glucose Testing': 2,
      'HBA1C Testing': 3,
      'Multiparameter Testing': 4,
      'Quality Control': 5,
      'Equipment Accessories': 6,
      'Disposables': 7,
      'Medical Equipment': 8
    };
    return categoryMap[categoryName] || 8; // Default to Medical Equipment
  }

  /**
   * Convert status name to enum value
   */
  private getStatusEnumFromName(statusName: string): number {
    const statusMap: { [key: string]: number } = {
      'In Stock': 1,
      'Low Stock': 2,
      'Out of Stock': 3
    };
    return statusMap[statusName] || 1; // Default to In Stock
  }

  // Inventory management methods
  switchView(view: 'products' | 'inventory'): void {
    this.currentView = view;
  }

  applyInventoryFilters(): void {
    this.filteredInventoryItems = this.inventoryItems.filter(item => {
      const matchesSearch = (item.name || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (item.description || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (item.sku || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (item.categoryText || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (item.unitOfMeasure || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (item.supplier || '').toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  getInventoryStatusClass(item: InventoryItem): string {
    if (item.stockAvailable <= 0) return 'badge-danger';
    if (item.stockAvailable < 100) return 'badge-warning';
    return 'badge-success';
  }

  getInventoryStatusText(item: InventoryItem): string {
    if (item.stockAvailable <= 0) return 'Out of Stock';
    if (item.stockAvailable < 100) return 'Low Stock';
    return 'In Stock';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-ZA').format(num);
  }

  getInStockCount(): number {
    return this.inventoryItems.filter(item => item.stockAvailable > 0).length;
  }

  getOutOfStockCount(): number {
    return this.inventoryItems.filter(item => item.stockAvailable <= 0).length;
  }

  getTotalInventoryValue(): number {
    return this.inventoryItems.reduce((sum, item) => sum + this.getTotalCostForQOH(item), 0);
  }

  getTotalCostForQOH(item: InventoryItem): number {
    return item.stockAvailable * item.unitPrice;
  }

  // ===== INVENTORY EDITING METHODS =====

  private getEmptyInventoryItem(): InventoryItem {
    return {
      id: 0,
      name: '',
      description: null,
      category: 0,
      categoryText: '',
      sku: '',
      unitOfMeasure: '',
      unitPrice: 0,
      stockAvailable: 0,
      reorderLevel: 0,
      supplier: null,
      expiryDate: null,
      batchNumber: null,
      status: 0,
      statusText: '',
      createdDate: new Date().toISOString(),
      lastUpdated: null,
      createdByUserName: ''
    };
  }

  editInventoryItem(item: InventoryItem): void {
    console.log('🔧 Editing inventory item:', item);
    this.editingInventoryItem = item;
    this.newInventoryItem = { ...item };
    this.showInventoryEditForm = true;
    this.toastr.info('Opening inventory edit form', 'Edit Mode');
  }

  viewInventoryDetails(item: InventoryItem): void {
    console.log('👁️ Viewing inventory details:', item);
    this.toastr.info(`Viewing details for ${item.description}`, 'Item Details');
    // You can implement a detailed view modal here if needed
  }

  saveInventoryItem(): void {
    if (this.editingInventoryItem) {
      // Update existing inventory item via API
      this.databaseService.updateInventoryItem(this.newInventoryItem).subscribe({
        next: (updatedItem) => {
          console.log('✅ Inventory item updated in API:', updatedItem);
          this.toastr.success('Inventory item updated successfully in database', 'Success');

          // Update local array with API response
          const index = this.inventoryItems.findIndex(i => i.id === this.editingInventoryItem!.id);
          if (index !== -1) {
            this.inventoryItems[index] = updatedItem;
            this.filteredInventoryItems = [...this.inventoryItems];
            // Regenerate products from updated inventory
            this.loadProducts();
          }

          this.cancelInventoryForm();
        },
        error: (error) => {
          console.error('❌ Error updating inventory item:', error);
          this.toastr.error('Failed to update inventory item in database', 'API Error');

          // Fallback: update locally only
          const index = this.inventoryItems.findIndex(i => i.id === this.editingInventoryItem!.id);
          if (index !== -1) {
            this.inventoryItems[index] = { ...this.newInventoryItem };
            this.filteredInventoryItems = [...this.inventoryItems];
            this.loadProducts();
            this.toastr.warning('Item updated locally only (API unavailable)', 'Local Update');
          }

          this.cancelInventoryForm();
        }
      });
    }
  }

  cancelInventoryForm(): void {
    this.showInventoryEditForm = false;
    this.editingInventoryItem = null;
    this.newInventoryItem = this.getEmptyInventoryItem();
  }
}
