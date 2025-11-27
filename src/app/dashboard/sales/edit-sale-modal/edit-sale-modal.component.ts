import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatabaseService } from '../../../services/data/database.service';
import { Sale, SaleItem } from '../../../shared/interfaces/common.interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-sale-modal',
  templateUrl: './edit-sale-modal.component.html',
  styleUrls: ['./edit-sale-modal.component.scss']
})
export class EditSaleModalComponent implements OnChanges {
  @ViewChild('saleForm') saleForm!: NgForm;

  @Input() saleData: Sale | null = null;
  @Input() isVisible = false;
  @Output() modalClose = new EventEmitter<void>();
  @Output() saleUpdateSuccess = new EventEmitter<void>();

  isLoading = false;

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
    console.log('ngOnChanges triggered:', changes);
    if (changes['saleData']) {
      console.log('saleData changed:', {
        currentValue: changes['saleData'].currentValue,
        previousValue: changes['saleData'].previousValue
      });
      if (this.saleData) {
        // About to populate sale data
        this.populateSaleData();
      }
    }
    if (changes['isVisible']) {
      console.log('isVisible changed:', {
        currentValue: changes['isVisible'].currentValue,
        previousValue: changes['isVisible'].previousValue
      });
    }
  }

  populateSaleData(): void {
    // Populating sale data
    if (!this.saleData) {
      console.log('No saleData available, returning early');
      return;
    }

    // Calculate subtotal from saleItems
    const subtotal = this.saleData.saleItems ?
      this.saleData.saleItems.reduce((sum: number, item: SaleItem) => sum + (item.totalPrice || 0), 0) : 0;

    console.log('Calculated subtotal:', subtotal);

    this.sale = {
      id: this.saleData.id || 0,
      saleNumber: this.saleData.saleNumber || '',
      saleDate: this.formatDateForInput(this.saleData.saleDate),
      customerId: null, // Not available in Sale interface
      customerName: this.saleData.customerName || '',
      customerPhone: this.saleData.customerPhone || '',
      subtotal: subtotal,
      total: this.saleData.total || subtotal,
      notes: this.saleData.notes || '',
      provinceId: 1, // Default value as not available in Sale interface
      saleItems: this.saleData.saleItems || []
    };

    console.log('Final populated sale object:', this.sale);
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
      next: () => {
        // Sale updated successfully
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
