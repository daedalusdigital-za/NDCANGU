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
    // Mock data - replace with actual API calls
    this.totalSales = 1250;
    this.monthlyRevenue = 75000;
    this.totalProducts = 45;
    this.averageOrderValue = 850;
    this.pendingOrders = 12;
    
    this.recentSales = [
      {
        id: 'SAL-001',
        customerName: 'John Doe',
        productName: 'Medical Equipment A',
        amount: 1200,
        date: new Date(),
        status: 'Completed'
      },
      {
        id: 'SAL-002',
        customerName: 'Jane Smith',
        productName: 'Healthcare Supplies B',
        amount: 850,
        date: new Date(),
        status: 'Pending'
      },
      {
        id: 'SAL-003',
        customerName: 'Mike Johnson',
        productName: 'Diagnostic Tool C',
        amount: 2100,
        date: new Date(),
        status: 'Completed'
      }
    ];
    
    this.topProducts = [
      {
        name: 'Blood Pressure Monitor',
        sales: 125,
        revenue: 25000,
        growth: '+12%'
      },
      {
        name: 'Glucose Test Strips',
        sales: 98,
        revenue: 15000,
        growth: '+8%'
      },
      {
        name: 'Thermometer Digital',
        sales: 87,
        revenue: 12000,
        growth: '+15%'
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
