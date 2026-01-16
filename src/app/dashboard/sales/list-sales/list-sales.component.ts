import { Component, OnInit } from '@angular/core';
import { OrderDataService, OrderRecord, SalesRecord } from '../../../services/order-data.service';
import { DatabaseService } from '../../../services/data/database.service';
import { Sale, SaleItem } from '../../../shared/interfaces/common.interfaces';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit {

  // Simplified data support - work directly with Sale interface
  orders: OrderRecord[] = [];
  filteredOrders: OrderRecord[] = [];
  sales: Sale[] = []; // Updated to use proper Sale interface
  filteredSales: Sale[] = []; // For template compatibility
  creditedSales: Sale[] = []; // Sales with credit notes
  filteredCreditedSales: Sale[] = []; // Filtered credited sales

  // Maintain backwards compatibility
  salesRecords: SalesRecord[] = [];
  filteredSalesRecords: SalesRecord[] = [];

  // View mode toggle
  viewMode: 'orders' | 'sales' | 'credited' = 'sales'; // Default to sales

  // Loading state
  isLoading = false;

  // Edit modal state
  showEditModal = false;
  selectedSaleForEdit: Sale | null = null;

  // Filter properties for orders
  searchTerm = '';
  selectedStatus = 'All';
  selectedProvince = 'All';
  selectedCustomer = 'All';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  // Additional filter properties for sales
  selectedInstitution = 'All';
  selectedProductType = 'All';

  // Filter options
  statusOptions: string[] = ['All'];
  provinceOptions: string[] = ['All'];
  customerOptions: string[] = ['All'];
  institutionOptions: string[] = ['All'];
  productTypeOptions: string[] = ['All'];

  // 📦 Dynamic Inventory Reference - Loaded from API
  private inventoryLookup: { [key: number]: { name: string; price: number } } = {};

  constructor(
    private orderDataService: OrderDataService,
    private databaseService: DatabaseService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadInventoryLookup(); // Load inventory first
    this.loadOrders();
    this.loadSalesRecords();
    // Filter options will be loaded after data is fetched
  }

  /**
   * Load inventory from API to populate inventoryLookup for product name/price display
   * and populate Product Type filter options
   */
  loadInventoryLookup(): void {
    console.log('🔄 Loading inventory lookup from API...');

    this.databaseService.getInventoryItems().subscribe({
      next: (items) => {
        console.log(`✅ Loaded ${items.length} inventory items for lookup`);

        // Build lookup table from real API data
        this.inventoryLookup = {};
        const productNames = new Set<string>();

        items.forEach(item => {
          this.inventoryLookup[item.id] = {
            name: item.name || item.description || `Item ${item.id}`,
            price: item.unitPrice || 0
          };

          // Collect product names for filter dropdown
          if (item.name) {
            productNames.add(item.name);
          }
        });

        // Populate Product Type options from inventory
        this.productTypeOptions = ['All', ...Array.from(productNames).sort()];
        console.log('📦 Inventory lookup built:', this.inventoryLookup);
        console.log('🔽 Product Type options loaded:', this.productTypeOptions.length - 1, 'products');
      },
      error: (error) => {
        console.warn('⚠️ Failed to load inventory for lookup:', error);
        // Keep empty lookup - getInventoryDetails will handle unknown items
        this.inventoryLookup = {};
        this.productTypeOptions = ['All'];
      }
    });
  }

  loadOrders(): void {
    this.isLoading = true;

    // Load from database API
    this.databaseService.getSales().subscribe({
      next: (sales) => {
        // Sales loaded successfully

        // Convert Sale format to OrderRecord format for display
        this.orders = sales.map(sale => this.convertSaleToOrder(sale));
        this.filteredOrders = [...this.orders];
        this.isLoading = false;

        // Reload filter options after orders are loaded
        this.loadFilterOptions();

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

        // Reload filter options after fallback data is loaded
        this.loadFilterOptions();

        this.toastr.info('Using cached order data (API unavailable)', 'Offline Mode');
      }
    });
  }

  loadSalesRecords(): void {
    this.isLoading = true;

    // Load from database API using simplified Sale interface
    this.databaseService.getSales().subscribe({
      next: (salesData) => {
        // Sales data loaded from database
        // Sales data processed

        // Work directly with simplified Sale interface
        this.sales = salesData;
        this.filteredSales = [...this.sales];

        // Maintain backwards compatibility with old SalesRecord format for filters
        this.salesRecords = salesData.map(sale => this.convertSaleToSalesRecord(sale));
        this.filteredSalesRecords = [...this.salesRecords];

        this.isLoading = false;

        // Reload filter options after sales data is loaded
        this.loadFilterOptions();

        if (salesData.length > 0) {
          this.toastr.success(`Loaded ${salesData.length} sales records`, 'Sales Data Loaded');
        }
      },
      error: (error) => {
        console.warn('⚠️ API unavailable, using fallback data:', error);

        // Fallback to hardcoded data if API fails
        this.salesRecords = this.orderDataService.getAllSalesRecords();
        this.filteredSalesRecords = [...this.salesRecords];

        // Convert to simplified format
        this.sales = this.salesRecords.map(record => this.convertSalesRecordToSale(record));
        this.filteredSales = [...this.sales];

        this.isLoading = false;

        // Reload filter options after fallback data is loaded
        this.loadFilterOptions();

        this.toastr.info('Using cached sales data (API unavailable)', 'Offline Mode');
      }
    });
  }

  /**
   * Load credited sales - sales that have associated credit notes
   */
  loadCreditedSales(): void {
    this.isLoading = true;

    // TODO: Replace with actual API call to get credited sales
    // For now, we'll simulate credited sales by filtering sales
    // In production, this should call: this.salesApiService.getCreditedSales()

    this.databaseService.getSales().subscribe({
      next: (salesData) => {
        // In real implementation, filter sales that have credit notes
        // For now, we'll show all sales as a placeholder
        // When backend is ready, this will filter based on credit note relationships
        this.creditedSales = salesData.filter((sale: any) => {
          // Placeholder logic - in real app, check if sale.hasCreditNote === true
          // or join with credit notes table
          return sale.id % 2 === 0; // Mock: show every other sale as "credited"
        });

        this.filteredCreditedSales = [...this.creditedSales];
        this.isLoading = false;

        if (this.creditedSales.length > 0) {
          this.toastr.success(`Loaded ${this.creditedSales.length} credited sales`, 'Credited Sales Loaded');
        } else {
          this.toastr.info('No credited sales found', 'Credited Sales');
        }
      },
      error: (error) => {
        console.warn('⚠️ Failed to load credited sales:', error);
        this.creditedSales = [];
        this.filteredCreditedSales = [];
        this.isLoading = false;
        this.toastr.error('Failed to load credited sales', 'Error');
      }
    });
  }

  loadFilterOptions(): void {
    // Order filter options
    this.statusOptions = ['All', ...this.orderDataService.getUniqueStatuses()];

    // Province options - Always include all 9 South African provinces
    this.provinceOptions = [
      'All',
      'Eastern Cape',
      'Free State',
      'Gauteng',
      'KwaZulu-Natal',
      'Limpopo',
      'Mpumalanga',
      'Northern Cape',
      'North West',
      'Western Cape'
    ];

    this.customerOptions = ['All', ...this.orderDataService.getUniqueCustomers()];

    // Sales filter options - extract from actual sales data
    if (this.sales && this.sales.length > 0) {
      // Get unique institutions from sales
      const uniqueInstitutions = [...new Set(this.sales.map(s => s.customerName).filter(Boolean))].sort();
      this.institutionOptions = ['All', ...uniqueInstitutions];

      // Get unique customers for the customer dropdown
      const uniqueCustomers = [...new Set(this.sales.map(s => s.customerName).filter(Boolean))].sort();
      this.customerOptions = ['All', ...uniqueCustomers];

      // Product Type options are already loaded from inventory in loadInventoryLookup()
      // Only add products from sales if inventory hasn't loaded yet
      if (this.productTypeOptions.length <= 1) {
        const uniqueProducts = new Set<string>();
        this.sales.forEach(sale => {
          if (sale.saleItems && Array.isArray(sale.saleItems)) {
            sale.saleItems.forEach(item => {
              if (item.inventoryItemName) {
                uniqueProducts.add(item.inventoryItemName);
              }
            });
          }
        });
        this.productTypeOptions = ['All', ...Array.from(uniqueProducts).sort()];
      }
    } else {
      // Fallback to OrderDataService
      this.institutionOptions = ['All', ...this.orderDataService.getUniqueInstitutions()];

      // Only use fallback product types if inventory hasn't loaded
      if (this.productTypeOptions.length <= 1) {
        this.productTypeOptions = ['All', ...this.orderDataService.getUniqueProductTypes()];
      }
    }

    // Ensure status options include relevant statuses
    if (!this.statusOptions.includes('Completed')) {
      this.statusOptions.push('Completed');
    }
  }

  switchViewMode(mode: 'orders' | 'sales' | 'credited'): void {
    this.viewMode = mode;
    this.clearFilters();

    if (mode === 'credited') {
      this.loadCreditedSales();
    }
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
    } else if (this.viewMode === 'credited') {
      // Filter credited sales
      this.filteredCreditedSales = this.creditedSales.filter(sale => {
        // Search term filter
        const matchesSearch = !this.searchTerm ||
          sale.saleNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          sale.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (sale.saleItems && sale.saleItems.some(item =>
            item.inventoryItemName?.toLowerCase().includes(this.searchTerm.toLowerCase())
          ));

        // Province filter
        const matchesProvince = this.selectedProvince === 'All' ||
          sale.provinceName === this.selectedProvince;

        // Institution filter
        const matchesInstitution = this.selectedInstitution === 'All' ||
          sale.customerName === this.selectedInstitution;

        // Product type filter
        const matchesProductType = this.selectedProductType === 'All' ||
          (sale.saleItems && sale.saleItems.some(item =>
            item.inventoryItemName === this.selectedProductType
          ));

        // Date range filter
        const matchesDateRange = (!this.dateFrom || new Date(sale.saleDate) >= this.dateFrom) &&
          (!this.dateTo || new Date(sale.saleDate) <= this.dateTo);

        return matchesSearch && matchesProvince && matchesInstitution &&
               matchesProductType && matchesDateRange;
      });
    } else {
      // Enhanced filtering for sales using the simplified Sale structure
      this.filteredSales = this.sales.filter(sale => {
        // Search term filter - search in invoice, customer, and product items
        const matchesSearch = !this.searchTerm ||
          sale.saleNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          sale.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (sale.saleItems && sale.saleItems.some(item =>
            item.inventoryItemName?.toLowerCase().includes(this.searchTerm.toLowerCase())
          ));

        // Province filter
        const matchesProvince = this.selectedProvince === 'All' ||
          sale.provinceName === this.selectedProvince;

        // Status filter (default to 'Completed' for all sales from API)
        const saleStatus = 'Completed'; // All sales are completed
        const matchesStatus = this.selectedStatus === 'All' ||
          saleStatus === this.selectedStatus;

        // Institution filter (same as customer name)
        const matchesInstitution = this.selectedInstitution === 'All' ||
          sale.customerName === this.selectedInstitution;

        // Product type filter - check if any sale items match
        const matchesProductType = this.selectedProductType === 'All' ||
          (sale.saleItems && sale.saleItems.some(item =>
            item.inventoryItemName === this.selectedProductType
          ));

        // Date range filter
        const matchesDateRange = (!this.dateFrom || new Date(sale.saleDate) >= this.dateFrom) &&
          (!this.dateTo || new Date(sale.saleDate) <= this.dateTo);

        return matchesSearch && matchesProvince && matchesStatus &&
               matchesInstitution && matchesProductType && matchesDateRange;
      });

      // Also update the old format for compatibility
      this.filteredSalesRecords = this.salesRecords.filter(record => {
        const matchesSearch = !this.searchTerm ||
          record.invoiceNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          record.institution?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          record.itemDescription?.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesProvince = this.selectedProvince === 'All' ||
          record.province === this.selectedProvince;

        const matchesStatus = this.selectedStatus === 'All' ||
          record.status === this.selectedStatus;

        const matchesInstitution = this.selectedInstitution === 'All' ||
          record.institution === this.selectedInstitution;

        const matchesProductType = this.selectedProductType === 'All' ||
          record.itemDescription === this.selectedProductType;

        const recordDate = new Date(record.date);
        const matchesDateRange = (!this.dateFrom || recordDate >= this.dateFrom) &&
          (!this.dateTo || recordDate <= this.dateTo);

        return matchesSearch && matchesProvince && matchesStatus &&
               matchesInstitution && matchesProductType && matchesDateRange;
      });
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
      this.filteredSales = [...this.sales];
      this.filteredSalesRecords = [...this.salesRecords]; // Keep both for compatibility
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
    // TODO: Convert OrderRecord to Sale format for editing
    this.showEditModal = true;
  }

  editSale(sale: Sale): void {
    console.log('editSale called with sale:', sale);
    console.log('Setting selectedSaleForEdit to:', sale);
    this.selectedSaleForEdit = sale;
    console.log('selectedSaleForEdit after assignment:', this.selectedSaleForEdit);
    console.log('Setting showEditModal to true');
    this.showEditModal = true;
    console.log('showEditModal after assignment:', this.showEditModal);
  }

  deleteSale(sale: Sale): void {
    if (confirm('Are you sure you want to delete this sale record?')) {
      console.log('Deleting sale:', sale);
      this.databaseService.deleteSale(sale.id).subscribe({
        next: () => {
          this.toastr.success('Sale deleted successfully');
          this.loadSalesRecords();
        },
        error: (error) => {
          console.error('Error deleting sale:', error);
          this.toastr.error('Failed to delete sale');
        }
      });
    }
  }

  printSalesRecord(sale: Sale): void {
    console.log('Printing sales record:', sale);
    // TODO: Implement proper print functionality with sale items
    window.print(); // Basic print for now
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
    let exportData: any[] = [];
    let filename = '';
    let sheetName = '';

    if (this.viewMode === 'orders') {
      exportData = this.filteredOrders.map(order => ({
        'Order Number': order.orderNumber,
        'Order Date': order.orderDate,
        'Customer Name': order.customerName,
        'Province': order.province,
        'PO Number': order.poNumber,
        'Item Description': order.itemDescription,
        'Quantity': order.qtyBackOrder,
        'Unit Price': order.unitPrice,
        'Status': order.status,
        'Total Value': order.totalValue
      }));
      filename = 'orders-export.xlsx';
      sheetName = 'Orders';
    } else if (this.viewMode === 'credited') {
      exportData = this.filteredCreditedSales.map(sale => ({
        'Invoice Number': sale.saleNumber,
        'Sale Date': new Date(sale.saleDate).toLocaleDateString(),
        'Customer Name': sale.customerName,
        'Customer Phone': sale.customerPhone,
        'Province': sale.provinceName,
        'Original Amount': sale.total,
        'Items Count': sale.saleItems?.length || 0,
        'Status': 'Credited'
      }));
      filename = 'credited-sales-export.xlsx';
      sheetName = 'Credited Sales';
    } else {
      exportData = this.filteredSales.map(sale => ({
        'Invoice Number': sale.saleNumber,
        'Sale Date': new Date(sale.saleDate).toLocaleDateString(),
        'Customer Name': sale.customerName,
        'Customer Phone': sale.customerPhone,
        'Province': sale.provinceName,
        'Subtotal': sale.subtotal,
        'Total': sale.total,
        'Items Count': sale.saleItems?.length || 0,
        'Notes': sale.notes || ''
      }));
      filename = 'sales-export.xlsx';
      sheetName = 'Sales';
    }

    if (exportData.length === 0) {
      this.toastr.warning('No data to export', 'Export');
      return;
    }

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Save file
    XLSX.writeFile(wb, filename);
    this.toastr.success(`Exported ${exportData.length} records`, 'Export Successful');
  }

  importFromExcel(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
              this.toastr.warning('No data found in the Excel file', 'Import');
              return;
            }

            // Show preview modal or process data
            this.processImportedData(jsonData);
          } catch (error) {
            console.error('Error reading Excel file:', error);
            this.toastr.error('Failed to read Excel file. Please ensure it\'s a valid Excel file.', 'Import Error');
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  }

  private processImportedData(data: any[]): void {
    // TODO: Implement data validation and import logic
    // This is a placeholder - you'll need to validate the data format
    // and call the appropriate API to import the sales/orders

    console.log('Imported data:', data);
    this.toastr.info(`Found ${data.length} records in the file. Import functionality will be implemented based on your data structure.`, 'Import Preview');

    // Example of what you might do:
    // 1. Validate the data format matches expected structure
    // 2. Transform the data to match your Sale/Order interface
    // 3. Call API to bulk import:
    // this.databaseService.bulkImportSales(transformedData).subscribe(...)
  }

  /**
   * Convert Sale API format to OrderRecord display format
   */
  private convertSaleToOrder(sale: Sale): OrderRecord {
    const firstItem = sale.saleItems && sale.saleItems.length > 0 ? sale.saleItems[0] : null;

    return {
      orderNumber: sale.saleNumber || '',
      orderDate: this.formatDateForDisplay(sale.saleDate),
      customerName: sale.customerName || '',
      province: 'N/A', // Province not available in Sale structure
      poNumber: sale.saleNumber || '', // Use sale number as PO number
      itemDescription: firstItem?.inventoryItemName || '',
      qtyBackOrder: firstItem?.quantity || 0,
      unitPrice: firstItem?.unitPrice || 0,
      status: 'Completed', // Default status since delivery status removed
      totalValue: sale.total || 0
    };
  }

  /**
   * Convert Sale API format to SalesRecord display format
   */
  private convertSaleToSalesRecord(sale: Sale): SalesRecord {
    const firstItem = sale.saleItems && sale.saleItems.length > 0 ? sale.saleItems[0] : null;

    return {
      institution: sale.customerName || '',
      province: 'N/A', // Province not available in Sale structure
      itemDescription: firstItem?.inventoryItemName || '',
      date: this.formatDateForDisplay(sale.saleDate),
      invoiceNumber: sale.saleNumber || '',
      quantity: firstItem?.quantity || 0,
      salesAmount: sale.total || 0,
      status: 'Completed' // Default status since delivery status removed
    };
  }

  /**
   * Convert SalesRecord back to Sale format
   */
  private convertSalesRecordToSale(record: SalesRecord): Sale {
    return {
      id: 0, // Will be assigned by API
      saleNumber: record.invoiceNumber,
      saleDate: record.date,
      customerId: undefined,
      customerName: record.institution,
      customerPhone: '', // Not available in old format
      subtotal: record.salesAmount,
      total: record.salesAmount,
      notes: '',
      provinceId: 1, // Default province
      provinceName: 'Unknown Province',
      dateCreated: record.date,
      lastUpdated: record.date,
      saleItems: [{
        id: 0,
        saleId: 0,
        inventoryItemId: 1,
        inventoryItemName: record.itemDescription,
        quantity: record.quantity,
        unitPrice: record.quantity > 0 ? record.salesAmount / record.quantity : 0,
        totalPrice: record.salesAmount
      }]
    };
  }

  /**
   * View details of a sale record - displays formatted sale information
   */
  viewSaleDetails(sale: Sale): void {
    console.log('Viewing sale details:', sale);

    // Format the sale details as specified
    const saleDetails = `
saleNumber    : ${sale.saleNumber}
saleDate      : ${sale.saleDate}
customerName  : ${sale.customerName}
customerPhone : ${sale.customerPhone || ''}
total         : ${sale.total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Format sale items with equipment names
    let itemsDetails = '\n\n📋 Equipment Items:';
    if (sale.saleItems && sale.saleItems.length > 0) {
      sale.saleItems.forEach((item: SaleItem) => {
        const equipment = this.getEquipmentByInventoryId(item.inventoryItemId);
        itemsDetails += `\n  ID ${item.inventoryItemId}: ${equipment.name} (R${item.unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}) x${item.quantity} = R${item.totalPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
      });
    } else {
      itemsDetails += '\n  No items found';
    }

    const fullDetails = saleDetails + itemsDetails;

    console.log('Sale Details:');
    console.log(fullDetails);

    // Show in toast notification as well
    this.toastr.info(`Sale Details:${fullDetails}`, `Sale: ${sale.saleNumber}`, {
      timeOut: 15000,
      extendedTimeOut: 8000
    });
  }

  /**
   * Get equipment information by inventory ID
   */
  private getEquipmentByInventoryId(inventoryId: number): { name: string; price: number } {
    return this.inventoryLookup[inventoryId] || { name: `Unknown Equipment (ID: ${inventoryId})`, price: 0 };
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
