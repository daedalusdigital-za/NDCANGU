import { Component, OnInit } from '@angular/core';
import { OrderDataService, OrderRecord, SalesRecord } from '../../../services/order-data.service';
import { DatabaseService } from '../../../services/data/database.service';
import { ToastrService } from 'ngx-toastr';

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

  // Loading state
  isLoading: boolean = false;

  // Edit modal state
  showEditModal: boolean = false;
  selectedSaleForEdit: any = null;

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

  constructor(
    private orderDataService: OrderDataService,
    private databaseService: DatabaseService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadSalesRecords();
    this.loadFilterOptions();
  }

  loadOrders(): void {
    this.isLoading = true;

    // Load from database API
    this.databaseService.getSales().subscribe({
      next: (sales) => {
        console.log(`✅ Loaded ${sales.length} sales from database`);

        // Convert Sale format to OrderRecord format for display
        this.orders = sales.map(sale => this.convertSaleToOrder(sale));
        this.filteredOrders = [...this.orders];
        this.isLoading = false;

        // Show success message if data loaded
        if (sales.length > 0) {
          this.toastr.success(`Loaded ${sales.length} orders from database`, 'Data Loaded');
        }
      },
      error: (error) => {
        console.warn('⚠️ API unavailable, using fallback data:', error);

        // Fallback to hardcoded data if API fails
        this.orders = this.orderDataService.getAllOrderRecords();
        this.filteredOrders = [...this.orders];
        this.isLoading = false;

        this.toastr.info('Using cached order data (API unavailable)', 'Offline Mode');
      }
    });
  }

  loadSalesRecords(): void {
    this.isLoading = true;

    // Load from database API
    this.databaseService.getSales().subscribe({
      next: (sales) => {
        console.log(`✅ Loaded ${sales.length} sales records from database`);
        console.log('📦 Raw sales data from API:', JSON.stringify(sales, null, 2));

        // Convert Sale format to SalesRecord format for display
        this.salesRecords = sales.map(sale => this.convertSaleToSalesRecord(sale));
        console.log('📊 Converted sales records:', this.salesRecords);
        this.filteredSalesRecords = [...this.salesRecords];
        this.isLoading = false;
      },
      error: (error) => {
        console.warn('⚠️ API unavailable, using fallback data:', error);

        // Fallback to hardcoded data if API fails
        this.salesRecords = this.orderDataService.getAllSalesRecords();
        this.filteredSalesRecords = [...this.salesRecords];
        this.isLoading = false;
      }
    });
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

  viewOrderDetails(
    order: OrderRecord): void {
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
    this.selectedSaleForEdit = order;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedSaleForEdit = null;
  }

  onSaleUpdateSuccess(): void {
    this.toastr.success('Sale updated successfully!', 'Success');
    this.closeEditModal();
    // Reload data
    this.loadOrders();
    this.loadSalesRecords();
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

  /**
   * Convert Sale API format to OrderRecord display format
   */
  private convertSaleToOrder(sale: any): OrderRecord {
    const firstItem = sale.saleItems && sale.saleItems.length > 0 ? sale.saleItems[0] : null;

    return {
      orderNumber: sale.saleNumber || '',
      orderDate: this.formatDateForDisplay(sale.saleDate),
      customerName: sale.hospital || '',
      province: sale.province || '',
      poNumber: sale.invoiceNumber || '',
      itemDescription: firstItem?.productName || '',
      qtyBackOrder: firstItem?.quantity || 0,
      unitPrice: firstItem?.unitPrice || 0,
      status: this.mapDeliveryStatus(sale.deliveryStatus),
      totalValue: sale.totalAmount || (firstItem?.quantity * firstItem?.unitPrice) || 0
    };
  }

  /**
   * Convert Sale API format to SalesRecord display format
   */
  private convertSaleToSalesRecord(sale: any): SalesRecord {
    const firstItem = sale.saleItems && sale.saleItems.length > 0 ? sale.saleItems[0] : null;

    return {
      institution: sale.hospital || '',
      province: sale.province || '',
      itemDescription: firstItem?.productName || '',
      date: this.formatDateForDisplay(sale.saleDate),
      invoiceNumber: sale.invoiceNumber || sale.saleNumber || '',
      quantity: firstItem?.quantity || 0,
      salesAmount: sale.totalAmount || (firstItem?.quantity * firstItem?.unitPrice) || 0,
      status: this.mapDeliveryStatus(sale.deliveryStatus)
    };
  }

  /**
   * Format ISO date to display format (YYYY/MM/DD)
   */
  private formatDateForDisplay(isoDate: string): string {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  /**
   * Map delivery status enum to display text
   * API: 0=Pending, 1=Processing, 2=Shipped, 3=Delivered, 4=Cancelled
   */
  private mapDeliveryStatus(status: number): string {
    switch (status) {
      case 0: return 'Not delivered';
      case 1: return 'Processing';
      case 2: return 'Shipped';
      case 3: return 'Delivered';
      case 4: return 'Cancelled';
      default: return 'Pending';
    }
  }
}
