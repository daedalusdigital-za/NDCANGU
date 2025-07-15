import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.scss']
})
export class ListSalesComponent implements OnInit {

  sales: any[] = [];
  filteredSales: any[] = [];
  
  // Filter properties
  searchTerm: string = '';
  selectedStatus: string = 'All';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  
  statusOptions = ['All', 'Pending', 'Completed', 'Cancelled'];
  
  constructor() { }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    // South African context - replace with actual API call
    this.sales = [
      {
        id: 'SAL-001',
        customerName: 'Thabo Mthembu',
        customerPhone: '+27721234567',
        customerEmail: 'thabo.mthembu@example.co.za',
        province: 'Gauteng',
        hospital: 'Chris Hani Baragwanath Hospital',
        totalAmount: 1450,
        totalQuantity: 3,
        saleDate: new Date('2024-01-15'),
        status: 'Completed',
        products: [
          { name: 'Blood Pressure Monitor', quantity: 1, price: 1200 },
          { name: 'Digital Thermometer', quantity: 2, price: 125 }
        ]
      },
      {
        id: 'SAL-002',
        customerName: 'Nomsa Dlamini',
        customerPhone: '+27831234568',
        customerEmail: 'nomsa.dlamini@example.co.za',
        province: 'Western Cape',
        hospital: 'Groote Schuur Hospital',
        totalAmount: 1240,
        totalQuantity: 6,
        saleDate: new Date('2024-01-16'),
        status: 'Pending',
        products: [
          { name: 'Glucose Test Strips', quantity: 3, price: 280 },
          { name: 'Blood Glucose Meter', quantity: 1, price: 450 },
          { name: 'Insulin Pen Needles', quantity: 2, price: 95 }
        ]
      },
      {
        id: 'SAL-003',
        customerName: 'Sipho Ndaba',
        customerPhone: '+27841234569',
        customerEmail: 'sipho.ndaba@example.co.za',
        province: 'KwaZulu-Natal',
        hospital: 'Inkosi Albert Luthuli Hospital',
        totalAmount: 2450,
        totalQuantity: 4,
        saleDate: new Date('2024-01-17'),
        status: 'Completed',
        products: [
          { name: 'Pulse Oximeter', quantity: 2, price: 650 },
          { name: 'Stethoscope', quantity: 1, price: 950 },
          { name: 'Wound Care Kit', quantity: 1, price: 185 }
        ]
      },
      {
        id: 'SAL-004',
        customerName: 'Zanele Khumalo',
        customerPhone: '+27721234570',
        customerEmail: 'zanele.khumalo@example.co.za',
        province: 'Eastern Cape',
        hospital: 'Livingstone Hospital',
        totalAmount: 1800,
        totalQuantity: 1,
        saleDate: new Date('2024-01-18'),
        status: 'Completed',
        products: [
          { name: 'Nebulizer Machine', quantity: 1, price: 1800 }
        ]
      },
      {
        id: 'SAL-005',
        customerName: 'Mandla Radebe',
        customerPhone: '+27831234571',
        customerEmail: 'mandla.radebe@example.co.za',
        province: 'Free State',
        hospital: 'Universitas Academic Hospital',
        totalAmount: 735,
        totalQuantity: 3,
        saleDate: new Date('2024-01-19'),
        status: 'Pending',
        products: [
          { name: 'Compression Stockings', quantity: 2, price: 320 },
          { name: 'Insulin Pen Needles', quantity: 1, price: 95 }
        ]
      }
    ];
    
    this.filteredSales = [...this.sales];
  }

  applyFilters(): void {
    this.filteredSales = this.sales.filter(sale => {
      const matchesSearch = sale.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           sale.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'All' || sale.status === this.selectedStatus;
      
      const matchesDateFrom = !this.dateFrom || new Date(sale.saleDate) >= this.dateFrom;
      const matchesDateTo = !this.dateTo || new Date(sale.saleDate) <= this.dateTo;
      
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'All';
    this.dateFrom = null;
    this.dateTo = null;
    this.filteredSales = [...this.sales];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  viewSaleDetails(sale: any): void {
    // Implementation for viewing sale details
    console.log('Viewing sale details:', sale);
  }

  editSale(sale: any): void {
    // Implementation for editing sale
    console.log('Editing sale:', sale);
  }

  deleteSale(sale: any): void {
    // Implementation for deleting sale
    if (confirm('Are you sure you want to delete this sale?')) {
      this.sales = this.sales.filter(s => s.id !== sale.id);
      this.applyFilters();
    }
  }

  exportToExcel(): void {
    // Implementation for Excel export
    console.log('Exporting to Excel...');
  }

  printSale(sale: any): void {
    // Implementation for printing sale
    console.log('Printing sale:', sale);
  }

  getTotalRevenue(): number {
    return this.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  }

  getCompletedSales(): number {
    return this.sales.filter(s => s.status === 'Completed').length;
  }

  getPendingSales(): number {
    return this.sales.filter(s => s.status === 'Pending').length;
  }
}
