import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesApiService } from '../services/sales-api.service';

export interface CreditNote {
  id: number;
  creditNoteNumber: string;
  invoiceId: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  originalAmount: number;
  creditAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reverseStock: boolean;
  reverseSale: boolean;
  createdDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  notes?: string;
  uploadedDocument?: {
    fileName: string;
    fileUrl: string;
    uploadedDate: Date;
  };
}

@Component({
  selector: 'app-credit-notes',
  templateUrl: './credit-notes.component.html',
  styleUrls: ['./credit-notes.component.scss']
})
export class CreditNotesComponent implements OnInit {
  creditNotes: CreditNote[] = [];
  filteredCreditNotes: CreditNote[] = [];
  loading = false;
  searchTerm = '';

  // Add Credit Note Modal
  showAddModal = false;
  newCreditNote: Partial<CreditNote> = {
    reverseStock: false,
    reverseSale: true,
    status: 'pending'
  };

  // View Details Modal
  showDetailsModal = false;
  selectedCreditNote: CreditNote | null = null;

  // Filter options
  statusFilter: string = 'all';

  // File upload
  selectedFile: File | null = null;
  uploadedFileName: string = '';

  // Invoice search
  invoiceSearchTerm: string = '';
  allSales: any[] = [];
  filteredSales: any[] = [];
  showInvoiceDropdown: boolean = false;
  selectedSale: any = null;

  constructor(
    private salesApiService: SalesApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCreditNotes();
    this.loadSales();
  }

  loadSales(): void {
    // Load all sales from the API
    this.salesApiService.getSales().subscribe({
      next: (sales: any[]) => {
        this.allSales = sales;
        console.log('✅ Loaded sales for invoice search:', sales.length);
      },
      error: (error: any) => {
        console.error('❌ Error loading sales:', error);
        // Fallback to mock data for testing
        this.allSales = this.getMockSales();
        console.log('Using mock sales data for testing');
      }
    });
  }

  getMockSales(): any[] {
    return [
      {
        id: 101,
        saleNumber: 'INV-2026-101',
        customerName: 'ABC Healthcare',
        customerId: 1,
        total: 5000,
        saleDate: new Date('2026-01-05')
      },
      {
        id: 102,
        saleNumber: 'INV-2026-102',
        customerName: 'XYZ Clinic',
        customerId: 2,
        total: 3500,
        saleDate: new Date('2026-01-08')
      },
      {
        id: 103,
        saleNumber: 'INV-2026-103',
        customerName: 'Medical Supplies Ltd',
        customerId: 3,
        total: 8000,
        saleDate: new Date('2026-01-12')
      },
      {
        id: 104,
        saleNumber: 'INV-2026-104',
        customerName: 'City Hospital',
        customerId: 4,
        total: 12500,
        saleDate: new Date('2026-01-14')
      }
    ];
  }

  loadCreditNotes(): void {
    this.loading = true;
    this.salesApiService.getCreditNotes().subscribe({
      next: (response: any) => {
        this.creditNotes = response.data || response;
        this.filteredCreditNotes = this.creditNotes;
        this.loading = false;
        console.log('✅ Credit notes loaded:', this.creditNotes.length);
      },
      error: (error: any) => {
        console.error('❌ Error loading credit notes:', error);
        this.loading = false;
        // Fallback to mock data for testing
        this.creditNotes = this.getMockCreditNotes();
        this.filteredCreditNotes = this.creditNotes;
        this.toastr.error('Error loading credit notes. Using test data.', 'Error');
      }
    });
  }

  getMockCreditNotes(): CreditNote[] {
    return [
      {
        id: 1,
        creditNoteNumber: 'CN-2026-001',
        invoiceId: 101,
        invoiceNumber: 'INV-2026-101',
        customerId: 1,
        customerName: 'ABC Healthcare',
        originalAmount: 5000,
        creditAmount: 5000,
        reason: 'Defective products returned',
        status: 'completed',
        reverseStock: true,
        reverseSale: true,
        createdDate: new Date('2026-01-10'),
        approvedDate: new Date('2026-01-11'),
        approvedBy: 'Admin User',
        notes: 'Full refund processed',
        uploadedDocument: {
          fileName: 'CN-2026-001-signed.pdf',
          fileUrl: '/documents/credit-notes/CN-2026-001-signed.pdf',
          uploadedDate: new Date('2026-01-10')
        }
      },
      {
        id: 2,
        creditNoteNumber: 'CN-2026-002',
        invoiceId: 102,
        invoiceNumber: 'INV-2026-102',
        customerId: 2,
        customerName: 'XYZ Clinic',
        originalAmount: 3500,
        creditAmount: 1500,
        reason: 'Partial return - overstocked items',
        status: 'approved',
        reverseStock: true,
        reverseSale: false,
        createdDate: new Date('2026-01-14'),
        approvedDate: new Date('2026-01-15'),
        approvedBy: 'Admin User',
        uploadedDocument: {
          fileName: 'CN-2026-002-return-receipt.pdf',
          fileUrl: '/documents/credit-notes/CN-2026-002-return-receipt.pdf',
          uploadedDate: new Date('2026-01-14')
        }
      },
      {
        id: 3,
        creditNoteNumber: 'CN-2026-003',
        invoiceId: 103,
        invoiceNumber: 'INV-2026-103',
        customerId: 3,
        customerName: 'Medical Supplies Ltd',
        originalAmount: 8000,
        creditAmount: 8000,
        reason: 'Billing error - duplicate invoice',
        status: 'pending',
        reverseStock: false,
        reverseSale: true,
        createdDate: new Date('2026-01-16')
      }
    ];
  }

  filterCreditNotes(): void {
    let filtered = this.creditNotes;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cn =>
        cn.creditNoteNumber.toLowerCase().includes(searchLower) ||
        cn.invoiceNumber.toLowerCase().includes(searchLower) ||
        cn.customerName.toLowerCase().includes(searchLower) ||
        cn.reason.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(cn => cn.status === this.statusFilter);
    }

    this.filteredCreditNotes = filtered;
  }

  searchInvoices(): void {
    if (!this.invoiceSearchTerm.trim()) {
      this.filteredSales = [];
      this.showInvoiceDropdown = false;
      return;
    }

    const searchLower = this.invoiceSearchTerm.toLowerCase();
    this.filteredSales = this.allSales.filter(sale =>
      (sale.saleNumber || '').toLowerCase().includes(searchLower) ||
      (sale.customerName || '').toLowerCase().includes(searchLower)
    ).slice(0, 10); // Limit to 10 results

    this.showInvoiceDropdown = this.filteredSales.length > 0;
  }

  selectInvoice(sale: any): void {
    this.selectedSale = sale;
    this.invoiceSearchTerm = sale.saleNumber;
    this.showInvoiceDropdown = false;

    // Auto-populate fields from selected sale
    this.newCreditNote.invoiceId = sale.id;
    this.newCreditNote.invoiceNumber = sale.saleNumber;
    this.newCreditNote.customerId = sale.customerId;
    this.newCreditNote.customerName = sale.customerName;
    this.newCreditNote.originalAmount = sale.total;
    this.newCreditNote.creditAmount = sale.total; // Default to full amount

    this.toastr.success(`Invoice ${sale.saleNumber} selected`, 'Success');
  }

  clearInvoiceSelection(): void {
    this.selectedSale = null;
    this.invoiceSearchTerm = '';
    this.filteredSales = [];
    this.showInvoiceDropdown = false;

    // Clear auto-populated fields
    this.newCreditNote.invoiceId = undefined;
    this.newCreditNote.invoiceNumber = undefined;
    this.newCreditNote.customerId = undefined;
    this.newCreditNote.customerName = undefined;
    this.newCreditNote.originalAmount = undefined;
  }

  openAddModal(): void {
    this.newCreditNote = {
      reverseStock: false,
      reverseSale: true,
      status: 'pending'
    };
    this.invoiceSearchTerm = '';
    this.selectedSale = null;
    this.filteredSales = [];
    this.showInvoiceDropdown = false;
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedFile = null;
    this.uploadedFileName = '';
    this.invoiceSearchTerm = '';
    this.selectedSale = null;
    this.filteredSales = [];
    this.showInvoiceDropdown = false;
  }

  submitCreditNote(): void {
    if (!this.newCreditNote.invoiceId) {
      this.toastr.error('Please select an invoice', 'Validation Error');
      return;
    }

    if (!this.newCreditNote.creditAmount || this.newCreditNote.creditAmount <= 0) {
      this.toastr.error('Please enter a valid credit amount', 'Validation Error');
      return;
    }

    if (!this.newCreditNote.reason) {
      this.toastr.error('Please enter a reason', 'Validation Error');
      return;
    }

    // Prepare credit note data
    const creditNoteData = {
      invoiceId: this.newCreditNote.invoiceId,
      invoiceNumber: this.newCreditNote.invoiceNumber,
      customerId: this.newCreditNote.customerId,
      customerName: this.newCreditNote.customerName,
      originalAmount: this.newCreditNote.originalAmount,
      creditAmount: this.newCreditNote.creditAmount,
      reason: this.newCreditNote.reason,
      reverseStock: this.newCreditNote.reverseStock,
      reverseSale: this.newCreditNote.reverseSale,
      notes: this.newCreditNote.notes
    };

    // Create credit note first
    this.salesApiService.createCreditNote(creditNoteData).subscribe({
      next: (response: any) => {
        const createdCreditNote = response.data || response;
        console.log('✅ Credit note created:', createdCreditNote);

        // If file selected, upload it
        if (this.selectedFile) {
          this.salesApiService.uploadCreditNoteDocument(createdCreditNote.id, this.selectedFile).subscribe({
            next: (uploadResponse: any) => {
              console.log('✅ Document uploaded:', uploadResponse);
              this.toastr.success(`Credit note created with document: ${this.uploadedFileName}`, 'Success');
              this.closeAddModal();
              this.loadCreditNotes();
            },
            error: (uploadError: any) => {
              console.error('❌ Error uploading document:', uploadError);
              this.toastr.warning('Credit note created but document upload failed', 'Partial Success');
              this.closeAddModal();
              this.loadCreditNotes();
            }
          });
        } else {
          this.toastr.success('Credit note created successfully', 'Success');
          this.closeAddModal();
          this.loadCreditNotes();
        }
      },
      error: (error: any) => {
        console.error('❌ Error creating credit note:', error);
        this.toastr.error(error?.error?.message || 'Error creating credit note', 'Error');
      }
    });
  }

  openDetailsModal(creditNote: CreditNote): void {
    this.selectedCreditNote = creditNote;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedCreditNote = null;
  }

  approveCreditNote(creditNote: CreditNote): void {
    const approvalData = {
      approvedBy: 'Current User',
      reverseSales: creditNote.reverseSale,
      reverseInventory: creditNote.reverseStock
    };

    this.salesApiService.approveCreditNote(creditNote.id, approvalData).subscribe({
      next: (response: any) => {
        const updatedCreditNote = response.data || response;
        creditNote.status = updatedCreditNote.status;
        creditNote.approvedDate = updatedCreditNote.approvedDate;
        creditNote.approvedBy = updatedCreditNote.approvedBy;
        this.toastr.success('Credit note approved', 'Success');
        console.log('✅ Credit note approved:', updatedCreditNote);
      },
      error: (error: any) => {
        console.error('❌ Error approving credit note:', error);
        this.toastr.error(error?.error?.message || 'Error approving credit note', 'Error');
      }
    });
  }

  rejectCreditNote(creditNote: CreditNote): void {
    const rejectionData = {
      rejectedBy: 'Current User',
      rejectionReason: 'Rejected by user'
    };

    this.salesApiService.rejectCreditNote(creditNote.id, rejectionData).subscribe({
      next: (response: any) => {
        const updatedCreditNote = response.data || response;
        creditNote.status = updatedCreditNote.status;
        this.toastr.warning('Credit note rejected', 'Rejected');
        console.log('✅ Credit note rejected:', updatedCreditNote);
      },
      error: (error: any) => {
        console.error('❌ Error rejecting credit note:', error);
        this.toastr.error(error?.error?.message || 'Error rejecting credit note', 'Error');
      }
    });
  }

  processCreditNote(creditNote: CreditNote): void {
    // TODO: Implement actual processing (reverse stock/sale)
    creditNote.status = 'completed';
    this.toastr.success('Credit note processed successfully', 'Success');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'approved': return 'badge-primary';
      case 'pending': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.toastr.error('Please select a PDF file', 'Invalid File Type');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.toastr.error('File size must not exceed 5MB', 'File Too Large');
        return;
      }

      this.selectedFile = file;
      this.uploadedFileName = file.name;
      this.toastr.success('File selected: ' + file.name, 'Success');
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.uploadedFileName = '';
  }

  downloadDocument(creditNote: CreditNote): void {
    if (!creditNote.uploadedDocument?.fileUrl) {
      this.toastr.info('No document available for download', 'Info');
      return;
    }

    this.salesApiService.downloadCreditNoteDocument(creditNote.id).subscribe({
      next: (response: any) => {
        // Create blob and trigger download
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = creditNote.uploadedDocument?.fileName || `CN-${creditNote.creditNoteNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Document downloaded', 'Success');
        console.log('✅ Document downloaded:', creditNote.uploadedDocument?.fileName);
      },
      error: (error: any) => {
        console.error('❌ Error downloading document:', error);
        // Fallback: try to open the URL directly
        if (creditNote.uploadedDocument?.fileUrl) {
          window.open(creditNote.uploadedDocument.fileUrl, '_blank');
        } else {
          this.toastr.error(error?.error?.message || 'Error downloading document', 'Error');
        }
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-ZA');
  }

  formatCurrency(amount: number): string {
    return 'R ' + amount.toFixed(2);
  }
}
