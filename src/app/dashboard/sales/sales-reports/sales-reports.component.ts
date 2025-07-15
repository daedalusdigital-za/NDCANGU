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
      month: 'January 2024',
      revenue: 1250000,
      orders: 245,
      province: 'GP',
      topProduct: 'Surgical Masks',
      growth: 12.5
    },
    {
      month: 'February 2024',
      revenue: 1450000,
      orders: 289,
      province: 'WC',
      topProduct: 'Hand Sanitizer',
      growth: 15.2
    },
    {
      month: 'March 2024',
      revenue: 1380000,
      orders: 267,
      province: 'KZN',
      topProduct: 'PPE Kits',
      growth: 8.7
    }
  ];

  // Top performing hospitals
  topHospitals = [
    { name: 'Charlotte Maxeke Johannesburg Academic Hospital', province: 'GP', revenue: 450000 },
    { name: 'Groote Schuur Hospital', province: 'WC', revenue: 380000 },
    { name: 'Inkosi Albert Luthuli Central Hospital', province: 'KZN', revenue: 320000 },
    { name: 'Universitas Academic Hospital', province: 'FS', revenue: 290000 },
    { name: 'Steve Biko Academic Hospital', province: 'GP', revenue: 275000 }
  ];

  // Product categories performance
  productCategories = [
    { name: 'Medical Supplies', revenue: 2450000, percentage: 35 },
    { name: 'Pharmaceuticals', revenue: 2100000, percentage: 30 },
    { name: 'Surgical Equipment', revenue: 1750000, percentage: 25 },
    { name: 'Diagnostic Tools', revenue: 700000, percentage: 10 }
  ];

  selectedPeriod = 'monthly';
  selectedProvince = '';
  totalRevenue = 5250000;
  totalOrders = 1847;
  averageOrderValue = 2844;

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
