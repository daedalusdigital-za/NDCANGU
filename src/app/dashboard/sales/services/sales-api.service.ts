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
    SALES: '/Sales',
    SALE_BY_ID: '/Sales',
    INVENTORY: '/Inventory',
    ITEM_BY_ID: '/Inventory'
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
    return this.baseService.basePut(`${this.SALES_ENDPOINTS.ITEM_BY_ID}/${item.id}`, item);
  }

  /**
   * Delete inventory item
   */
  deleteInventoryItem(id: number): Observable<any> {
    return this.baseService.baseDelete(`${this.SALES_ENDPOINTS.ITEM_BY_ID}/${id}`);
  }
}
