import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Province {
  name: string;
  code: string;
}

interface Hospital {
  name: string;
  code: string;
  province: string;
}

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent implements OnInit {

  sale: any = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    province: '',
    hospital: '',
    products: [],
    totalAmount: 0,
    totalQuantity: 0,
    saleDate: new Date(),
    status: 'Pending',
    notes: ''
  };

  provinces: Province[] = [
    { name: 'Gauteng', code: 'GP' },
    { name: 'Western Cape', code: 'WC' },
    { name: 'KwaZulu-Natal', code: 'KZN' },
    { name: 'Eastern Cape', code: 'EC' },
    { name: 'Free State', code: 'FS' },
    { name: 'Limpopo', code: 'LP' },
    { name: 'Mpumalanga', code: 'MP' },
    { name: 'North West', code: 'NW' },
    { name: 'Northern Cape', code: 'NC' }
  ];

  hospitals: Hospital[] = [
    // Gauteng
    { name: 'Chris Hani Baragwanath Hospital', code: 'CHBH', province: 'GP' },
    { name: 'Charlotte Maxeke Hospital', code: 'CMH', province: 'GP' },
    { name: 'Helen Joseph Hospital', code: 'HJH', province: 'GP' },
    { name: 'Rahima Moosa Mother & Child Hospital', code: 'RMMCH', province: 'GP' },
    // Western Cape
    { name: 'Groote Schuur Hospital', code: 'GSH', province: 'WC' },
    { name: 'Tygerberg Hospital', code: 'TH', province: 'WC' },
    { name: 'Red Cross War Memorial Children\'s Hospital', code: 'RCWMCH', province: 'WC' },
    // KwaZulu-Natal
    { name: 'Inkosi Albert Luthuli Hospital', code: 'IALH', province: 'KZN' },
    { name: 'King Edward VIII Hospital', code: 'KEVIII', province: 'KZN' },
    { name: 'Addington Hospital', code: 'AH', province: 'KZN' },
    // Eastern Cape
    { name: 'Livingstone Hospital', code: 'LH', province: 'EC' },
    { name: 'Cecilia Makiwane Hospital', code: 'CMH', province: 'EC' },
    { name: 'Frere Hospital', code: 'FH', province: 'EC' },
    // Free State
    { name: 'Universitas Academic Hospital', code: 'UAH', province: 'FS' },
    { name: 'Pelonomi Hospital', code: 'PH', province: 'FS' },
    // Limpopo
    { name: 'Pietersburg Hospital', code: 'PH', province: 'LP' },
    { name: 'Mankweng Hospital', code: 'MH', province: 'LP' },
    // Mpumalanga
    { name: 'Rob Ferreira Hospital', code: 'RFH', province: 'MP' },
    { name: 'Witbank Hospital', code: 'WH', province: 'MP' },
    // North West
    { name: 'Klerksdorp Hospital', code: 'KH', province: 'NW' },
    { name: 'Mafikeng Provincial Hospital', code: 'MPH', province: 'NW' },
    // Northern Cape
    { name: 'Kimberley Hospital', code: 'KH', province: 'NC' },
    { name: 'Upington Hospital', code: 'UH', province: 'NC' }
  ];

  products: any[] = [];
  filteredHospitals: Hospital[] = [];
  selectedProduct: any = null;
  quantity: number = 1;
  
  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // South African medical products with ZAR pricing
    this.products = [
      { id: 1, name: 'Blood Pressure Monitor (Digital)', price: 1200, stock: 25, category: 'Diagnostic' },
      { id: 2, name: 'Glucose Test Strips (Box of 50)', price: 280, stock: 100, category: 'Diabetes Care' },
      { id: 3, name: 'Digital Thermometer', price: 125, stock: 50, category: 'Basic Care' },
      { id: 4, name: 'Pulse Oximeter', price: 650, stock: 30, category: 'Diagnostic' },
      { id: 5, name: 'Stethoscope (Dual Head)', price: 950, stock: 15, category: 'Professional' },
      { id: 6, name: 'Insulin Pen Needles (100 pack)', price: 95, stock: 200, category: 'Diabetes Care' },
      { id: 7, name: 'Wound Care Kit', price: 185, stock: 40, category: 'Basic Care' },
      { id: 8, name: 'Nebulizer Machine', price: 1800, stock: 12, category: 'Respiratory' },
      { id: 9, name: 'Blood Glucose Meter', price: 450, stock: 35, category: 'Diabetes Care' },
      { id: 10, name: 'Compression Stockings', price: 320, stock: 60, category: 'Circulation' }
    ];
  }

  onProvinceChange(): void {
    this.filteredHospitals = this.hospitals.filter(hospital => 
      hospital.province === this.sale.province
    );
    this.sale.hospital = ''; // Reset hospital selection
  }

  addProductToSale(): void {
    if (this.selectedProduct && this.quantity > 0) {
      if (this.quantity > this.selectedProduct.stock) {
        this.toastr.error('Quantity exceeds available stock', 'Error');
        return;
      }

      const existingProduct = this.sale.products.find((p: any) => p.id === this.selectedProduct.id);
      
      if (existingProduct) {
        existingProduct.quantity += this.quantity;
        existingProduct.subtotal = existingProduct.quantity * existingProduct.price;
      } else {
        this.sale.products.push({
          id: this.selectedProduct.id,
          name: this.selectedProduct.name,
          price: this.selectedProduct.price,
          quantity: this.quantity,
          subtotal: this.selectedProduct.price * this.quantity
        });
      }

      this.calculateTotal();
      this.selectedProduct = null;
      this.quantity = 1;
      this.toastr.success('Product added to sale', 'Success');
    }
  }

  removeProductFromSale(productId: number): void {
    this.sale.products = this.sale.products.filter((p: any) => p.id !== productId);
    this.calculateTotal();
    this.toastr.info('Product removed from sale', 'Info');
  }

  calculateTotal(): void {
    this.sale.totalAmount = this.sale.products.reduce((total: number, product: any) => {
      return total + product.subtotal;
    }, 0);
    
    this.sale.totalQuantity = this.sale.products.reduce((total: number, product: any) => {
      return total + product.quantity;
    }, 0);
  }

  saveSale(): void {
    if (this.validateSale()) {
      // Here you would typically save to backend
      console.log('Saving sale:', this.sale);
      this.toastr.success('Sale saved successfully', 'Success');
      this.router.navigate(['/dashboard/sales/list']);
    }
  }

  resetForm(): void {
    this.sale = {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      province: '',
      hospital: '',
      products: [],
      totalAmount: 0,
      totalQuantity: 0,
      saleDate: new Date(),
      status: 'Pending',
      notes: ''
    };
    this.selectedProduct = null;
    this.quantity = 1;
    this.filteredHospitals = [];
  }

  private validateSale(): boolean {
    if (!this.sale.customerName.trim()) {
      this.toastr.error('Customer name is required', 'Validation Error');
      return false;
    }

    if (!this.sale.customerPhone.trim()) {
      this.toastr.error('Customer phone is required', 'Validation Error');
      return false;
    }

    if (!this.sale.province.trim()) {
      this.toastr.error('Province is required', 'Validation Error');
      return false;
    }

    if (this.sale.products.length === 0) {
      this.toastr.error('At least one product must be added to the sale', 'Validation Error');
      return false;
    }

    return true;
  }
}
