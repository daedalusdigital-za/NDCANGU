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

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  showAddForm: boolean = false;
  editingProduct: Product | null = null;
  
  searchTerm: string = '';
  selectedCategory: string = 'All';
  selectedStatus: string = 'All';
  
  categories = [
    'All', 'Diagnostic', 'Diabetes Care', 'Basic Care', 'Professional', 
    'Respiratory', 'Circulation', 'Wound Care', 'Monitoring', 'Surgical'
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
    this.loadProducts();
  }

  loadProducts(): void {
    // South African medical products with ZAR pricing
    this.products = [
      {
        id: 1,
        name: 'Blood Pressure Monitor (Digital)',
        category: 'Diagnostic',
        price: 1200,
        stock: 25,
        supplier: 'Adcock Ingram Healthcare',
        description: 'Automatic digital blood pressure monitor with memory function',
        status: 'In Stock',
        lastRestocked: new Date('2024-01-10')
      },
      {
        id: 2,
        name: 'Glucose Test Strips (Box of 50)',
        category: 'Diabetes Care',
        price: 280,
        stock: 8,
        supplier: 'Pharma Dynamics',
        description: 'Compatible with most glucose meters',
        status: 'Low Stock',
        lastRestocked: new Date('2024-01-05')
      },
      {
        id: 3,
        name: 'Digital Thermometer',
        category: 'Basic Care',
        price: 125,
        stock: 50,
        supplier: 'Dis-Chem Pharmacies',
        description: 'Fast and accurate digital thermometer',
        status: 'In Stock',
        lastRestocked: new Date('2024-01-12')
      },
      {
        id: 4,
        name: 'Pulse Oximeter',
        category: 'Monitoring',
        price: 650,
        stock: 0,
        supplier: 'Fresenius Kabi',
        description: 'Fingertip pulse oximeter with OLED display',
        status: 'Out of Stock',
        lastRestocked: new Date('2023-12-20')
      },
      {
        id: 5,
        name: 'Stethoscope (Dual Head)',
        category: 'Professional',
        price: 950,
        stock: 15,
        supplier: 'Alpha Pharm',
        description: 'Professional dual-head stethoscope',
        status: 'In Stock',
        lastRestocked: new Date('2024-01-08')
      },
      {
        id: 6,
        name: 'Insulin Pen Needles (100 pack)',
        category: 'Diabetes Care',
        price: 95,
        stock: 200,
        supplier: 'Aspen Pharmacare',
        description: 'Ultra-fine insulin pen needles',
        status: 'In Stock',
        lastRestocked: new Date('2024-01-15')
      },
      {
        id: 7,
        name: 'Wound Care Kit',
        category: 'Wound Care',
        price: 185,
        stock: 3,
        supplier: 'Bodene Healthcare',
        description: 'Complete wound care and dressing kit',
        status: 'Low Stock',
        lastRestocked: new Date('2024-01-03')
      },
      {
        id: 8,
        name: 'Nebulizer Machine',
        category: 'Respiratory',
        price: 1800,
        stock: 12,
        supplier: 'Clicks Group',
        description: 'Portable nebulizer for respiratory treatments',
        status: 'In Stock',
        lastRestocked: new Date('2024-01-11')
      }
    ];
    
    this.filteredProducts = [...this.products];
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
}
