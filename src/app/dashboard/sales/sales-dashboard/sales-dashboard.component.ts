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
  
  // Sales chart data
  salesChartData: any = {};
  
  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // South African context - replace with actual API calls
    this.totalSales = 1250;
    this.monthlyRevenue = 125000; // ZAR
    this.totalProducts = 45;
    this.averageOrderValue = 890; // ZAR
    this.pendingOrders = 12;
    
    this.recentSales = [
      {
        id: 'SAL-001',
        customerName: 'Thabo Mthembu',
        productName: 'Blood Pressure Monitor',
        amount: 1200,
        date: new Date(),
        status: 'Completed',
        location: 'Chris Hani Baragwanath Hospital'
      },
      {
        id: 'SAL-002',
        customerName: 'Nomsa Dlamini',
        productName: 'Glucose Test Strips',
        amount: 850,
        date: new Date(),
        status: 'Pending',
        location: 'Groote Schuur Hospital'
      },
      {
        id: 'SAL-003',
        customerName: 'Sipho Ndaba',
        productName: 'Digital Thermometer',
        amount: 2100,
        date: new Date(),
        status: 'Completed',
        location: 'Inkosi Albert Luthuli Hospital'
      },
      {
        id: 'SAL-004',
        customerName: 'Zanele Khumalo',
        productName: 'Pulse Oximeter',
        amount: 650,
        date: new Date(),
        status: 'Completed',
        location: 'Tygerberg Hospital'
      },
      {
        id: 'SAL-005',
        customerName: 'Mandla Radebe',
        productName: 'Stethoscope',
        amount: 950,
        date: new Date(),
        status: 'Pending',
        location: 'Charlotte Maxeke Hospital'
      }
    ];
    
    this.topProducts = [
      {
        name: 'Blood Pressure Monitor',
        sales: 125,
        revenue: 150000, // ZAR
        growth: '+12%'
      },
      {
        name: 'Glucose Test Strips',
        sales: 98,
        revenue: 27440, // ZAR
        growth: '+8%'
      },
      {
        name: 'Digital Thermometer',
        sales: 87,
        revenue: 10875, // ZAR
        growth: '+15%'
      },
      {
        name: 'Pulse Oximeter',
        sales: 65,
        revenue: 42250, // ZAR
        growth: '+22%'
      },
      {
        name: 'Stethoscope',
        sales: 42,
        revenue: 39900, // ZAR
        growth: '+18%'
      }
    ];
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
