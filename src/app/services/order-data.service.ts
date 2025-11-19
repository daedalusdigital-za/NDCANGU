import { Injectable } from '@angular/core';
import { completeSalesData } from './sales-data-import';

export interface OrderRecord {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  province: string;
  poNumber: string;
  itemDescription: string;
  qtyBackOrder: number;
  unitPrice: number;
  status: string;
  totalValue?: number;
}

export interface SalesRecord {
  institution: string;
  province: string;
  itemDescription: string;
  date: string;
  invoiceNumber: string;
  quantity: number;
  salesAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {

  private orderRecords: OrderRecord[] = [
    // Removed hardcoded test data
  ];

  private salesRecords: SalesRecord[] = completeSalesData;

  constructor() {
    // Calculate total values for each order record
    this.orderRecords = this.orderRecords.map(order => ({
      ...order,
      totalValue: order.qtyBackOrder * order.unitPrice
    }));
  }

  /**
   * Get all order records
   */
  getAllOrderRecords(): OrderRecord[] {
    return this.orderRecords;
  }

  /**
   * Get order records filtered by province
   */
  getOrderRecordsByProvince(province: string): OrderRecord[] {
    return this.orderRecords.filter(record => record.province === province);
  }

  /**
   * Get order records filtered by customer name
   */
  getOrderRecordsByCustomer(customerName: string): OrderRecord[] {
    return this.orderRecords.filter(record =>
      record.customerName.toLowerCase().includes(customerName.toLowerCase())
    );
  }

  /**
   * Get order records filtered by status
   */
  getOrderRecordsByStatus(status: string): OrderRecord[] {
    return this.orderRecords.filter(record => record.status === status);
  }

  /**
   * Get order records filtered by item description
   */
  getOrderRecordsByItem(itemDescription: string): OrderRecord[] {
    return this.orderRecords.filter(record =>
      record.itemDescription.toLowerCase().includes(itemDescription.toLowerCase())
    );
  }

  /**
   * Get order statistics summary
   */
  getOrderStatistics(): any {
    const totalRecords = this.orderRecords.length;
    const totalValue = this.orderRecords.reduce((sum, record) => sum + (record.totalValue || 0), 0);
    const totalQuantity = this.orderRecords.reduce((sum, record) => sum + record.qtyBackOrder, 0);
    const uniqueProvinces = [...new Set(this.orderRecords.map(record => record.province))];
    const uniqueCustomers = [...new Set(this.orderRecords.map(record => record.customerName))];
    const uniqueItems = [...new Set(this.orderRecords.map(record => record.itemDescription))];

    const statusCounts = this.orderRecords.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const provinceCounts = this.orderRecords.reduce((acc, record) => {
      acc[record.province] = (acc[record.province] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalRecords,
      totalValue,
      totalQuantity,
      statusCounts,
      provinceCounts,
      provinceCount: uniqueProvinces.length,
      customerCount: uniqueCustomers.length,
      itemTypeCount: uniqueItems.length,
      provinces: uniqueProvinces.sort(),
      customers: uniqueCustomers.sort(),
      itemTypes: uniqueItems.sort()
    };
  }

  /**
   * Get unique values for filter dropdowns
   */
  getUniqueProvinces(): string[] {
    return [...new Set(this.orderRecords.map(record => record.province))].sort();
  }

  getUniqueCustomers(): string[] {
    return [...new Set(this.orderRecords.map(record => record.customerName))].sort();
  }

  getUniqueStatuses(): string[] {
    return [...new Set(this.orderRecords.map(record => record.status))].sort();
  }

  /**
   * Export order data for Excel/CSV
   */
  exportOrderData(): any[] {
    return this.orderRecords.map(record => ({
      'Order Number': record.orderNumber,
      'Order Date': record.orderDate,
      'Customer Name': record.customerName,
      'Province': record.province,
      'PO Number': record.poNumber,
      'Item Description': record.itemDescription,
      'Qty Back Order': record.qtyBackOrder,
      'Unit Price': record.unitPrice,
      'Total Value': record.totalValue,
      'Status': record.status
    }));
  }

  /**
   * Search orders with multiple criteria
   */
  searchOrders(criteria: {
    searchTerm?: string;
    province?: string;
    status?: string;
    customerName?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): OrderRecord[] {
    return this.orderRecords.filter(record => {
      // Search term filter
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        const matchesSearch =
          record.orderNumber.toLowerCase().includes(searchLower) ||
          record.customerName.toLowerCase().includes(searchLower) ||
          record.itemDescription.toLowerCase().includes(searchLower) ||
          record.poNumber.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Province filter
      if (criteria.province && criteria.province !== 'All') {
        if (record.province !== criteria.province) return false;
      }

      // Status filter
      if (criteria.status && criteria.status !== 'All') {
        if (record.status !== criteria.status) return false;
      }

      // Customer filter
      if (criteria.customerName && criteria.customerName !== 'All') {
        if (record.customerName !== criteria.customerName) return false;
      }

      // Date range filter
      if (criteria.dateFrom || criteria.dateTo) {
        const orderDate = new Date(record.orderDate);
        if (criteria.dateFrom && orderDate < criteria.dateFrom) return false;
        if (criteria.dateTo && orderDate > criteria.dateTo) return false;
      }

      return true;
    });
  }

  // Sales Record Methods

  /**
   * Get all sales records
   */
  getAllSalesRecords(): SalesRecord[] {
    return [...this.salesRecords];
  }

  /**
   * Get unique institutions for filtering
   */
  getUniqueInstitutions(): string[] {
    return [...new Set(this.salesRecords.map(record => record.institution))].sort();
  }

  /**
   * Get unique provinces for sales filtering
   */
  getUniqueSalesProvinces(): string[] {
    return [...new Set(this.salesRecords.map(record => record.province))].sort();
  }

  /**
   * Get unique sales statuses
   */
  getUniqueSalesStatuses(): string[] {
    return [...new Set(this.salesRecords.map(record => record.status))].sort();
  }

  /**
   * Get unique product types for filtering
   */
  getUniqueProductTypes(): string[] {
    return [...new Set(this.salesRecords.map(record => record.itemDescription))].sort();
  }

  /**
   * Search sales records with multiple criteria
   */
  searchSalesRecords(criteria: {
    searchTerm?: string;
    province?: string;
    status?: string;
    institution?: string;
    productType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): SalesRecord[] {
    return this.salesRecords.filter(record => {
      // Search term filter
      if (criteria.searchTerm) {
        const searchLower = criteria.searchTerm.toLowerCase();
        const matchesSearch =
          record.invoiceNumber.toLowerCase().includes(searchLower) ||
          record.institution.toLowerCase().includes(searchLower) ||
          record.itemDescription.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Province filter
      if (criteria.province && criteria.province !== 'All') {
        if (record.province !== criteria.province) return false;
      }

      // Status filter
      if (criteria.status && criteria.status !== 'All') {
        if (record.status !== criteria.status) return false;
      }

      // Institution filter
      if (criteria.institution && criteria.institution !== 'All') {
        if (record.institution !== criteria.institution) return false;
      }

      // Product type filter
      if (criteria.productType && criteria.productType !== 'All') {
        if (record.itemDescription !== criteria.productType) return false;
      }

      // Date range filter
      if (criteria.dateFrom || criteria.dateTo) {
        const salesDate = new Date(record.date);
        if (criteria.dateFrom && salesDate < criteria.dateFrom) return false;
        if (criteria.dateTo && salesDate > criteria.dateTo) return false;
      }

      return true;
    });
  }

  /**
   * Get sales analytics by province
   */
  getSalesByProvince(): { province: string; totalSales: number; quantity: number; count: number }[] {
    const provinceMap = new Map<string, { totalSales: number; quantity: number; count: number }>();

    this.salesRecords.forEach(record => {
      if (!provinceMap.has(record.province)) {
        provinceMap.set(record.province, { totalSales: 0, quantity: 0, count: 0 });
      }
      const current = provinceMap.get(record.province)!;
      current.totalSales += record.salesAmount;
      current.quantity += record.quantity;
      current.count += 1;
    });

    return Array.from(provinceMap.entries()).map(([province, data]) => ({
      province,
      ...data
    })).sort((a, b) => b.totalSales - a.totalSales);
  }

  /**
   * Get sales analytics by product type
   */
  getSalesByProduct(): { product: string; totalSales: number; quantity: number; count: number }[] {
    const productMap = new Map<string, { totalSales: number; quantity: number; count: number }>();

    this.salesRecords.forEach(record => {
      if (!productMap.has(record.itemDescription)) {
        productMap.set(record.itemDescription, { totalSales: 0, quantity: 0, count: 0 });
      }
      const current = productMap.get(record.itemDescription)!;
      current.totalSales += record.salesAmount;
      current.quantity += record.quantity;
      current.count += 1;
    });

    return Array.from(productMap.entries()).map(([product, data]) => ({
      product,
      ...data
    })).sort((a, b) => b.totalSales - a.totalSales);
  }

  /**
   * Get delivery status summary
   */
  getDeliveryStatusSummary(): { status: string; count: number; totalSales: number }[] {
    const statusMap = new Map<string, { count: number; totalSales: number }>();

    this.salesRecords.forEach(record => {
      if (!statusMap.has(record.status)) {
        statusMap.set(record.status, { count: 0, totalSales: 0 });
      }
      const current = statusMap.get(record.status)!;
      current.count += 1;
      current.totalSales += record.salesAmount;
    });

    return Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      ...data
    }));
  }

  /**
   * Export sales data for Excel/CSV
   */
  exportSalesData(): any[] {
    return this.salesRecords.map(record => ({
      'Institution': record.institution,
      'Province': record.province,
      'Item Description': record.itemDescription,
      'Date': record.date,
      'Invoice Number': record.invoiceNumber,
      'Quantity': record.quantity,
      'Sales Amount': record.salesAmount,
      'Status': record.status
    }));
  }

  /**
   * Get total sales amount
   */
  getTotalSalesAmount(): number {
    return this.salesRecords.reduce((total, record) => total + record.salesAmount, 0);
  }

  /**
   * Get total quantity sold
   */
  getTotalQuantitySold(): number {
    return this.salesRecords.reduce((total, record) => total + record.quantity, 0);
  }
}
