import { Component, OnInit } from '@angular/core';

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
  
  // Top products
  topProducts: any[] = [];
  
  // Provincial data
  provincialData: any[] = [];
  
  // Sales chart data
  salesChartData: any = {};
  
  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
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
    
    this.recentSales = [
      {
        id: 'KZN-001',
        customerName: 'KZN Provincial Health Dept',
        productName: 'Glucose Test Strips',
        amount: 34500,
        date: new Date(2025, 7, 15),
        status: 'Completed',
        location: 'KwaZulu-Natal Province',
        deliveryRate: 89
      },
      {
        id: 'GT-002',
        customerName: 'Gauteng Provincial Health',
        productName: 'Glucose Meters',
        amount: 8344,
        date: new Date(2025, 7, 20),
        status: 'Pending',
        location: 'Gauteng Province',
        deliveryRate: 74
      },
      {
        id: 'FS-003',
        customerName: 'Free State Health Dept',
        productName: 'Glucose Test Strips',
        amount: 13018,
        date: new Date(2025, 8, 1),
        status: 'Completed',
        location: 'Free State Province',
        deliveryRate: 93
      },
      {
        id: 'LP-004',
        customerName: 'Limpopo Provincial Health',
        productName: 'Glucose Meters',
        amount: 2910,
        date: new Date(2025, 8, 10),
        status: 'In Progress',
        location: 'Limpopo Province',
        deliveryRate: 79
      },
      {
        id: 'MP-005',
        customerName: 'Mpumalanga Health Dept',
        productName: 'Glucose Test Strips',
        amount: 17920,
        date: new Date(2025, 8, 25),
        status: 'Delayed',
        location: 'Mpumalanga Province',
        deliveryRate: 64
      }
    ];
    
    this.topProducts = [
      {
        name: 'Glucose Test Strips',
        sales: 133547,
        revenue: 133547 * 150,
        growth: '+8%',
        ordered: 182465,
        delivered: 133547
      },
      {
        name: 'Glucose Meters',
        sales: 22917,
        revenue: 22917 * 800,
        growth: '+12%',
        ordered: 32063,
        delivered: 22917
      },
      {
        name: 'HB Test Strips',
        sales: 7499,
        revenue: 7499 * 180,
        growth: '+15%',
        ordered: 7499,
        delivered: 7499
      },
      {
        name: 'HB Meters',
        sales: 504,
        revenue: 504 * 1200,
        growth: '+22%',
        ordered: 504,
        delivered: 504
      },
      {
        name: 'HBA1C Strips',
        sales: 349,
        revenue: 349 * 200,
        growth: '+18%',
        ordered: 349,
        delivered: 349
      }
    ];
  }

  private calculateTotals(): void {
    let totalOrdered = 0;
    let totalDelivered = 0;
    
    this.provincialData.forEach(province => {
      province.data.forEach((item: any) => {
        totalOrdered += item.ordered;
        totalDelivered += item.delivered;
      });
    });
    
    this.totalSales = totalDelivered;
    this.pendingOrders = totalOrdered - totalDelivered;
    this.monthlyRevenue = totalDelivered * 180; // Average estimated price
    this.totalProducts = 7;
    this.averageOrderValue = this.monthlyRevenue / totalDelivered;
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
