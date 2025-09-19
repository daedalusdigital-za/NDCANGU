import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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

interface InventoryItem {
  id: number;
  itemNumber: string;
  description: string;
  location: string;
  uom: string;
  qtyOnHand: number;
  qtyOnPO: number;
  qtyOnSO: number;
  stockAvailable: number;
  totalCostForQOH: number;
  unitCostForQOH: number;
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

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadProducts(): void {
    // Generate products from NDOH inventory items
    this.products = this.inventoryItems.map(item => ({
      id: item.id,
      name: `${item.itemNumber} - ${item.description}`,
      category: this.getCategoryFromDescription(item.description),
      price: item.unitCostForQOH,
      stock: item.stockAvailable, // Use Stock Available instead of Qty on Hand
      supplier: 'NDOH Supplier',
      description: item.description,
      status: this.getStatusFromStock(item.qtyOnHand), // Status based on Qty on Hand
      lastRestocked: new Date('2024-01-15')
    }));
    
    this.filteredProducts = [...this.products];
  }

  private getCategoryFromDescription(description: string): string {
    if (description.includes('HEMOGLOBIN')) return 'Hemoglobin Testing';
    if (description.includes('GLUCOSE')) return 'Glucose Testing';
    if (description.includes('HBA1C')) return 'HBA1C Testing';
    if (description.includes('MULTIPARAMETER')) return 'Multiparameter Testing';
    if (description.includes('QUALITY CONTROL')) return 'Quality Control';
    if (description.includes('BATTERY')) return 'Equipment Accessories';
    if (description.includes('LANCET')) return 'Disposables';
    return 'Medical Equipment';
  }

  private getStatusFromStock(stockAvailable: number): string {
    if (stockAvailable <= 0) return 'Out of Stock';
    if (stockAvailable < 100) return 'Low Stock';
    return 'In Stock';
  }

  loadInventoryData(): void {
    // Medical Equipment Inventory Data based on NDOH items
    this.inventoryItems = [
      {
        id: 1,
        itemNumber: 'NDOH35002',
        description: 'HEMOGLOBIN METER - BIO AID HB METER',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 8406.00,
        qtyOnPO: 400.00,
        qtyOnSO: 0.00,
        stockAvailable: 8806.00,
        totalCostForQOH: 3079790.28,
        unitCostForQOH: 366.38
      },
      {
        id: 2,
        itemNumber: 'NDOH35003',
        description: 'HEMOGLOBIN TEST STRIPS',
        location: 'KZN 1',
        uom: 'BOX',
        qtyOnHand: 24442.00,
        qtyOnPO: 1200.00,
        qtyOnSO: 0.00,
        stockAvailable: 25642.00,
        totalCostForQOH: 3153751.26,
        unitCostForQOH: 129.03
      },
      {
        id: 3,
        itemNumber: 'NDOH35013',
        description: 'HEMOGLOBIN METER - BATTERY',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 0.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 0.00,
        totalCostForQOH: 0.00,
        unitCostForQOH: 0.00
      },
      {
        id: 4,
        itemNumber: 'NDOH35014',
        description: 'HEMOGLOBIN METER - QUALITY CONTROL SOLUTIONS',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 0.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 0.00,
        totalCostForQOH: 0.00,
        unitCostForQOH: 0.00
      },
      {
        id: 5,
        itemNumber: 'NDOH35015',
        description: 'HEMOGLOBIN METER - SINGLE USE DISPOSABLE LANCET',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 500.00,
        qtyOnPO: 0.00,
        qtyOnSO: 1300.00,
        stockAvailable: -800.00,
        totalCostForQOH: 0.00,
        unitCostForQOH: 0.00
      },
      {
        id: 6,
        itemNumber: 'NDOH35016',
        description: 'GLUCOSE METER - BATTERY',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 0.00,
        qtyOnPO: 0.00,
        qtyOnSO: 2930.00,
        stockAvailable: -2930.00,
        totalCostForQOH: 0.00,
        unitCostForQOH: 0.00
      },
      {
        id: 7,
        itemNumber: 'NDOH35017',
        description: 'GLUCOSE TEST STRIPS',
        location: 'KZN 1',
        uom: '50Pack',
        qtyOnHand: 2321.00,
        qtyOnPO: 0.00,
        qtyOnSO: 136109.00,
        stockAvailable: -133788.00,
        totalCostForQOH: 197010.25,
        unitCostForQOH: 84.88
      },
      {
        id: 8,
        itemNumber: 'NDOH35004',
        description: 'GLUCOSE METER- BIO HERMES',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 7092.00,
        qtyOnPO: 0.00,
        qtyOnSO: 24880.00,
        stockAvailable: -17788.00,
        totalCostForQOH: 1059259.17,
        unitCostForQOH: 149.36
      },
      {
        id: 9,
        itemNumber: 'NDOH35018',
        description: 'GLOCOSE METER - QUALITY CONTROL SOLUTIONS',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 569.00,
        qtyOnPO: 0.00,
        qtyOnSO: 1480.00,
        stockAvailable: -911.00,
        totalCostForQOH: 0.00,
        unitCostForQOH: 0.00
      },
      {
        id: 10,
        itemNumber: 'NDOH35006',
        description: 'DUAL GLUCOSE & HBA1C METER- BIOHERMES',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 1483.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 1483.00,
        totalCostForQOH: 2863152.98,
        unitCostForQOH: 1930.65
      },
      {
        id: 11,
        itemNumber: 'NDOH35034',
        description: 'HBA1C TEST STRIPS',
        location: 'KZN 1',
        uom: '50Pack',
        qtyOnHand: 1974.00,
        qtyOnPO: 0.00,
        qtyOnSO: 5.00,
        stockAvailable: 1969.00,
        totalCostForQOH: 1307458.10,
        unitCostForQOH: 662.34
      },
      {
        id: 12,
        itemNumber: 'NDOH35005',
        description: 'MULTIPARAMETER - TAIDOC',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 6971.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 6971.00,
        totalCostForQOH: 3407494.51,
        unitCostForQOH: 488.81
      },
      {
        id: 13,
        itemNumber: 'NDOH35019',
        description: 'MULTIPARAMETER - 50 KETONE TEST STRIPS VIAL',
        location: 'KZN 1',
        uom: '50Pack',
        qtyOnHand: 2470.00,
        qtyOnPO: 0.00,
        qtyOnSO: 6000.00,
        stockAvailable: -3530.00,
        totalCostForQOH: 521053.29,
        unitCostForQOH: 210.95
      },
      {
        id: 14,
        itemNumber: 'NDOH35020',
        description: 'MULTIPARAMETER - 50 URIC ACID VIAL',
        location: 'KZN 1',
        uom: '50Pack',
        qtyOnHand: 969.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 969.00,
        totalCostForQOH: 247133.76,
        unitCostForQOH: 255.04
      },
      {
        id: 15,
        itemNumber: 'NDOH35021',
        description: 'MULTIPARAMETER - 50 CHOLESTEROL VIAL',
        location: 'KZN 1',
        uom: '50Pack',
        qtyOnHand: 2082.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 2082.00,
        totalCostForQOH: 1327399.92,
        unitCostForQOH: 637.56
      },
      {
        id: 16,
        itemNumber: 'NDOH35022',
        description: 'MULTIPARAMETER - 50 LACTATE VIAL',
        location: 'KZN 1',
        uom: '50Pack',
        qtyOnHand: 970.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 970.00,
        totalCostForQOH: 787116.20,
        unitCostForQOH: 811.46
      },
      {
        id: 17,
        itemNumber: 'NDOH35036',
        description: 'DUAL GLUCOSE & HBA1C - QUALITY CONTROL SOLUTION HBA1C',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 0.00,
        qtyOnPO: 0.00,
        qtyOnSO: 19.00,
        stockAvailable: -19.00,
        totalCostForQOH: 0.00,
        unitCostForQOH: 0.00
      },
      {
        id: 18,
        itemNumber: 'NDOH35037',
        description: 'DUAL GLUCOSE & HBA1C - QUALITY CONTROL SOLUTIONS GLUCOSE',
        location: 'KZN 1',
        uom: 'Each',
        qtyOnHand: 17000.00,
        qtyOnPO: 0.00,
        qtyOnSO: 0.00,
        stockAvailable: 17000.00,
        totalCostForQOH: 379440.00,
        unitCostForQOH: 22.32
      }
    ];
    
    this.filteredInventoryItems = [...this.inventoryItems];
    this.loadProducts(); // Generate products from inventory data
  }

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
      // Update existing product
      const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
      if (index !== -1) {
        this.products[index] = { ...this.newProduct };
        this.toastr.success('Product updated successfully', 'Success');
      }
    } else {
      // Add new product
      this.newProduct.id = Math.max(...this.products.map(p => p.id)) + 1;
      this.products.push({ ...this.newProduct });
      this.toastr.success('Product added successfully', 'Success');
    }
    
    this.applyFilters();
    this.cancelForm();
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

  // Inventory management methods
  switchView(view: 'products' | 'inventory'): void {
    this.currentView = view;
  }

  applyInventoryFilters(): void {
    this.filteredInventoryItems = this.inventoryItems.filter(item => {
      const matchesSearch = item.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           item.itemNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           item.uom.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }

  getInventoryStatusClass(item: InventoryItem): string {
    if (item.qtyOnHand <= 0) return 'badge-danger';
    if (item.qtyOnHand < 100) return 'badge-warning';
    return 'badge-success';
  }

  getInventoryStatusText(item: InventoryItem): string {
    if (item.qtyOnHand <= 0) return 'Out of Stock';
    if (item.qtyOnHand < 100) return 'Low Stock';
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
    return this.inventoryItems.filter(item => item.qtyOnHand > 0).length;
  }

  getOutOfStockCount(): number {
    return this.inventoryItems.filter(item => item.qtyOnHand <= 0).length;
  }

  getTotalInventoryValue(): number {
    return this.inventoryItems.reduce((sum, item) => sum + item.totalCostForQOH, 0);
  }
}
