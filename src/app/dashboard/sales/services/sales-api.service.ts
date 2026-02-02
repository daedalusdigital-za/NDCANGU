import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/api/base-api.service';

/**
 * Sales API Service
 *
 * Handles all sales-related API calls (orders, inventory, etc.).
 * Extracted from monolithic database.service.ts
 */
@Injectable({
  providedIn: 'root'
})
export class SalesApiService {
  private readonly SALES_ENDPOINTS = {
    SALES: '/Sales/GetAll',
    SALE_BY_ID: '/Sales',
    INVENTORY: '/Inventory',
    ITEM_BY_ID: '/Inventory'
  };

  private readonly CREDIT_NOTES_ENDPOINTS = {
    CREDIT_NOTES: '/CreditNotes',
    CREDIT_NOTE_BY_ID: '/CreditNotes',
    INVOICE_CREDIT_NOTES: '/CreditNotes/invoice'
  };

  constructor(private baseService: BaseService) { }

  /**
   * Get all sales orders
   */
  getSales(): Observable<any> {
    return this.baseService.baseGet(this.SALES_ENDPOINTS.SALES);
  }

  /**
   * Get sale by ID
   */
  getSaleById(id: number): Observable<any> {
    return this.baseService.baseGet(`${this.SALES_ENDPOINTS.SALE_BY_ID}/${id}`);
  }

  /**
   * Create new sale
   */
  createSale(sale: any): Observable<any> {
    return this.baseService.basePost(this.SALES_ENDPOINTS.SALES, sale);
  }

  /**
   * Update sale
   */
  updateSale(sale: any): Observable<any> {
    return this.baseService.basePatch(`${this.SALES_ENDPOINTS.SALE_BY_ID}/${sale.id}`, sale);
  }

  /**
   * Delete sale
   */
  deleteSale(id: number): Observable<any> {
    return this.baseService.baseDelete(`${this.SALES_ENDPOINTS.SALE_BY_ID}/${id}`);
  }

  /**
   * Get all inventory items
   */
  getInventory(): Observable<any> {
    return this.baseService.baseGet(this.SALES_ENDPOINTS.INVENTORY);
  }

  /**
   * Get inventory item by ID
   */
  getInventoryItemById(id: number): Observable<any> {
    return this.baseService.baseGet(`${this.SALES_ENDPOINTS.ITEM_BY_ID}/${id}`);
  }

  /**
   * Create inventory item
   */
  createInventoryItem(item: any): Observable<any> {
    return this.baseService.basePost(this.SALES_ENDPOINTS.INVENTORY, item);
  }

  /**
   * Update inventory item
   */
  updateInventoryItem(item: any): Observable<any> {
    return this.baseService.basePatch(`${this.SALES_ENDPOINTS.ITEM_BY_ID}/${item.id}`, item);
  }

  /**
   * Delete inventory item
   */
  deleteInventoryItem(id: number): Observable<any> {
    return this.baseService.baseDelete(`${this.SALES_ENDPOINTS.ITEM_BY_ID}/${id}`);
  }

  // ============================================
  // CREDIT NOTES ENDPOINTS (11 Total)
  // ============================================

  /**
   * Get all credit notes with optional filters
   */
  getCreditNotes(filters?: any): Observable<any> {
    let query = '';
    if (filters) {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      query = params.toString();
    }
    const url = query ? `${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTES}?${query}` : this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTES;
    return this.baseService.baseGet(url);
  }

  /**
   * Get credit note by ID
   */
  getCreditNoteById(id: number): Observable<any> {
    return this.baseService.baseGet(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}`);
  }

  /**
   * Create new credit note
   */
  createCreditNote(creditNote: any): Observable<any> {
    return this.baseService.basePost(this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTES, creditNote);
  }

  /**
   * Update credit note
   */
  updateCreditNote(id: number, creditNote: any): Observable<any> {
    return this.baseService.basePatch(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}`, creditNote);
  }

  /**
   * Delete credit note
   */
  deleteCreditNote(id: number): Observable<any> {
    return this.baseService.baseDelete(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}`);
  }

  /**
   * Get credit notes by invoice ID
   */
  getCreditNotesByInvoice(invoiceId: number): Observable<any> {
    return this.baseService.baseGet(`${this.CREDIT_NOTES_ENDPOINTS.INVOICE_CREDIT_NOTES}/${invoiceId}`);
  }

  /**
   * Approve credit note
   */
  approveCreditNote(id: number, data: any): Observable<any> {
    return this.baseService.basePost(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}/approve`, data);
  }

  /**
   * Reject credit note
   */
  rejectCreditNote(id: number, data: any): Observable<any> {
    return this.baseService.basePost(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}/reject`, data);
  }

  /**
   * Upload document for credit note
   */
  uploadCreditNoteDocument(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.baseService.basePost(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}/upload`, formData);
  }

  /**
   * Download document for credit note
   */
  downloadCreditNoteDocument(id: number): Observable<any> {
    return this.baseService.baseGet(`${this.CREDIT_NOTES_ENDPOINTS.CREDIT_NOTE_BY_ID}/${id}/download`);
  }
}
