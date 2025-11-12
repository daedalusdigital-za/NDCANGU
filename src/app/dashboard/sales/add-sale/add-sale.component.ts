import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../services/data/database.service';

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
    saleNumber: '',
    saleDate: new Date().toISOString(),
    province: '',
    hospital: '',
    customerContactName: '',
    customerContactEmail: '',
    customerContactPhone: '',
    paymentMethod: 1, // Default to first payment method
    paymentStatus: 1, // Default to first payment status
    deliveryStatus: 1, // Default to first delivery status
    deliveryDate: '',
    notes: '',
    salesPerson: '',
    discount: 0,
    invoiceNumber: '',
    saleItems: [],
    totalAmount: 0
  };

  // Enum options based on schema (numeric values)
  paymentMethods = [
    { value: 1, label: 'Cash' },
    { value: 2, label: 'Card' },
    { value: 3, label: 'Bank Transfer' },
    { value: 4, label: 'Credit' },
    { value: 5, label: 'Cheque' }
  ];

  paymentStatusOptions = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Paid' },
    { value: 3, label: 'Overdue' },
    { value: 4, label: 'Cancelled' }
  ];

  deliveryStatusOptions = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'In Transit' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' }
  ];

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
  unitPrice: number = 0;
  isSubmitting = false;
  
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.generateSaleNumber();
  }

  generateSaleNumber(): void {
    // Generate a unique sale number
    const date = new Date();
    const timestamp = date.getTime();
    this.sale.saleNumber = `SALE-${timestamp.toString().slice(-8)}`;
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
    if (this.selectedProduct && this.quantity > 0 && this.unitPrice > 0) {
      if (this.quantity > this.selectedProduct.stock) {
        this.toastr.error('Quantity exceeds available stock', 'Error');
        return;
      }

      const existingItemIndex = this.sale.saleItems.findIndex((item: any) => item.productId === this.selectedProduct.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        this.sale.saleItems[existingItemIndex].quantity += this.quantity;
        this.sale.saleItems[existingItemIndex].unitPrice = this.unitPrice;
      } else {
        // Add new item according to schema
        this.sale.saleItems.push({
          id: 0, // Will be set by backend
          productId: this.selectedProduct.id,
          productName: this.selectedProduct.name,
          quantity: this.quantity,
          unitPrice: this.unitPrice
        });
      }

      this.calculateTotal();
      this.selectedProduct = null;
      this.quantity = 1;
      this.unitPrice = 0;
      this.toastr.success('Product added to sale', 'Success');
    }
  }

  removeProductFromSale(productId: number): void {
    this.sale.saleItems = this.sale.saleItems.filter((item: any) => item.productId !== productId);
    this.calculateTotal();
    this.toastr.info('Product removed from sale', 'Info');
  }

  calculateTotal(): void {
    this.sale.totalAmount = this.sale.saleItems.reduce((total: number, item: any) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    // Apply discount if any
    if (this.sale.discount > 0) {
      this.sale.totalAmount -= (this.sale.totalAmount * this.sale.discount / 100);
    }
  }

  onProductSelect(): void {
    if (this.selectedProduct) {
      this.unitPrice = this.selectedProduct.price;
    }
  }

  saveSale(): void {
    if (this.validateSale()) {
      this.isSubmitting = true;
      
      // Format the sale data according to the exact API schema
      const saleData = {
        saleNumber: this.sale.saleNumber,
        saleDate: this.formatDateForAPI(this.sale.saleDate),
        province: this.sale.province,
        hospital: this.sale.hospital,
        customerContactName: this.sale.customerContactName,
        customerContactEmail: this.sale.customerContactEmail || '',
        customerContactPhone: this.sale.customerContactPhone || '',
        paymentMethod: parseInt(this.sale.paymentMethod),
        paymentStatus: parseInt(this.sale.paymentStatus),
        deliveryStatus: parseInt(this.sale.deliveryStatus),
        deliveryDate: this.sale.deliveryDate ? this.formatDateForAPI(this.sale.deliveryDate) : '',
        notes: this.sale.notes || '',
        salesPerson: this.sale.salesPerson || '',
        discount: parseFloat(this.sale.discount) || 0,
        invoiceNumber: this.sale.invoiceNumber || '',
        saleItems: this.sale.saleItems.map((item: any) => ({
          id: 0, // Backend will assign
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      console.log('Sale data payload:', saleData);

      // Try to save using DatabaseService
      this.saveSaleToAPI(saleData);
    }
  }

  private saveSaleToAPI(saleData: any): void {
    // Use DatabaseService to save the sale
    this.databaseService.createSale(saleData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('Sale saved successfully:', response);
        this.toastr.success('Sale saved successfully!', 'Success');
        this.router.navigate(['/dashboard/sales/list']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving sale via API:', error);
        
        // Fallback: Save to local storage
        this.saveToLocalStorage(saleData);
        this.toastr.success('Sale saved locally (API unavailable)', 'Success');
        this.router.navigate(['/dashboard/sales/list']);
      }
    });
  }

  private saveToLocalStorage(saleData: any): void {
    try {
      const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
      const saleWithId = {
        ...saleData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      existingSales.push(saleWithId);
      localStorage.setItem('sales', JSON.stringify(existingSales));
      console.log('Sale saved to localStorage:', saleWithId);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      this.toastr.error('Failed to save sale', 'Error');
    }
  }

  // Helper method to format date for API (ISO format)
  private formatDateForAPI(dateValue: any): string {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return date.toISOString();
  }

  resetForm(): void {
    this.sale = {
      saleNumber: '',
      saleDate: new Date().toISOString(),
      province: '',
      hospital: '',
      customerContactName: '',
      customerContactEmail: '',
      customerContactPhone: '',
      paymentMethod: 1,
      paymentStatus: 1,
      deliveryStatus: 1,
      deliveryDate: '',
      notes: '',
      salesPerson: '',
      discount: 0,
      invoiceNumber: '',
      saleItems: [],
      totalAmount: 0
    };
    this.selectedProduct = null;
    this.quantity = 1;
    this.unitPrice = 0;
    this.filteredHospitals = [];
    this.generateSaleNumber();
  }

  private validateSale(): boolean {
    if (!this.sale.customerContactName.trim()) {
      this.toastr.error('Customer name is required', 'Validation Error');
      return false;
    }

    if (!this.sale.customerContactPhone.trim()) {
      this.toastr.error('Customer phone is required', 'Validation Error');
      return false;
    }

    if (!this.sale.province.trim()) {
      this.toastr.error('Province is required', 'Validation Error');
      return false;
    }

    if (this.sale.saleItems.length === 0) {
      this.toastr.error('At least one product must be added to the sale', 'Validation Error');
      return false;
    }

    return true;
  }
}
