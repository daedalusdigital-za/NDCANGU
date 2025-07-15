import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    products: [],
    totalAmount: 0,
    saleDate: new Date(),
    paymentMethod: 'Cash',
    status: 'Pending',
    notes: ''
  };

  products: any[] = [];
  selectedProduct: any = null;
  quantity: number = 1;
  paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Payment'];
  
  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Mock product data - replace with actual API call
    this.products = [
      { id: 1, name: 'Blood Pressure Monitor', price: 1200, stock: 25 },
      { id: 2, name: 'Glucose Test Strips', price: 150, stock: 100 },
      { id: 3, name: 'Digital Thermometer', price: 85, stock: 50 },
      { id: 4, name: 'Pulse Oximeter', price: 450, stock: 30 },
      { id: 5, name: 'Stethoscope', price: 800, stock: 15 }
    ];
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
  }

  saveSale(): void {
    if (this.validateSale()) {
      // Here you would typically save to backend
      console.log('Saving sale:', this.sale);
      this.toastr.success('Sale saved successfully', 'Success');
      this.router.navigate(['/dashboard/sales/list']);
    }
  }

  private validateSale(): boolean {
    if (!this.sale.customerName.trim()) {
      this.toastr.error('Customer name is required', 'Validation Error');
      return false;
    }

    if (this.sale.products.length === 0) {
      this.toastr.error('At least one product must be added to the sale', 'Validation Error');
      return false;
    }

    if (!this.sale.customerPhone.trim()) {
      this.toastr.error('Customer phone is required', 'Validation Error');
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.sale = {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      products: [],
      totalAmount: 0,
      saleDate: new Date(),
      paymentMethod: 'Cash',
      status: 'Pending',
      notes: ''
    };
    this.selectedProduct = null;
    this.quantity = 1;
  }
}
