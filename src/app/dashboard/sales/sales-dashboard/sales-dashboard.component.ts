import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/data/database.service';
import { Sale, SaleItem } from '../../../shared/interfaces/common.interfaces';
import { forkJoin } from 'rxjs';

interface TopProduct {
  name: string;
  inventoryItemId: number;
  totalQuantitySold: number;
  totalRevenue: number;
  numberOfSales: number;
  averagePrice: number;
}

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit {

  // Dashboard statistics
  totalSales: number = 0;
  monthlyRevenue: number = 0;
  totalProducts: number = 0;
  averageOrderValue: number = 0;
  pendingOrders: number = 0;

  // Recent sales data
  recentSales: any[] = [];

  // Top products - now from real API data
  topProducts: TopProduct[] = [];

  // Provincial data
  provincialData: any[] = [];

  // Sales chart data
  salesChartData: any = {};

  // Loading state
  isLoading: boolean = false;

  // All sales data from API
  private allSales: Sale[] = [];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRealSalesData();
  }

  /**
   * Load real sales data from API and calculate statistics
   */
  private loadRealSalesData(): void {
    this.isLoading = true;

    // Load both sales and inventory data
    forkJoin({
      sales: this.databaseService.getSales(),
      inventory: this.databaseService.getInventoryItems()
    }).subscribe({
      next: ({ sales, inventory }) => {
        console.log('✅ Loaded sales data:', sales.length, 'sales');
        console.log('✅ Loaded inventory data:', inventory.length, 'items');

        this.allSales = sales;

        // Calculate dashboard statistics
        this.calculateStatistics(sales);

        // Calculate top products from sales data with inventory names
        this.calculateTopProducts(sales, inventory);

        // Get recent sales
        this.loadRecentSales(sales);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading sales data:', error);
        // Fallback to hardcoded data
        this.loadDashboardData();
        this.isLoading = false;
      }
    });
  }

  /**
   * Calculate dashboard statistics from real sales data
   */
  private calculateStatistics(sales: Sale[]): void {
    if (!sales || sales.length === 0) {
      return;
    }

    // Total sales count
    this.totalSales = sales.length;

    // Total revenue
    this.monthlyRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    // Average order value
    this.averageOrderValue = this.totalSales > 0 ? this.monthlyRevenue / this.totalSales : 0;

    // Count unique products
    const uniqueProducts = new Set<number>();
    sales.forEach(sale => {
      if (sale.saleItems && Array.isArray(sale.saleItems)) {
        sale.saleItems.forEach(item => uniqueProducts.add(item.inventoryItemId));
      }
    });
    this.totalProducts = uniqueProducts.size;

    console.log('📊 Statistics calculated:', {
      totalSales: this.totalSales,
      monthlyRevenue: this.monthlyRevenue,
      averageOrderValue: this.averageOrderValue,
      totalProducts: this.totalProducts
    });
  }

  /**
   * Calculate top products based on actual sales data
   */
  private calculateTopProducts(sales: Sale[], inventory?: any[]): void {
    if (!sales || sales.length === 0) {
      console.warn('⚠️ No sales data to calculate top products');
      return;
    }

    // Create inventory lookup map for product names
    const inventoryMap = new Map<number, string>();
    if (inventory && Array.isArray(inventory)) {
      inventory.forEach(item => {
        if (item.id && item.name) {
          inventoryMap.set(item.id, item.name);
        }
      });
      console.log('📦 Inventory map created with', inventoryMap.size, 'items');
    }

    // Aggregate sales by product
    const productMap = new Map<number, {
      name: string;
      inventoryItemId: number;
      totalQuantity: number;
      totalRevenue: number;
      salesCount: number;
      totalPrice: number;
    }>();

    sales.forEach(sale => {
      if (!sale.saleItems || !Array.isArray(sale.saleItems)) {
        return;
      }

      sale.saleItems.forEach((item: SaleItem) => {
        const existing = productMap.get(item.inventoryItemId);

        // Get product name from inventory map first, fallback to saleItem name
        const productName = inventoryMap.get(item.inventoryItemId)
          || item.inventoryItemName
          || `Product ${item.inventoryItemId}`;

        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalRevenue += item.totalPrice;
          existing.salesCount += 1;
          existing.totalPrice += item.unitPrice;
          // Update name if we found a better one
          if (inventoryMap.has(item.inventoryItemId)) {
            existing.name = productName;
          }
        } else {
          productMap.set(item.inventoryItemId, {
            name: productName,
            inventoryItemId: item.inventoryItemId,
            totalQuantity: item.quantity,
            totalRevenue: item.totalPrice,
            salesCount: 1,
            totalPrice: item.unitPrice
          });
        }
      });
    });

    // Convert to array and sort by total revenue (highest first)
    const productsArray = Array.from(productMap.values());
    productsArray.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Take top 10 and format for display
    this.topProducts = productsArray.slice(0, 10).map(product => ({
      name: product.name,
      inventoryItemId: product.inventoryItemId,
      totalQuantitySold: product.totalQuantity,
      totalRevenue: product.totalRevenue,
      numberOfSales: product.salesCount,
      averagePrice: product.salesCount > 0 ? product.totalPrice / product.salesCount : 0
    }));

    console.log('🏆 Top Products calculated:', this.topProducts);
  }

  /**
   * Load recent sales from API data
   */
  private loadRecentSales(sales: Sale[]): void {
    if (!sales || sales.length === 0) {
      return;
    }

    // Sort by date (most recent first) and take top 25
    const sortedSales = [...sales].sort((a, b) => {
      const dateA = new Date(a.saleDate).getTime();
      const dateB = new Date(b.saleDate).getTime();
      return dateB - dateA;
    });

    this.recentSales = sortedSales.slice(0, 25).map(sale => ({
      id: sale.saleNumber,
      customerName: sale.customerName,
      productName: this.getMainProduct(sale),
      amount: sale.total,
      date: new Date(sale.saleDate),
      status: 'Completed',
      location: sale.provinceName || 'Unknown Province'
    }));

    console.log('📋 Recent sales loaded:', this.recentSales.length);
  }

  /**
   * Get the main product from a sale (highest value item)
   */
  private getMainProduct(sale: Sale): string {
    if (!sale.saleItems || sale.saleItems.length === 0) {
      return 'Mixed Products';
    }

    if (sale.saleItems.length === 1) {
      return sale.saleItems[0].inventoryItemName;
    }

    // Find item with highest total price
    const mainItem = sale.saleItems.reduce((max, item) =>
      item.totalPrice > max.totalPrice ? item : max
    );

    return `${mainItem.inventoryItemName} + ${sale.saleItems.length - 1} more`;
  }

  private loadDashboardData(): void {
    // Load comprehensive provincial data
    this.provincialData = [
      {
        province: 'KWA-ZULU NATAL',
        data: [
          { item: 'GLUCOSE METERS', ordered: 9718, delivered: 3864, comment: 'The Province took longer to finalize procurement as they were transitioning from the previous contract to ours. New ICN numbers had to be created, and institutions were still ordering from the previous supplier despite their contract ending, which caused confusion within the Province.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 51865, delivered: 34500, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 2, delivered: 2, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 90, delivered: 90, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 14, delivered: 14, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 185, delivered: 185, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'GAUTENG',
        data: [
          { item: 'GLUCOSE METERS', ordered: 15426, delivered: 8344, comment: 'The Province did not procure immediately after the contract was awarded, as they were awaiting the SLA. Once the SLA was received, they experienced challenges with loading the new SAP numbers. Which delayed the ordering process' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 108200, delivered: 46810, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 1520, delivered: 150, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 1610, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 502, delivered: 502, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 7054, delivered: 7054, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 50, delivered: 50, comment: '' },
          { item: 'HBA1C METERS', ordered: 1, delivered: 1, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 4, delivered: 4, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 1, delivered: 1, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'FREE STATE',
        data: [
          { item: 'GLUCOSE METERS', ordered: 32696, delivered: 13958, comment: 'The Province was enthusiastic about the contract; however, they faced challenges in creating new SAP numbers. In some cases, they resorted to capturing orders under the previous supplier\'s specifications in order to proceed with procurement.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 13958, delivered: 13018, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 20, delivered: 20, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 300, delivered: 300, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'LIMPOPO',
        data: [
          { item: 'GLUCOSE METERS', ordered: 9765, delivered: 2910, comment: 'We have successfully put a rollout plan in place with province. The province is performing well, and we are maintaining constant communication with them to ensure smooth implementation.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 71605, delivered: 20800, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'MPUMALANGA',
        data: [
          { item: 'GLUCOSE METERS', ordered: 2311, delivered: 911, comment: 'An order for glucose has been placed at the depot; however, stock is not yet available at the facilities as they are still utilizing the previous supplier. While the rollout is underway, progress has not been at a satisfactory pace as the province is still buying out of contract' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 27920, delivered: 17920, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 14, delivered: 14, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 55, delivered: 55, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 10, delivered: 10, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 10, delivered: 10, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'NORTHERN CAPE',
        data: [
          { item: 'GLUCOSE METERS', ordered: 100, delivered: 100, comment: 'This province has not fully participated on this contract, we are in the process of engaging the relevant stakeholders to start procuring.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 100, delivered: 100, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'EASTERN CAPE',
        data: [
          { item: 'GLUCOSE METERS', ordered: 399, delivered: 399, comment: 'There is an existing provincial contract in place, which restricts a significant portion of districts from participating in the NDOH35 Contract, despite their interest. Several districts have expressed interest in procuring HbA1c machines and strips, and we are currently in communication with the relevant provincial stakeholders. In addition, an organization, Doctors Without Borders, is exploring the possibility of procuring and donating HbA1c machines and strips to local clinics, recognizing the importance of conducting HbA1c testing.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 399, delivered: 399, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'NORTH WEST',
        data: [
          { item: 'GLUCOSE METERS', ordered: 0, delivered: 0, comment: 'This province has not fully participated on this contract, we are in the process of engaging the relevant stakeholders to start procuring.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      },
      {
        province: 'WESTERN CAPE',
        data: [
          { item: 'GLUCOSE METERS', ordered: 0, delivered: 0, comment: 'We were recently in communication with the province they have indicated that there has been communication sent out in the province regarding the contract. The province is currently in the process of procuring, they are finishing their donated stock from the previous supplier.' },
          { item: 'GLUCOSE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE SOLUTIONS', ordered: 0, delivered: 0, comment: '' },
          { item: 'GLUCOSE BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB CONTROL SOLUTION', ordered: 0, delivered: 0, comment: '' },
          { item: 'HB BATTERY', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'HBA1C TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'MULTI-FUNCTIONAL METERS', ordered: 0, delivered: 0, comment: '' },
          { item: 'URIC ACID TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'CHOLESTEROL TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'KETONE TEST STRIPS', ordered: 0, delivered: 0, comment: '' },
          { item: 'LACTATE TEST STRIPS', ordered: 0, delivered: 0, comment: '' }
        ]
      }
    ];

    // Calculate totals from provincial data
    this.calculateTotals();

    // Generate recent dates dynamically (last 30 days)
    const today = new Date();
    const daysAgo = (days: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      return date;
    };

    this.recentSales = [
      {
        id: 'KZN-001',
        customerName: 'KZN Provincial Health Dept',
        productName: 'Glucose Test Strips',
        amount: 34500,
        date: daysAgo(2), // 2 days ago
        status: 'Completed',
        location: 'KwaZulu-Natal Province',
        deliveryRate: 89
      },
      {
        id: 'GT-002',
        customerName: 'Gauteng Provincial Health',
        productName: 'Glucose Meters',
        amount: 8344,
        date: daysAgo(5), // 5 days ago
        status: 'Pending',
        location: 'Gauteng Province',
        deliveryRate: 74
      },
      {
        id: 'FS-003',
        customerName: 'Free State Health Dept',
        productName: 'Glucose Test Strips',
        amount: 13018,
        date: daysAgo(7), // 7 days ago
        status: 'Completed',
        location: 'Free State Province',
        deliveryRate: 93
      },
      {
        id: 'LP-004',
        customerName: 'Limpopo Provincial Health',
        productName: 'Glucose Meters',
        amount: 2910,
        date: daysAgo(12), // 12 days ago
        status: 'In Progress',
        location: 'Limpopo Province',
        deliveryRate: 79
      },
      {
        id: 'MP-005',
        customerName: 'Mpumalanga Health Dept',
        productName: 'Glucose Test Strips',
        amount: 17920,
        date: daysAgo(18), // 18 days ago
        status: 'Delayed',
        location: 'Mpumalanga Province',
        deliveryRate: 64
      }
    ];

    // Fallback top products - matching new TopProduct interface
    this.topProducts = [
      {
        name: 'Glucose Test Strips',
        inventoryItemId: 1,
        totalQuantitySold: 133547,
        totalRevenue: 133547 * 150,
        numberOfSales: 850,
        averagePrice: 150
      },
      {
        name: 'Glucose Meters',
        inventoryItemId: 2,
        totalQuantitySold: 22917,
        totalRevenue: 22917 * 800,
        numberOfSales: 420,
        averagePrice: 800
      },
      {
        name: 'HB Test Strips',
        inventoryItemId: 3,
        totalQuantitySold: 7499,
        totalRevenue: 7499 * 180,
        numberOfSales: 320,
        averagePrice: 180
      },
      {
        name: 'HB Meters',
        inventoryItemId: 4,
        totalQuantitySold: 504,
        totalRevenue: 504 * 1200,
        numberOfSales: 85,
        averagePrice: 1200
      },
      {
        name: 'HBA1C Strips',
        inventoryItemId: 5,
        totalQuantitySold: 349,
        totalRevenue: 349 * 200,
        numberOfSales: 45,
        averagePrice: 200
      }
    ];
  }

  private calculateTotals(): void {
    // This method is kept for backward compatibility with provincial data
    let totalOrdered = 0;
    let totalDelivered = 0;

    this.provincialData.forEach(province => {
      province.data.forEach((item: any) => {
        totalOrdered += item.ordered;
        totalDelivered += item.delivered;
      });
    });

    // Only update if no real sales data loaded
    if (this.totalSales === 0) {
      this.totalSales = totalDelivered;
      this.pendingOrders = totalOrdered - totalDelivered;
      this.monthlyRevenue = totalDelivered * 180; // Average estimated price
      this.totalProducts = 14;
      this.averageOrderValue = totalDelivered > 0 ? this.monthlyRevenue / totalDelivered : 0;
    }
  }

  getProvinceTotal(province: any, type: 'ordered' | 'delivered'): number {
    return province.data.reduce((sum: number, item: any) => sum + item[type], 0);
  }

  getProvinceDeliveryRate(province: any): number {
    const ordered = this.getProvinceTotal(province, 'ordered');
    const delivered = this.getProvinceTotal(province, 'delivered');
    return ordered > 0 ? Math.round((delivered / ordered) * 100) : 0;
  }

  getItemDeliveryRate(item: any): number {
    return item.ordered > 0 ? Math.round((item.delivered / item.ordered) * 100) : 0;
  }

  hasComments(province: any): boolean {
    return province.data.some((item: any) => item.comment && item.comment.trim() !== '');
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  navigateToSales(): void {
    // Navigation logic
  }

  navigateToProducts(): void {
    // Navigation logic
  }

  navigateToReports(): void {
    // Navigation logic
  }
}
