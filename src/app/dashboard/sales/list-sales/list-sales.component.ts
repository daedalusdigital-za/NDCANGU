import { Component, OnInit } from '@angular/core';
import { OrderDataService, OrderRecord } from '../../../services/order-data.service';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit {

  orders: OrderRecord[] = [];
  filteredOrders: OrderRecord[] = [];
  
  // Filter properties
  searchTerm: string = '';
  selectedStatus: string = 'All';
  selectedProvince: string = 'All';
  selectedCustomer: string = 'All';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  
  // Filter options
  statusOptions: string[] = ['All'];
  provinceOptions: string[] = ['All'];
  customerOptions: string[] = ['All'];
  
  constructor(private orderDataService: OrderDataService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadFilterOptions();
  }

  loadOrders(): void {
    this.orders = this.orderDataService.getAllOrderRecords();
    this.filteredOrders = [...this.orders];
  }

  loadFilterOptions(): void {
    this.statusOptions = ['All', ...this.orderDataService.getUniqueStatuses()];
    this.provinceOptions = ['All', ...this.orderDataService.getUniqueProvinces()];
    this.customerOptions = ['All', ...this.orderDataService.getUniqueCustomers()];
  }

  applyFilters(): void {
    const criteria = {
      searchTerm: this.searchTerm,
      province: this.selectedProvince,
      status: this.selectedStatus,
      customerName: this.selectedCustomer,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined
    };
    
    this.filteredOrders = this.orderDataService.searchOrders(criteria);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All';
    this.selectedProvince = 'All';
    this.selectedCustomer = 'All';
    this.dateFrom = null;
    this.dateTo = null;
    this.filteredOrders = [...this.orders];
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
    // Implementation for viewing order details
    console.log('Viewing order details:', order);
  }

  editOrder(order: OrderRecord): void {
    // Implementation for editing order
    console.log('Editing order:', order);
  }

  deleteOrder(order: OrderRecord): void {
    // Implementation for deleting order
    if (confirm('Are you sure you want to delete this order?')) {
      this.orders = this.orders.filter(o => o.orderNumber !== order.orderNumber);
      this.applyFilters();
    }
  }

  exportToExcel(): void {
    // Implementation for Excel export
    const exportData = this.orderDataService.exportOrderData();
    console.log('Exporting to Excel...', exportData);
  }

  printOrder(order: OrderRecord): void {
    // Implementation for printing order
    console.log('Printing order:', order);
  }

  getTotalValue(): number {
    return this.orders.reduce((sum, order) => sum + (order.totalValue || 0), 0);
  }

  getTotalQuantity(): number {
    return this.orders.reduce((sum, order) => sum + order.qtyBackOrder, 0);
  }

  getDeliveredOrders(): number {
    return this.orders.filter(o => o.status === 'Delivered').length;
  }

  getNotDeliveredOrders(): number {
    return this.orders.filter(o => o.status === 'Not delivered').length;
  }

  getPendingOrders(): number {
    return this.orders.filter(o => o.status === 'Pending').length;
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
}
