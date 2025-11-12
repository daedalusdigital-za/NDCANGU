import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss']
})
export class SalesReportsComponent implements OnInit {

  // South African Provinces
  provinces = [
    { code: 'GP', name: 'Gauteng' },
    { code: 'WC', name: 'Western Cape' },
    { code: 'KZN', name: 'KwaZulu-Natal' },
    { code: 'EC', name: 'Eastern Cape' },
    { code: 'FS', name: 'Free State' },
    { code: 'LP', name: 'Limpopo' },
    { code: 'MP', name: 'Mpumalanga' },
    { code: 'NC', name: 'Northern Cape' },
    { code: 'NW', name: 'North West' }
  ];

  // Report data with South African context
  salesData = [
    {
      month: 'September 2024',
      revenue: 1850000,
      orders: 325,
      province: 'GP',
      topProduct: 'Glucose Meters',
      growth: 18.5
    },
    {
      month: 'October 2024',
      revenue: 2150000,
      orders: 378,
      province: 'KZN',
      topProduct: 'HbA1c Test Strips',
      growth: 22.1
    },
    {
      month: 'November 2024',
      revenue: 1980000,
      orders: 348,
      province: 'MP',
      topProduct: 'Blood Pressure Monitors',
      growth: 15.8
    }
  ];

  // Top performing hospitals
  topHospitals = [
    { name: 'Chris Hani Baragwanath Academic Hospital', province: 'GP', revenue: 520000 },
    { name: 'Inkosi Albert Luthuli Central Hospital', province: 'KZN', revenue: 485000 },
    { name: 'Steve Biko Academic Hospital', province: 'GP', revenue: 445000 },
    { name: 'Universitas Academic Hospital', province: 'FS', revenue: 390000 },
    { name: 'Polokwane Provincial Hospital', province: 'LP', revenue: 365000 }
  ];

  // Product categories performance
  productCategories = [
    { name: 'Diabetes Care Equipment', revenue: 3200000, percentage: 40 },
    { name: 'Hypertension Monitoring', revenue: 2100000, percentage: 26 },
    { name: 'Laboratory Equipment', revenue: 1800000, percentage: 23 },
    { name: 'General Medical Supplies', revenue: 900000, percentage: 11 }
  ];

  selectedPeriod = 'monthly';
  selectedProvince = '';
  totalRevenue = 8000000;
  totalOrders = 2051;
  averageOrderValue = 3900;

  constructor() { }

  ngOnInit(): void {
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalRevenue = this.salesData.reduce((sum, data) => sum + data.revenue, 0);
    this.totalOrders = this.salesData.reduce((sum, data) => sum + data.orders, 0);
    this.averageOrderValue = this.totalRevenue / this.totalOrders;
  }

  onPeriodChange(): void {
    // Filter data based on selected period
    this.calculateTotals();
  }

  onProvinceChange(): void {
    // Filter data based on selected province
    this.calculateTotals();
  }

  exportReport(): void {
    // Export functionality
    console.log('Exporting sales report...');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  }

  getProvinceName(provinceCode: string): string {
    const province = this.provinces.find(p => p.code === provinceCode);
    return province ? province.name : provinceCode;
  }

}
