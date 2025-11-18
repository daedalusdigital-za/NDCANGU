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

  // Form data
  sale: any = {
    id: '',
    saleNumber: '',
    saleDate: '',
    hospital: '',
    province: '',
    invoiceNumber: '',
    totalAmount: 0,
    deliveryStatus: 0,
    saleItems: []
  };

  // Province options
  provinces = [
    'Gauteng',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Western Cape',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Free State',
    'Northern Cape'
  ];

  // Status options
  statusOptions = [
    { value: 0, label: 'Not delivered' },
    { value: 1, label: 'Processing' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' }
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
      id: this.saleData.id || '',
      saleNumber: this.saleData.saleNumber || this.saleData.orderNumber || '',
      saleDate: this.formatDateForInput(this.saleData.saleDate || this.saleData.orderDate),
      hospital: this.saleData.hospital || this.saleData.customerName || '',
      province: this.saleData.province || '',
      invoiceNumber: this.saleData.invoiceNumber || this.saleData.poNumber || '',
      totalAmount: this.saleData.totalAmount || this.saleData.totalValue || 0,
      deliveryStatus: this.parseDeliveryStatus(this.saleData.deliveryStatus || this.saleData.status),
      saleItems: this.saleData.saleItems || []
    };

    // If we have item details from the display format, add them to saleItems
    if (this.saleData.itemDescription && (!this.sale.saleItems || this.sale.saleItems.length === 0)) {
      this.sale.saleItems = [{
        productName: this.saleData.itemDescription,
        quantity: this.saleData.qtyBackOrder || this.saleData.quantity || 0,
        unitPrice: this.saleData.unitPrice || 0
      }];
    }
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }

    this.isLoading = true;

    // Prepare update payload
    // Note: Audit fields (updatedAt, updateByUserId) are handled automatically by backend
    const updatePayload = {
      id: this.sale.id,
      saleNumber: this.sale.saleNumber,
      saleDate: this.sale.saleDate,
      hospital: this.sale.hospital,
      province: this.sale.province,
      invoiceNumber: this.sale.invoiceNumber,
      totalAmount: parseFloat(this.sale.totalAmount),
      deliveryStatus: parseInt(this.sale.deliveryStatus),
      saleItems: this.sale.saleItems
    };

    console.log('Updating sale:', updatePayload);

    this.databaseService.updateSale(updatePayload as any).subscribe({
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
