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
    // Mock data - replace with actual API call
    this.sales = [
      {
        id: 'SAL-001',
        customerName: 'John Doe',
        customerPhone: '0812345678',
        totalAmount: 1250,
        saleDate: new Date('2024-01-15'),
        paymentMethod: 'Cash',
        status: 'Completed',
        products: [
          { name: 'Blood Pressure Monitor', quantity: 1, price: 1200 },
          { name: 'Thermometer', quantity: 1, price: 50 }
        ]
      },
      {
        id: 'SAL-002',
        customerName: 'Jane Smith',
        customerPhone: '0823456789',
        totalAmount: 850,
        saleDate: new Date('2024-01-16'),
        paymentMethod: 'Credit Card',
        status: 'Pending',
        products: [
          { name: 'Glucose Test Strips', quantity: 5, price: 150 },
          { name: 'Lancets', quantity: 2, price: 100 }
        ]
      },
      {
        id: 'SAL-003',
        customerName: 'Mike Johnson',
        customerPhone: '0834567890',
        totalAmount: 2100,
        saleDate: new Date('2024-01-17'),
        paymentMethod: 'Bank Transfer',
        status: 'Completed',
        products: [
          { name: 'Pulse Oximeter', quantity: 3, price: 450 },
          { name: 'Stethoscope', quantity: 2, price: 800 }
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
