import { Component, OnInit } from '@angular/core';
import { OrderDataService, OrderRecord, SalesRecord } from '../../../services/order-data.service';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit {

  // Dual data support
  orders: OrderRecord[] = [];
  filteredOrders: OrderRecord[] = [];
  salesRecords: SalesRecord[] = [];
  filteredSalesRecords: SalesRecord[] = [];
  
  // View mode toggle
  viewMode: 'orders' | 'sales' = 'sales'; // Default to sales
  
  // Filter properties for orders
  searchTerm: string = '';
  selectedStatus: string = 'All';
  selectedProvince: string = 'All';
  selectedCustomer: string = 'All';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  
  // Additional filter properties for sales
  selectedInstitution: string = 'All';
  selectedProductType: string = 'All';
  
  // Filter options
  statusOptions: string[] = ['All'];
  provinceOptions: string[] = ['All'];
  customerOptions: string[] = ['All'];
  institutionOptions: string[] = ['All'];
  productTypeOptions: string[] = ['All'];
  
  constructor(private orderDataService: OrderDataService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadSalesRecords();
    this.loadFilterOptions();
  }

  loadOrders(): void {
    this.orders = this.orderDataService.getAllOrderRecords();
    this.filteredOrders = [...this.orders];
  }

  loadSalesRecords(): void {
    this.salesRecords = this.orderDataService.getAllSalesRecords();
    this.filteredSalesRecords = [...this.salesRecords];
  }

  loadFilterOptions(): void {
    // Order filter options
    this.statusOptions = ['All', ...this.orderDataService.getUniqueStatuses()];
    this.provinceOptions = ['All', ...this.orderDataService.getUniqueProvinces()];
    this.customerOptions = ['All', ...this.orderDataService.getUniqueCustomers()];
    
    // Sales filter options
    this.institutionOptions = ['All', ...this.orderDataService.getUniqueInstitutions()];
    this.productTypeOptions = ['All', ...this.orderDataService.getUniqueProductTypes()];
    
    // Merge province options from both
    const salesProvinces = this.orderDataService.getUniqueSalesProvinces();
    const allProvinces = [...new Set([...this.provinceOptions.slice(1), ...salesProvinces])];
    this.provinceOptions = ['All', ...allProvinces.sort()];
  }

  switchViewMode(mode: 'orders' | 'sales'): void {
    this.viewMode = mode;
    this.clearFilters();
  }

  applyFilters(): void {
    if (this.viewMode === 'orders') {
      const criteria = {
        searchTerm: this.searchTerm,
        province: this.selectedProvince,
        status: this.selectedStatus,
        customerName: this.selectedCustomer,
        dateFrom: this.dateFrom || undefined,
        dateTo: this.dateTo || undefined
      };
      this.filteredOrders = this.orderDataService.searchOrders(criteria);
    } else {
      const criteria = {
        searchTerm: this.searchTerm,
        province: this.selectedProvince,
        status: this.selectedStatus,
        institution: this.selectedInstitution,
        productType: this.selectedProductType,
        dateFrom: this.dateFrom || undefined,
        dateTo: this.dateTo || undefined
      };
      this.filteredSalesRecords = this.orderDataService.searchSalesRecords(criteria);
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All';
    this.selectedProvince = 'All';
    this.selectedCustomer = 'All';
    this.selectedInstitution = 'All';
    this.selectedProductType = 'All';
    this.dateFrom = null;
    this.dateTo = null;
    
    if (this.viewMode === 'orders') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredSalesRecords = [...this.salesRecords];
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Not delivered': return 'badge-danger';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  viewOrderDetails(order: OrderRecord): void {
    console.log('Viewing order details:', order);
  }

  viewSalesDetails(sales: SalesRecord): void {
    console.log('Viewing sales details:', sales);
  }

  exportData(): void {
    if (this.viewMode === 'orders') {
      const exportData = this.orderDataService.exportOrderData();
      this.downloadCSV(exportData, 'orders-export.csv');
    } else {
      const exportData = this.orderDataService.exportSalesData();
      this.downloadCSV(exportData, 'sales-export.csv');
    }
  }

  private downloadCSV(data: any[], filename: string): void {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getTotalSalesAmount(): number {
    return this.filteredSalesRecords.reduce((total, record) => total + record.salesAmount, 0);
  }

  getTotalQuantity(): number {
    return this.filteredSalesRecords.reduce((total, record) => total + record.quantity, 0);
  }

  getCurrentDataCount(): number {
    return this.viewMode === 'orders' ? this.filteredOrders.length : this.filteredSalesRecords.length;
  }

  editOrder(order: OrderRecord): void {
    console.log('Editing order:', order);
  }

  deleteOrder(order: OrderRecord): void {
    if (window.confirm('Are you sure you want to delete this order?')) {
      this.orders = this.orders.filter(o => o.orderNumber !== order.orderNumber);
      this.applyFilters();
    }
  }

  printOrder(order: OrderRecord): void {
    console.log('Printing order:', order);
  }

  getDeliveredOrders(): number {
    if (this.viewMode === 'orders') {
      return this.filteredOrders.filter(o => o.status === 'Delivered').length;
    } else {
      return this.filteredSalesRecords.filter(s => s.status === 'Delivered').length;
    }
  }

  getNotDeliveredOrders(): number {
    if (this.viewMode === 'orders') {
      return this.filteredOrders.filter(o => o.status === 'Not delivered').length;
    } else {
      return this.filteredSalesRecords.filter(s => s.status === 'Not delivered').length;
    }
  }

  getPendingOrders(): number {
    if (this.viewMode === 'orders') {
      return this.filteredOrders.filter(o => o.status === 'Pending').length;
    } else {
      return this.filteredSalesRecords.filter(s => s.status === 'Pending').length;
    }
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

  getProvinceClass(province: string): string {
    const colors = {
      'Gauteng': 'text-primary',
      'Free State': 'text-success',
      'Kwa-Zulu Natal': 'text-warning',
      'Limpopo': 'text-info',
      'Mpumalanga': 'text-secondary',
      'Eastern Cape': 'text-dark',
      'Western Cape': 'text-danger',
      'Northern Cape': 'text-muted'
    };
    return colors[province as keyof typeof colors] || 'text-dark';
  }

  getTotalValue(): number {
    if (this.viewMode === 'orders') {
      return this.filteredOrders.reduce((sum, order) => sum + (order.totalValue || 0), 0);
    } else {
      return this.getTotalSalesAmount();
    }
  }

  exportToExcel(): void {
    // Alternative export method for Excel format
    if (this.viewMode === 'orders') {
      const exportData = this.orderDataService.exportOrderData();
      this.downloadCSV(exportData, 'orders-export.xlsx');
    } else {
      const exportData = this.orderDataService.exportSalesData();
      this.downloadCSV(exportData, 'sales-export.xlsx');
    }
  }
}