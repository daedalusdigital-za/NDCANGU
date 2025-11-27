import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  InventoryItem,
  InventoryItemModel,
  InventoryStockUpdateModel,
  InventoryStats,
  InventoryCategory,
  InventoryStatus,
  ApiResponse
} from 'src/app/shared/interfaces/common.interfaces';
import { GlobalService } from 'src/app/services/global/global.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_URL = environment.apiBaseUrl;
  private readonly INVENTORY_ENDPOINT = 'Inventory';

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) {}

  /**
   * Get authentication headers for protected endpoints
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * GET /api/Inventory/GetAll
   * Get all inventory items (No auth required)
   */
  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<any[]>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/GetAll`)
      .pipe(
        map(response => {
          if (!Array.isArray(response)) {
            console.warn('Invalid inventory response format - expected array');
            return [];
          }
          return response.map(item => this.mapToInventoryItem(item)).filter((item): item is InventoryItem => item !== null);
        }),
        catchError(error => {
          console.error('Error fetching all inventory items:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * GET /api/Inventory/GetById?id={id}
   * Get item by ID (No auth required)
   */
  getItemById(id: number): Observable<InventoryItem> {
    return this.http.get<any>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/GetById?id=${id}`)
      .pipe(
        map(response => {
          const item = this.mapToInventoryItem(response);
          if (!item) {
            throw new Error(`Invalid inventory item data for ID ${id}`);
          }
          return item;
        }),
        catchError(error => {
          console.error(`Error fetching inventory item ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * GET /api/Inventory/GetByCategory?category={0-4}
   * Get items by category (Auth required)
   */
  getItemsByCategory(category: InventoryCategory): Observable<InventoryItem[]> {
    return this.http.get<any[]>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/GetByCategory?category=${category}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!Array.isArray(response)) {
          console.warn('Invalid category inventory response format - expected array');
          return [];
        }
        return response.map(item => this.mapToInventoryItem(item)).filter((item): item is InventoryItem => item !== null);
      }),
      catchError(error => {
        console.error(`Error fetching inventory by category ${category}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/Inventory/GetLowStock
   * Get low stock items (Auth required)
   */
  getLowStockItems(): Observable<InventoryItem[]> {
    return this.http.get<any[]>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/GetLowStock`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!Array.isArray(response)) {
          console.warn('Invalid low stock response format - expected array');
          return [];
        }
        return response.map(item => this.mapToInventoryItem(item)).filter((item): item is InventoryItem => item !== null);
      }),
      catchError(error => {
        console.error('Error fetching low stock items:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/Inventory/GetByStatus?status={0-2}
   * Get items by status (Auth required)
   */
  getItemsByStatus(status: InventoryStatus): Observable<InventoryItem[]> {
    return this.http.get<any[]>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/GetByStatus?status=${status}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!Array.isArray(response)) {
          console.warn('Invalid status inventory response format - expected array');
          return [];
        }
        return response.map(item => this.mapToInventoryItem(item)).filter((item): item is InventoryItem => item !== null);
      }),
      catchError(error => {
        console.error(`Error fetching inventory by status ${status}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * GET /api/Inventory/GetStats
   * Get inventory statistics (Auth required)
   */
  getInventoryStats(): Observable<InventoryStats> {
    return this.http.get<any>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/GetStats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        return {
          totalItems: response.totalItems || 0,
          totalValue: response.totalValue || 0,
          lowStockItems: response.lowStockItems || 0,
          activeItems: response.activeItems || 0,
          inactiveItems: response.inactiveItems || 0,
          discontinuedItems: response.discontinuedItems || 0,
          categories: {
            medicalSupplies: response.categories?.medicalSupplies || 0,
            consumables: response.categories?.consumables || 0,
            equipment: response.categories?.equipment || 0,
            pharmaceuticals: response.categories?.pharmaceuticals || 0,
            other: response.categories?.other || 0
          }
        } as InventoryStats;
      }),
      catchError(error => {
        console.error('Error fetching inventory stats:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * POST /api/Inventory/Add
   * Add new inventory item (Auth required)
   */
  addItem(item: InventoryItemModel): Observable<InventoryItem> {
    return this.http.post<any>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/Add`, item, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        const newItem = this.mapToInventoryItem(response);
        if (!newItem) {
          throw new Error('Invalid response when adding inventory item');
        }
        return newItem;
      }),
      catchError(error => {
        console.error('Error adding inventory item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PATCH /api/Inventory/Update
   * Update inventory item (Auth required)
   */
  updateItem(item: InventoryItemModel): Observable<InventoryItem> {
    if (!item.id) {
      return throwError(() => new Error('Item ID is required for update'));
    }

    return this.http.patch<any>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/Update`, item, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        const updatedItem = this.mapToInventoryItem(response);
        if (!updatedItem) {
          throw new Error('Invalid response when updating inventory item');
        }
        return updatedItem;
      }),
      catchError(error => {
        console.error('Error updating inventory item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * PATCH /api/Inventory/UpdateStock
   * Update stock only (Auth required)
   */
  updateStock(stockUpdate: InventoryStockUpdateModel): Observable<InventoryItem> {
    return this.http.patch<any>(`${this.API_URL}${this.INVENTORY_ENDPOINT}/UpdateStock`, stockUpdate, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        const updatedItem = this.mapToInventoryItem(response);
        if (!updatedItem) {
          throw new Error('Invalid response when updating stock');
        }
        return updatedItem;
      }),
      catchError(error => {
        console.error('Error updating stock:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * DELETE /api/Inventory/Delete?id={id}
   * Delete inventory item (Auth required)
   */
  deleteItem(id: number): Observable<boolean> {
    return this.http.delete(`${this.API_URL}${this.INVENTORY_ENDPOINT}/Delete?id=${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting inventory item ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Map API response to InventoryItem interface
   */
  private mapToInventoryItem(item: any): InventoryItem | null {
    try {
      return {
        id: item.id || 0,
        name: item.name || '',
        description: item.description || null,
        category: this.parseCategory(item.category),
        categoryText: item.categoryText || this.getCategoryText(item.category),
        sku: item.sku || '',
        unitOfMeasure: item.unitOfMeasure || '',
        unitPrice: parseFloat(item.unitPrice) || 0,
        stockAvailable: parseInt(item.stockAvailable) || 0,
        reorderLevel: parseInt(item.reorderLevel) || 0,
        minimumStockLevel: parseInt(item.minimumStockLevel || item.reorderLevel) || 0,
        supplier: item.supplier || null,
        supplierContact: item.supplierContact || null,
        expiryDate: item.expiryDate || null,
        batchNumber: item.batchNumber || null,
        status: this.parseStatus(item.status),
        statusText: item.statusText || this.getStatusText(item.status),
        notes: item.notes || null,
        createdDate: item.createdDate || new Date().toISOString(),
        lastUpdated: item.lastUpdated || null,
        createdByUserName: item.createdByUserName || ''
      };
    } catch (error) {
      console.error('Error mapping inventory item:', item, error);
      return null;
    }
  }

  /**
   * Parse category value to enum
   */
  private parseCategory(category: any): InventoryCategory {
    const cat = typeof category === 'string' ? parseInt(category) : category;
    return Object.values(InventoryCategory).includes(cat) ? cat : InventoryCategory.Other;
  }

  /**
   * Parse status value to enum
   */
  private parseStatus(status: any): InventoryStatus {
    const stat = typeof status === 'string' ? parseInt(status) : status;
    return Object.values(InventoryStatus).includes(stat) ? stat : InventoryStatus.Active;
  }

  /**
   * Get category display text
   */
  private getCategoryText(category: InventoryCategory): string {
    switch (category) {
      case InventoryCategory.MedicalSupplies: return 'Medical Supplies';
      case InventoryCategory.Consumables: return 'Consumables';
      case InventoryCategory.Equipment: return 'Equipment';
      case InventoryCategory.Pharmaceuticals: return 'Pharmaceuticals';
      case InventoryCategory.Other: return 'Other';
      default: return 'Unknown';
    }
  }

  /**
   * Get status display text
   */
  private getStatusText(status: InventoryStatus): string {
    switch (status) {
      case InventoryStatus.Active: return 'Active';
      case InventoryStatus.Inactive: return 'Inactive';
      case InventoryStatus.Discontinued: return 'Discontinued';
      default: return 'Unknown';
    }
  }

  /**
   * Utility method to get category options for forms
   */
  getCategoryOptions(): { label: string; value: InventoryCategory }[] {
    return [
      { label: 'Medical Supplies', value: InventoryCategory.MedicalSupplies },
      { label: 'Consumables', value: InventoryCategory.Consumables },
      { label: 'Equipment', value: InventoryCategory.Equipment },
      { label: 'Pharmaceuticals', value: InventoryCategory.Pharmaceuticals },
      { label: 'Other', value: InventoryCategory.Other }
    ];
  }

  /**
   * Utility method to get status options for forms
   */
  getStatusOptions(): { label: string; value: InventoryStatus }[] {
    return [
      { label: 'Active', value: InventoryStatus.Active },
      { label: 'Inactive', value: InventoryStatus.Inactive },
      { label: 'Discontinued', value: InventoryStatus.Discontinued }
    ];
  }
}
