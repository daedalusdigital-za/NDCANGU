import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../../services/data/database.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-sale-modal',
  templateUrl: './edit-sale-modal.component.html',
  styleUrls: ['./edit-sale-modal.component.scss']
})
export class EditSaleModalComponent implements OnChanges {
  @ViewChild('saleForm') saleForm!: NgForm;

  @Input() saleData: any = null;
  @Input() isVisible: boolean = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() saleUpdateSuccess = new EventEmitter<void>();

  isLoading: boolean = false;

  // Form data - matches SaleModel structure
  sale: any = {
    id: 0,
    saleNumber: '',
    saleDate: '',
    customerId: null,
    customerName: '',
    customerPhone: '',
    subtotal: 0,
    total: 0,
    notes: '',
    provinceId: 1,
    saleItems: []
  };

  // Province options with IDs
  provinces = [
    { id: 1, name: 'Gauteng' },
    { id: 2, name: 'KwaZulu-Natal' },
    { id: 3, name: 'Eastern Cape' },
    { id: 4, name: 'Western Cape' },
    { id: 5, name: 'Limpopo' },
    { id: 6, name: 'Mpumalanga' },
    { id: 7, name: 'North West' },
    { id: 8, name: 'Free State' },
    { id: 9, name: 'Northern Cape' }
  ];

  constructor(
    private databaseService: DatabaseService,
    private toastr: ToastrService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saleData'] && this.saleData) {
      this.populateSaleData();
    }
  }

  populateSaleData(): void {
    if (!this.saleData) return;

    this.sale = {
      id: this.saleData.id || 0,
      saleNumber: this.saleData.saleNumber || '',
      saleDate: this.formatDateForInput(this.saleData.saleDate),
      customerId: this.saleData.customerId || null,
      customerName: this.saleData.customerName || '',
      customerPhone: this.saleData.customerPhone || '',
      subtotal: this.saleData.subtotal || 0,
      total: this.saleData.total || 0,
      notes: this.saleData.notes || '',
      provinceId: this.saleData.provinceId || 1,
      saleItems: this.saleData.saleItems || []
    };
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }

    this.isLoading = true;

    // Prepare SaleModel payload for API
    const saleModel = {
      id: this.sale.id,
      saleNumber: this.sale.saleNumber,
      saleDate: this.sale.saleDate,
      customerId: this.sale.customerId,
      customerName: this.sale.customerName,
      customerPhone: this.sale.customerPhone,
      subtotal: parseFloat(this.sale.subtotal),
      total: parseFloat(this.sale.total),
      notes: this.sale.notes,
      provinceId: parseInt(this.sale.provinceId),
      saleItems: this.sale.saleItems.map((item: any) => ({
        id: item.id,
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    console.log('Updating sale with SaleModel:', saleModel);

    this.databaseService.updateSale(saleModel).subscribe({
      next: (response) => {
        console.log('Sale updated successfully:', response);
        this.isLoading = false;
        this.toastr.success('Sale updated successfully!', 'Success');
        this.saleUpdateSuccess.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating sale:', error);
        this.isLoading = false;
        this.toastr.error('Failed to update sale. Please try again.', 'Error');
      }
    });
  }

  closeModal(): void {
    this.isVisible = false;
    this.modalClose.emit();
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';

    // If date is in YYYY/MM/DD format, convert to YYYY-MM-DD
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }

    // If date is ISO format, extract date part
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }

    return dateString;
  }

  private parseDeliveryStatus(status: any): number {
    if (typeof status === 'number') {
      return status;
    }

    // Convert string status to number
    const statusMap: { [key: string]: number } = {
      'Not delivered': 0,
      'Pending': 0,
      'Processing': 1,
      'Shipped': 2,
      'Delivered': 3,
      'Cancelled': 4
    };

    return statusMap[status] || 0;
  }
}
