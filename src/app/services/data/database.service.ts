import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, Sale, SaleModel, SaleItem, SaleItemModel } from '../../shared/interfaces/common.interfaces';

// Training Status Enum - Export for use in components
export enum TrainingStatus {
  Planned = 1,
  Scheduled = 2,
  InProgress = 3,
  Completed = 4,
  Cancelled = 5
}

// Sales interfaces imported from shared/interfaces/common.interfaces.ts

/**
 * NDCANGU Medical Management API - Database Service
 *
 * Comprehensive service for interacting with the NDCANGU API
 * Base URL: https://ngcanduapi.azurewebsites.net
 * Total Endpoints: 80+ endpoints across 11 controllers
 *
 * Controllers:
 * - Auth Controller (4 endpoints)
 * - Location Controller (6 endpoints)
 * - Trainer Controller (8 endpoints)
 * - Training Controller (8 endpoints)
 * - Inventory Controller (10 endpoints)
 * - Sales Controller (11 endpoints)
 * - Dashboard Controller (7 endpoints)
 * - User Management (25 endpoints)
 * - Medical System (30+ endpoints)
 *
 * Last Updated: October 7, 2025
 */

// =============================================
// ENTITY INTERFACES
// =============================================

interface Province {
  id: number;
  name: string;
  code: string;
  population?: number;
  healthFacilities?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface District {
  id: number;
  name: string;
  provinceId: number;
  createdAt?: string;
}

interface HealthFacility {
  id: number;
  name: string;
  code?: string;
  provinceId: number;
  districtId?: number;
  facilityType: string;
  level?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  status: string;
  capacity?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Trainer {
  // Primary Identifier
  id: number;

  // Personal Information (as per API)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Professional Details
  specialization: string;
  experience: number; // Years of experience
  certification: string;

  // Status
  isActive: boolean;
  isDeleted: boolean;

  // Audit Fields
  dateCreated: string; // ISO datetime
  lastUpdated?: string | null; // ISO datetime
  updatedBy?: number | null;
  modifiedBy?: number | null;

  // Computed/Optional Fields (for backward compatibility and display)
  name?: string; // Computed from firstName + lastName
  province?: string; // For display purposes
  provinceId?: number; // Province ID for lookups
  location?: string;
  status?: string; // Active/Inactive - derived from isActive
  qualification?: string;
  bio?: string;
}

// TrainingSession Interface - Aligned with 9 Required Fields Specification
interface TrainingSession {
  id?: number; // Optional for new records
  // Core Required Fields (9 fields)
  trainingName: string;           // Field 1: Name/title of the training session
  trainingType: string;           // Field 2: Type (e.g., "NDC Training workshop", "Virtual training")
  trainingDate: string;           // Field 3: DateTime - Combined date and time when training occurs (ISO string)
  provinceId: number;             // Field 4: Reference to Province where training takes place
  venue: string;                  // Field 5: Physical or virtual location of the training
  trainerId: number;              // Field 6: Reference to Trainer conducting the session
  targetAudience: string;         // Field 7: Intended audience description
  numberOfParticipants: number;   // Field 8: ⭐ NEW - Expected or actual number of attendees
  status: TrainingStatus;         // Field 9: Current status (Planned/Scheduled/InProgress/Completed/Cancelled)

  // Optional/Backward Compatibility Fields
  description?: string;           // Optional description
  objectives?: string;            // Optional training objectives
  materials?: string;             // Optional required materials
  province?: string;              // Display name for province (derived from provinceId)
  trainerName?: string;           // Display name for trainer (derived from trainerId)
  statusText?: string;            // Display text for status (derived from status enum)
  createdAt?: string;             // Creation timestamp
  updatedAt?: string;             // Last update timestamp
  createdBy?: string;             // User who created the session
}

interface InventoryItem {
  id: number;
  name: string;
  description?: string | null;
  category: number; // enum value
  categoryText: string; // enum name like "HemoglobinTesting"
  sku: string;
  unitOfMeasure: string;
  unitPrice: number; // decimal
  stockAvailable: number;
  reorderLevel: number;
  supplier?: string | null;
  expiryDate?: string | null; // datetime
  batchNumber?: string | null;
  status: number; // enum value
  statusText: string; // enum name like "InStock"
  createdDate: string; // datetime
  lastUpdated?: string | null; // datetime
  createdByUserName: string; // currently empty
}

// Using SaleModel from shared interfaces

// Using Sale from shared interfaces

// Using SaleItemModel from shared interfaces

// Using SaleItem from shared interfaces

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string[];
  createdAt?: string;
}

interface Patient {
  id: number;
  patientNumber: string;
  name: string;
  surname: string;
  gender: string;
  phoneNumber: string;
  age: number;
  gestational: boolean;
  dateOfBirth?: string;
  province?: string;
  district?: string;
  institution?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // API Base URL for production - Login endpoint working!
  private readonly API_URL = 'https://ngcanduapi.azurewebsites.net/api/';

  // Flag to force fallback data during API endpoint testing
  private readonly FORCE_FALLBACK_MODE = false;

  // Authentication token storage
  private authToken: string | null = null;

  constructor(private http: HttpClient) {
    this.loadAuthToken();
  }

  // =============================================
  // AUTHENTICATION CONTROLLER (4 endpoints)
  // =============================================

  /**
   * User login
   * POST /api/Auth/login
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.API_URL}Auth/login`, loginData)
      .pipe(
        map(response => {
          if (response.token) {
            this.authToken = response.token;

            // Store in both formats for compatibility
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userInfo', JSON.stringify(response));

            // Store in currentUser format used by the rest of the application
            const currentUser = {
              id: response.id?.toString() || '0',
              email: response.email || email,
              phoneNumber: '', // LoginResponse doesn't have phoneNumber field
              fullName: `${response.firstName || ''} ${response.lastName || ''}`.trim(),
              role: response.role || [],
              token: response.token
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }  /**
   * User registration
   * POST /api/Auth/register
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}Auth/register`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Reset user password
   * POST /api/Auth/reset-password
   */
  resetPassword(resetData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}Auth/reset-password`, resetData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Change user password
   * POST /api/Auth/change-password
   */
  changePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}Auth/change-password`, passwordData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * User logout
   */
  logout(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('currentUser');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    // Reload token in case it was updated by another service
    if (!this.authToken) {
      this.loadAuthToken();
    }
    return !!this.authToken;
  }

  /**
   * Refresh authentication token from localStorage
   */
  refreshAuthToken(): void {
    this.loadAuthToken();
  }

  /**
   * Get current user info
   */
  getCurrentUser(): any {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // =============================================
  // LOCATION CONTROLLER (6 endpoints)
  // =============================================

  /**
   * Get all provinces
   * Using fallback data for provinces
   */
  getProvinces(): Observable<Province[]> {
    return of(this.getFallbackProvinces());
  }

  /**
   * Get districts by province
   * Using fallback data for districts
   */
  getDistricts(): Observable<District[]> {
    return of(this.getFallbackDistricts());
  }

  /**
   * Get hospitals/health facilities
   * Using fallback data for hospitals
   */
  getHospitals(): Observable<HealthFacility[]> {
    return of(this.getFallbackHealthFacilities());
  }

  // getClinicsByProvince function removed - no longer needed

  // =============================================
  // TRAINER CONTROLLER (8 endpoints)
  // =============================================

  /**
   * Get all trainers
   * GET /api/Trainer/GetAll
   *
   * Returns: Array of trainer objects
   * - firstName, lastName, email, phone
   * - specialization, experience (years), certification
   * - isActive, isDeleted
   * - dateCreated, lastUpdated (ISO datetime), updatedBy, modifiedBy
   *
   * Maps API response to include computed 'name' field for UI compatibility
   * Handles null/missing data gracefully with proper defaults
   */
  getTrainers(): Observable<Trainer[]> {
    if (this.FORCE_FALLBACK_MODE) {
      return of(this.getFallbackTrainers());
    }

    return this.http.get<any[]>(`${this.API_URL}Trainer/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(
        map((trainers: any[]) => {
          if (!Array.isArray(trainers)) {
            console.warn('Invalid trainer response format - expected array');
            return this.getFallbackTrainers();
          }

          // Map API response to Trainer interface
          // Ensure 'name' field is always a string (computed from firstName + lastName for UI compatibility)
          return trainers.map((t: any) => {
            try {
              const name = `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Unknown Trainer';
              return {
                ...t,
                // Computed fields for UI compatibility - name is ALWAYS a string
                name: name as string,
                status: t.isActive === true ? 'Active' : 'Inactive',
                qualification: t.specialization || '',
                experience: Number(t.experience) || 0,
                // Province ID - default to 1 if not provided by API
                provinceId: t.provinceId || 1,
                // Ensure null fields are properly handled
                lastUpdated: t.lastUpdated || null,
                updatedBy: t.updatedBy || null,
                modifiedBy: t.modifiedBy || null
              } as Trainer;
            } catch (error) {
              console.error('Error mapping trainer data:', t, error);
              return null;
            }
          }).filter((t): t is Trainer => t !== null);
        }),
        catchError((error) => {
          console.warn('Trainer API error - falling back to local data:', {
            message: error?.error?.message || error?.message || 'Unknown error',
            status: error?.status,
            statusText: error?.statusText
          });
          return of(this.getFallbackTrainers());
        })
      );
  }

  /**
   * Get trainer by ID
   * GET /api/Trainer/GetById
   */
  getTrainerById(id: number): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.API_URL}Trainer/GetById?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainers().find(t => t.id === id)!))
      );
  }

  /**
   * Get trainers by province
   * GET /api/Trainer/GetByProvince
   */
  getTrainersByProvince(province: string): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.API_URL}Trainer/GetByProvince?province=${province}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainers().filter(t => t.province === province)))
      );
  }

  /**
   * Get trainers by status
   * GET /api/Trainer/GetByStatus
   */
  getTrainersByStatus(status: string): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.API_URL}Trainer/GetByStatus?status=${status}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainers().filter(t => t.status === status)))
      );
  }

  /**
   * Get trainer statistics
   * GET /api/Trainer/GetStats
   */
  getTrainerStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Trainer/GetStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new trainer
   * POST /api/Trainer/Add
   */
  createTrainer(trainer: Partial<Trainer>): Observable<Trainer> {
    return this.http.post<Trainer>(`${this.API_URL}Trainer/Add`, trainer, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update trainer
   * PATCH /api/Trainer/Update
   */
  updateTrainer(trainer: Partial<Trainer>): Observable<Trainer> {
    return this.http.patch<Trainer>(`${this.API_URL}Trainer/Update`, trainer, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete trainer
   * DELETE /api/Trainer/Delete
   */
  deleteTrainer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}Trainer/Delete?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // TRAINING CONTROLLER (8 endpoints)
  // =============================================

  /**
   * Get all training sessions
   * GET /api/Training/GetAll
   */
  getTrainingSessions(): Observable<TrainingSession[]> {
    if (this.FORCE_FALLBACK_MODE) {
      return of(this.getFallbackTrainingSessions());
    }

    return this.http.get<TrainingSession[]>(`${this.API_URL}Training/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainingSessions()))
      );
  }

  /**
   * Get training session by ID
   * GET /api/Training/GetById
   */
  getTrainingSessionById(id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.API_URL}Training/GetById?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainingSessions().find(t => t.id === id)!))
      );
  }

  /**
   * Get training sessions by trainer
   * GET /api/Training/GetByTrainer
   */
  getTrainingSessionsByTrainer(trainerId: number): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.API_URL}Training/GetByTrainer?trainerId=${trainerId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainingSessions().filter(t => t.trainerId === trainerId)))
      );
  }

  /**
   * Get training sessions by province
   * GET /api/Training/GetByProvince
   */
  getTrainingSessionsByProvince(province: string): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.API_URL}Training/GetByProvince?province=${province}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainingSessions().filter(t => t.province === province)))
      );
  }

  /**
   * Get training sessions by date range
   * GET /api/Training/GetByDateRange
   */
  getTrainingSessionsByDateRange(startDate: string, endDate: string): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.API_URL}Training/GetByDateRange?startDate=${startDate}&endDate=${endDate}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainingSessions().filter(t => t.trainingDate >= startDate && t.trainingDate <= endDate)))
      );
  }

  /**
   * Get training sessions by status
   * GET /api/Training/GetByStatus
   */
  getTrainingSessionsByStatus(status: number): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.API_URL}Training/GetByStatus?status=${status}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackTrainingSessions().filter(t => t.status === status)))
      );
  }

  /**
   * Get training statistics
   * GET /api/Training/GetStats
   */
  getTrainingStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Training/GetStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new training session
   * POST /api/Training/Add
   */
  createTrainingSession(trainingSession: Partial<TrainingSession>): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.API_URL}Training/Add`, trainingSession, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update training session
   * PATCH /api/Training/Update
   */
  updateTrainingSession(trainingSession: TrainingSession): Observable<TrainingSession> {
    return this.http.patch<TrainingSession>(`${this.API_URL}Training/Update`, trainingSession, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete training session
   * DELETE /api/Training/Delete
   */
  deleteTrainingSession(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}Training/Delete?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // INVENTORY CONTROLLER (10 endpoints)
  // =============================================

  /**
   * Get all inventory items
   * GET /api/Inventory/GetAll
   *
   * Returns: Array of inventory items with:
   * - id, name, description (nullable)
   * - category (number), categoryText (string), sku
   * - unitOfMeasure, unitPrice (decimal), stockAvailable
   * - reorderLevel, supplier (nullable), expiryDate (ISO datetime or null)
   * - batchNumber (nullable), status (number), statusText
   * - createdDate (ISO datetime), lastUpdated (ISO datetime or null)
   * - createdByUserName
   *
   * Includes proper error handling for null/missing data
   * ISO 8601 date format support with graceful fallbacks
   */
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<any[]>(`${this.API_URL}Inventory/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(
        map((items: any[]) => {
          if (!Array.isArray(items)) {
            console.warn('Invalid inventory response format - expected array');
            return [];
          }

          return items.map((item: any) => {
            try {
              return {
                ...item,
                // Ensure dates are properly formatted - handle ISO 8601 and null values
                createdDate: item.createdDate
                  ? new Date(item.createdDate).toISOString()
                  : new Date().toISOString(),
                lastUpdated: item.lastUpdated
                  ? new Date(item.lastUpdated).toISOString()
                  : null,
                expiryDate: item.expiryDate
                  ? new Date(item.expiryDate).toISOString()
                  : null,
                // Ensure numeric fields with defaults - handle null/missing/invalid values
                unitPrice: Number(item.unitPrice) || 0,
                stockAvailable: Number(item.stockAvailable) || 0,
                reorderLevel: Number(item.reorderLevel) || 0,
                // Ensure nullable fields remain nullable
                description: item.description || null,
                supplier: item.supplier || null,
                batchNumber: item.batchNumber || null,
                // Ensure category and status are properly handled
                category: Number(item.category) || 0,
                status: Number(item.status) || 0,
                categoryText: item.categoryText || 'Unknown',
                statusText: item.statusText || 'Unknown',
                createdByUserName: item.createdByUserName || 'System'
              } as InventoryItem;
            } catch (error) {
              console.error('Error mapping inventory item:', item, error);
              return null;
            }
          }).filter((item): item is InventoryItem => item !== null);
        }),
        catchError((error) => {
          console.error('Error fetching inventory items:', {
            message: error?.error?.message || error?.message || 'Unknown error',
            status: error?.status,
            statusText: error?.statusText
          });
          // Return empty array instead of throwing - allows graceful degradation
          return of([]);
        })
      );
  }

  /**
   * Get inventory item by ID
   * GET /api/Inventory/GetById
   */
  getInventoryItemById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.API_URL}Inventory/GetById?id=${id}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Get inventory items by category
   * GET /api/Inventory/GetByCategory
   */
  getInventoryItemsByCategory(category: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetByCategory?category=${category}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Get low stock items
   * GET /api/Inventory/GetLowStock
   */
  getLowStockItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetLowStock`, { headers: this.getAuthHeaders() });
  }

  /**
   * Get inventory items by status
   * GET /api/Inventory/GetByStatus
   */
  getInventoryItemsByStatus(status: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetByStatus?status=${status}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Get inventory statistics
   * GET /api/Inventory/GetStats
   */
  getInventoryStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Inventory/GetStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new inventory item
   * POST /api/Inventory/Add
   */
  createInventoryItem(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.API_URL}Inventory/Add`, item, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update inventory item
   * PATCH /api/Inventory/Update
   */
  updateInventoryItem(item: InventoryItem): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.API_URL}Inventory/Update`, item, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update inventory stock
   * PATCH /api/Inventory/UpdateStock
   */
  updateInventoryStock(id: number, quantity: number): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}Inventory/UpdateStock`, { id, quantity }, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete inventory item
   * DELETE /api/Inventory/Delete
   */
  deleteInventoryItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}Inventory/Delete?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // SALES CONTROLLER (11 endpoints)
  // =============================================

  /**
   * Add new sale
   * POST /api/Sales/Add
   */
  addSale(sale: SaleModel): Observable<Sale> {
    return this.http.post<Sale>(`${this.API_URL}Sales/Add`, sale, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all sales
   * GET /api/Sales/GetAll
   */
  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.API_URL}Sales/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackSales()))
      );
  }

  /**
   * Get sale by ID
   * GET /api/Sales/GetById
   */
  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.API_URL}Sales/GetById?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackSales().find(s => s.id === id)!))
      );
  }

  /**
   * Get sales by date range
   * GET /api/Sales/GetByDateRange
   */
  getSalesByDateRange(startDate: string, endDate: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.API_URL}Sales/GetByDateRange?startDate=${startDate}&endDate=${endDate}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackSales().filter(s => s.saleDate >= startDate && s.saleDate <= endDate)))
      );
  }

  /**
   * Get sales by province
   * Note: Province filtering removed in simplified structure
   * GET /api/Sales/GetByProvince
   */
  getSalesByProvince(provinceId: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.API_URL}Sales/GetByProvince?provinceId=${provinceId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackSales())) // Return all sales since we don't have province filtering
      );
  }

  /**
   * Get sales statistics
   * GET /api/Sales/GetStats
   */
  getSalesStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Sales/GetStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get provincial sales data
   * GET /api/Sales/GetProvincialData
   */
  getProvincialSalesData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Sales/GetProvincialData`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get top selling products
   * GET /api/Sales/GetTopProducts
   */
  getTopProducts(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Sales/GetTopProducts`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get recent sales
   * GET /api/Sales/GetRecentSales
   */
  getRecentSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.API_URL}Sales/GetRecentSales`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackSales().slice(0, 10)))
      );
  }

  /**
   * Get dashboard sales statistics
   * GET /api/Sales/GetDashboardStats
   */
  getSalesDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Sales/GetDashboardStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new sale
   * POST /api/Sales/Add
   */
  createSale(sale: SaleModel): Observable<Sale> {
    return this.http.post<Sale>(`${this.API_URL}Sales/Add`, sale, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update sale
   * PUT /api/Sales/Update
   */
  updateSale(sale: SaleModel): Observable<Sale> {
    // Ensure id is present for PUT operation
    if (!sale.id) {
      return throwError(() => new Error('Sale ID is required for update operation'));
    }
    return this.http.put<Sale>(`${this.API_URL}Sales/Update`, sale, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete sale
   * DELETE /api/Sales/Delete
   */
  deleteSale(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}Sales/Delete?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // DASHBOARD CONTROLLER (7 endpoints)
  // =============================================

  /**
   * Get training statistics
   * GET /api/Dashboard/GetTrainingStats
   */
  getDashboardTrainingStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetTrainingStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get province statistics
   * GET /api/Dashboard/GetProvinceStats
   */
  getDashboardProvinceStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetProvinceStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get national totals
   * GET /api/Dashboard/GetNationalTotals
   */
  getDashboardNationalTotals(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetNationalTotals`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get HGT meter distribution
   * GET /api/Dashboard/GetHGTMeterDistribution
   */
  getHGTMeterDistribution(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetHGTMeterDistribution`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get HGT strip distribution
   * GET /api/Dashboard/GetHGTStripDistribution
   */
  getHGTStripDistribution(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetHGTStripDistribution`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get equipment statistics
   * GET /api/Dashboard/GetEquipmentStats
   */
  getDashboardEquipmentStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetEquipmentStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get occupation statistics
   * GET /api/Dashboard/GetOccupationStats
   */
  getDashboardOccupationStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Dashboard/GetOccupationStats`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // USER MANAGEMENT CONTROLLERS (5 main endpoints)
  // =============================================

  /**
   * Get all users
   * GET /api/User/GetUsers
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}User/GetUsers`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get user by ID
   * GET /api/User/GetUserById
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}User/GetUserById?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new user
   * POST /api/User/Add
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}User/Add`, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update user
   * PATCH /api/User/UpdateUser
   */
  updateUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}User/UpdateUser`, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete user
   * DELETE /api/User/Delete
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}User/Delete?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // MEDICAL SYSTEM CONTROLLERS (5 main endpoints)
  // =============================================

  /**
   * Get all patients
   * GET /api/Patient/GetAll
   */
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.API_URL}Patient/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get patient by ID
   * GET /api/Patient/GetById
   */
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.API_URL}Patient/GetById?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create new patient
   * POST /api/Patient/Add
   */
  createPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(`${this.API_URL}Patient/Add`, patient, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update patient
   * PATCH /api/Patient/Update
   */
  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.patch<Patient>(`${this.API_URL}Patient/Update`, patient, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete patient
   * DELETE /api/Patient/Delete
   */
  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}Patient/Delete?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // =============================================
  // LEGACY COMPATIBILITY METHODS
  // =============================================

  // getProvincesWithFallback function removed - no longer needed

  /**
   * Get trainers with fallback (backward compatibility)
   */
  getTrainersWithFallback(): Observable<Trainer[]> {
    return this.getTrainers();
  }

  /**
   * Get training sessions with fallback (backward compatibility)
   */
  getTrainingSessionsWithFallback(): Observable<TrainingSession[]> {
    return this.getTrainingSessions();
  }

  // getHealthFacilities function removed - no longer needed

  // Province helper functions removed - no longer needed

  // District and institution helper functions removed - no longer needed

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Load authentication token from localStorage
   */
  private loadAuthToken(): void {
    // Use the same authentication storage as the rest of the application
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        this.authToken = user.token || null;
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
        this.authToken = null;
      }
    } else {
      // Fallback to the old authToken storage for backward compatibility
      this.authToken = localStorage.getItem('authToken');
    }
  }

  /**
   * Get HTTP headers with authentication
   */
  private getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.authToken) {
      return headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    return headers;
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('API Error:', error);

    if (error.status === 401) {
      // Unauthorized - token expired or invalid
      this.logout();
    }

    return throwError(() => error);
  };

  // =============================================
  // FALLBACK DATA METHODS
  // =============================================

  private getFallbackProvinces(): Province[] {
    return [
      { id: 1, name: 'Western Cape', code: 'WC', population: 6844272, healthFacilities: 312 },
      { id: 2, name: 'Eastern Cape', code: 'EC', population: 6712276, healthFacilities: 298 },
      { id: 3, name: 'Northern Cape', code: 'NC', population: 1292786, healthFacilities: 89 },
      { id: 4, name: 'Free State', code: 'FS', population: 2887465, healthFacilities: 156 },
      { id: 5, name: 'KwaZulu-Natal', code: 'KZN', population: 11289086, healthFacilities: 567 },
      { id: 6, name: 'North West', code: 'NW', population: 4072160, healthFacilities: 234 },
      { id: 7, name: 'Gauteng', code: 'GP', population: 15810388, healthFacilities: 445 },
      { id: 8, name: 'Mpumalanga', code: 'MP', population: 4679770, healthFacilities: 267 },
      { id: 9, name: 'Limpopo', code: 'LP', population: 5982584, healthFacilities: 378 }
    ];
  }

  private getFallbackDistricts(): District[] {
    return [
      { id: 1, name: 'Cape Town Metro', provinceId: 1 },
      { id: 2, name: 'Cape Winelands', provinceId: 1 },
      { id: 3, name: 'Overberg', provinceId: 1 },
      { id: 4, name: 'West Coast', provinceId: 1 },
      { id: 5, name: 'Garden Route', provinceId: 1 },
      { id: 6, name: 'Central Karoo', provinceId: 1 },
      { id: 7, name: 'Buffalo City Metro', provinceId: 2 },
      { id: 8, name: 'Nelson Mandela Bay Metro', provinceId: 2 },
      { id: 9, name: 'Alfred Nzo', provinceId: 2 },
      { id: 10, name: 'Amathole', provinceId: 2 }
    ];
  }

  private getFallbackHealthFacilities(): HealthFacility[] {
    return [
      {
        id: 1,
        name: 'Groote Schuur Hospital',
        code: 'GSH001',
        provinceId: 1,
        districtId: 1,
        facilityType: 'Hospital',
        level: 'Tertiary',
        address: 'Main Road, Observatory, Cape Town',
        contactNumber: '+27-21-404-9111',
        email: 'info@gsh.gov.za',
        status: 'Active',
        capacity: 950
      },
      {
        id: 2,
        name: 'Tygerberg Hospital',
        code: 'TBH001',
        provinceId: 1,
        districtId: 1,
        facilityType: 'Hospital',
        level: 'Tertiary',
        address: 'Francie van Zijl Drive, Tygerberg',
        contactNumber: '+27-21-938-4911',
        email: 'info@tygerberg.gov.za',
        status: 'Active',
        capacity: 1384
      },
      {
        id: 3,
        name: 'Chris Hani Baragwanath Hospital',
        code: 'CHB001',
        provinceId: 7,
        districtId: undefined,
        facilityType: 'Hospital',
        level: 'Tertiary',
        address: '26 Chris Hani Road, Diepkloof, Soweto',
        contactNumber: '+27-11-933-8000',
        email: 'info@chbah.org.za',
        status: 'Active',
        capacity: 3200
      },
      {
        id: 4,
        name: 'Charlotte Maxeke Johannesburg Academic Hospital',
        code: 'CMJAH001',
        provinceId: 7,
        districtId: undefined,
        facilityType: 'Hospital',
        level: 'Tertiary',
        address: '17 Jubilee Road, Parktown, Johannesburg',
        contactNumber: '+27-11-488-4911',
        email: 'info@cmjah.ac.za',
        status: 'Active',
        capacity: 1088
      },
      {
        id: 5,
        name: 'Inkosi Albert Luthuli Central Hospital',
        code: 'IALCH001',
        provinceId: 5,
        districtId: undefined,
        facilityType: 'Hospital',
        level: 'Tertiary',
        address: '800 Vusi Mzimela Road, Cato Manor, Durban',
        contactNumber: '+27-31-240-2111',
        email: 'info@ialch.co.za',
        status: 'Active',
        capacity: 846
      }
    ];
  }

  private getFallbackTrainers(): Trainer[] {
    return [
      {
        id: 1,
        firstName: 'DYLAN',
        lastName: 'GOVENDER',
        email: 'dylan.govender@promedtechnologies.co.za',
        phone: '+27-82-456-7890',
        specialization: 'Medical Trainer, NCD Specialist',
        experience: 8,
        certification: 'Medical Training Certification',
        isActive: true,
        isDeleted: false,
        dateCreated: new Date().toISOString(),
        lastUpdated: null,
        updatedBy: null,
        modifiedBy: null,
        // Computed fields for backward compatibility
        name: 'DYLAN GOVENDER',
        province: 'KwaZulu-Natal',
        location: 'Durban',
        status: 'Active',
        qualification: 'Medical Trainer, NCD Specialist',
        bio: 'Experienced medical trainer specializing in non-communicable disease management'
      },
      {
        id: 2,
        firstName: 'LINDANI',
        lastName: 'MKHIZE',
        email: 'lindani@promedtechnologies.co.za',
        phone: '+27-83-567-8901',
        specialization: 'Healthcare Educator, Diabetes Management',
        experience: 6,
        certification: 'Healthcare Education Certification',
        isActive: true,
        isDeleted: false,
        dateCreated: new Date().toISOString(),
        lastUpdated: null,
        updatedBy: null,
        modifiedBy: null,
        // Computed fields
        name: 'LINDANI MKHIZE',
        province: 'Gauteng',
        location: 'Johannesburg',
        status: 'Active',
        qualification: 'Healthcare Educator, Diabetes Management',
        bio: 'Healthcare educator with expertise in diabetes management'
      },
      {
        id: 3,
        firstName: 'MASIXOLE',
        lastName: 'NDABA',
        email: 'masixole@promedtechnologies.co.za',
        phone: '+27-84-678-9012',
        specialization: 'Clinical Trainer, Hypertension Specialist',
        experience: 10,
        certification: 'Clinical Training Certification',
        isActive: true,
        isDeleted: false,
        dateCreated: new Date().toISOString(),
        lastUpdated: null,
        updatedBy: null,
        modifiedBy: null,
        // Computed fields
        name: 'MASIXOLE NDABA',
        province: 'Eastern Cape',
        location: 'East London',
        status: 'Active',
        qualification: 'Clinical Trainer, Hypertension Specialist',
        bio: 'Clinical trainer specializing in hypertension management'
      },
      {
        id: 4,
        firstName: 'SELBY',
        lastName: 'NGUBANE',
        email: 'selby@promedtechnologies.co.za',
        phone: '+27-85-789-0123',
        specialization: 'Medical Education Specialist',
        experience: 12,
        certification: 'Medical Education Certification',
        isActive: true,
        isDeleted: false,
        dateCreated: new Date().toISOString(),
        lastUpdated: null,
        updatedBy: null,
        modifiedBy: null,
        // Computed fields
        name: 'SELBY NGUBANE',
        province: 'Western Cape',
        location: 'Cape Town',
        status: 'Active',
        qualification: 'Medical Education Specialist',
        bio: 'Medical education specialist with extensive experience'
      },
      {
        id: 5,
        firstName: 'ZIBA',
        lastName: 'MTHETHWA',
        email: 'ziba.mthethwa@promedtechnologies.co.za',
        phone: '+27-86-890-1234',
        specialization: 'Public Health Trainer, NCD Prevention',
        experience: 15,
        certification: 'Public Health Certification',
        isActive: true,
        isDeleted: false,
        dateCreated: new Date().toISOString(),
        lastUpdated: null,
        updatedBy: null,
        modifiedBy: null,
        // Computed fields
        name: 'ZIBA MTHETHWA',
        province: 'Limpopo',
        location: 'Polokwane',
        status: 'Active',
        qualification: 'Public Health Trainer, NCD Prevention',
        bio: 'Public health trainer focusing on NCD prevention'
      }
    ];
  }

  private getFallbackTrainingSessions(): TrainingSession[] {
    return [
      {
        id: 1,
        // 9 Required Fields
        trainingName: 'Diabetes Management Excellence Program',
        trainingType: 'Clinical Skills',
        trainingDate: '2025-01-15T09:00:00.000Z', // Combined date and time
        provinceId: 2, // KwaZulu-Natal
        venue: 'Medical Training Center - Inkosi Albert Luthuli Central Hospital',
        trainerId: 1,
        targetAudience: 'Nurses and junior doctors',
        numberOfParticipants: 42,
        status: TrainingStatus.Scheduled,

        // Optional/Display Fields
        description: 'Advanced training on diabetes care protocols and patient management',
        objectives: 'Improve diabetes care quality and patient outcomes',
        materials: 'Glucometers, testing strips, educational materials',
        province: 'KwaZulu-Natal',
        trainerName: 'DYLAN GOVENDER',
        statusText: 'Scheduled',
        createdAt: '2024-11-01T08:00:00.000Z',
        updatedAt: '2024-11-12T10:15:00.000Z',
        createdBy: 'Admin User'
      },
      {
        id: 2,
        // 9 Required Fields
        trainingName: 'Hypertension Care Masterclass',
        trainingType: 'Preventive Care',
        trainingDate: '2025-01-20T08:30:00.000Z', // Combined date and time
        provinceId: 1, // Gauteng
        venue: 'Medical Education Centre - Chris Hani Baragwanath Academic Hospital',
        trainerId: 2,
        targetAudience: 'Community health workers and nurses',
        numberOfParticipants: 55,
        status: TrainingStatus.Completed,

        // Optional/Display Fields
        description: 'Advanced training on blood pressure management and cardiovascular risk reduction',
        objectives: 'Standardize hypertension screening across facilities',
        materials: 'BP monitors, stethoscopes, training mannequins',
        province: 'Gauteng',
        trainerName: 'LINDANI',
        statusText: 'Completed',
        createdAt: '2024-10-15T09:00:00.000Z',
        updatedAt: '2024-11-10T17:30:00.000Z',
        createdBy: 'Training Coordinator'
      },
      {
        id: 3,
        // 9 Required Fields
        trainingName: 'NCD Management Innovation Summit',
        trainingType: 'Continuing Education',
        trainingDate: '2025-02-05T09:00:00.000Z', // Combined date and time
        provinceId: 2, // KwaZulu-Natal
        venue: 'Auditorium B - Inkosi Albert Luthuli Central Hospital',
        trainerId: 5,
        targetAudience: 'Senior clinical staff',
        numberOfParticipants: 38,
        status: TrainingStatus.Completed,

        // Optional/Display Fields
        description: 'Latest evidence-based approaches to non-communicable disease management',
        objectives: 'Update knowledge on latest NCD treatment protocols',
        materials: 'Clinical guidelines, case studies, assessment tools',
        province: 'KwaZulu-Natal',
        trainerName: 'ZIBA MTHETHWA',
        statusText: 'Completed',
        createdAt: '2024-09-10T11:20:00.000Z',
        updatedAt: '2024-10-26T17:00:00.000Z',
        createdBy: 'Head of Training'
      }
    ];
  }

  private getFallbackSales(): Sale[] {
    return [
      {
        id: 1,
        saleNumber: "SALE-2024-001",
        saleDate: "2024-01-15T00:00:00",
        customerId: 101,
        customerName: "Charlotte Maxeke Hospital",
        customerPhone: "+27 11 488 4911",
        subtotal: 4485.00,
        total: 4312.50,
        notes: "Monthly medical supplies order for diabetes clinic",
        provinceId: 1,
        provinceName: "Gauteng",
        dateCreated: "2025-10-07T04:34:25.8033333",
        lastUpdated: "2025-10-07T04:34:25.8033333",
        saleItems: [
          {
            id: 1,
            saleId: 1,
            inventoryItemId: 2,
            inventoryItemName: "Glucometer Test Strips",
            quantity: 20,
            unitPrice: 85.50,
            totalPrice: 1710.00
          },
          {
            id: 2,
            saleId: 1,
            inventoryItemId: 4,
            inventoryItemName: "Pulse Oximeter",
            quantity: 3,
            unitPrice: 425.00,
            totalPrice: 1275.00
          },
          {
            id: 3,
            saleId: 1,
            inventoryItemId: 6,
            inventoryItemName: "Digital Thermometer",
            quantity: 12,
            unitPrice: 125.00,
            totalPrice: 1500.00
          }
        ]
      },
      {
        id: 2,
        saleNumber: "SALE-2024-002",
        saleDate: "2024-01-20T00:00:00",
        customerId: 102,
        customerName: "Steve Biko Academic Hospital",
        customerPhone: "+27 12 354 1000",
        subtotal: 2352.00,
        total: 2361.00,
        notes: "Equipment order for new cardiac unit",
        provinceId: 2,
        provinceName: "Gauteng",
        dateCreated: "2025-10-07T04:34:25.8033333",
        lastUpdated: "2025-10-07T04:34:25.8033333",
        saleItems: [
          {
            id: 4,
            saleId: 2,
            inventoryItemId: 1,
            inventoryItemName: "Digital Blood Pressure Monitor",
            quantity: 1,
            unitPrice: 1250.00,
            totalPrice: 1250.00
          },
          {
            id: 5,
            saleId: 2,
            inventoryItemId: 3,
            inventoryItemName: "Stethoscope",
            quantity: 4,
            unitPrice: 275.50,
            totalPrice: 1102.00
          }
        ]
      },
      {
        id: 3,
        saleNumber: "IN157895",
        saleDate: "2024-02-05T00:00:00",
        customerId: 103,
        customerName: "Groote Schuur Hospital",
        customerPhone: "+27 21 404 9111",
        subtotal: 6930.00,
        total: 8750.00,
        notes: "Emergency department supply restocking",
        provinceId: 3,
        provinceName: "Western Cape",
        dateCreated: "2025-10-07T04:34:25.8033333",
        lastUpdated: "2025-10-07T04:34:25.8033333",
        saleItems: [
          {
            id: 6,
            saleId: 3,
            inventoryItemId: 5,
            inventoryItemName: "Nebulizer Device",
            quantity: 5,
            unitPrice: 350.00,
            totalPrice: 1750.00
          },
          {
            id: 7,
            saleId: 3,
            inventoryItemId: 7,
            inventoryItemName: "Wheelchair (Standard)",
            quantity: 2,
            unitPrice: 1850.00,
            totalPrice: 3700.00
          },
          {
            id: 8,
            saleId: 3,
            inventoryItemId: 8,
            inventoryItemName: "First Aid Kit (Comprehensive)",
            quantity: 8,
            unitPrice: 185.00,
            totalPrice: 1480.00
          }
        ]
      },
      {
        id: 4,
        saleNumber: "IN157934",
        saleDate: "2024-02-12T00:00:00",
        customerId: 104,
        customerName: "Red Cross War Memorial Children's Hospital",
        customerPhone: "+27 21 658 5111",
        subtotal: 3285.00,
        total: 3285.00,
        notes: "Pediatric ward medical supplies",
        provinceId: 3,
        provinceName: "Western Cape",
        dateCreated: "2025-10-07T04:34:25.8033333",
        lastUpdated: "2025-10-07T04:34:25.8033333",
        saleItems: [
          {
            id: 9,
            saleId: 4,
            inventoryItemId: 9,
            inventoryItemName: "Blood Glucose Meter",
            quantity: 6,
            unitPrice: 320.00,
            totalPrice: 1920.00
          },
          {
            id: 10,
            saleId: 4,
            inventoryItemId: 10,
            inventoryItemName: "Disposable Syringes (Pack of 100)",
            quantity: 15,
            unitPrice: 91.00,
            totalPrice: 1365.00
          }
        ]
      }
    ];
  }

  private getFallbackDistrictsByProvinceName(provinceName: string): string[] {
    const districts: { [key: string]: string[] } = {
      'Gauteng': ['Sedibeng', 'Ekurhuleni', 'City Of Johannesburg', 'City Of Tswane', 'West Rand'],
      'Limpopo': ['Capricorn', 'Mopani', 'Sekhukhune', 'Vhembe', 'Waterberge'],
      'North West': ['Bojanala Platinum', 'Dr kenneth kaunda', 'Dr Ruth Segomotsi Mompati', 'Ngaka Modlri Mclema'],
      'Eastern Cape': ['Alfred Nzo', 'Amathole', 'Buffalo', 'Chris Hani', 'Joe Gqabi', 'Nelson Mandela Bay Metropolitan'],
      'Western Cape': ['Cape Winelands', 'Central Karoo', 'City of CapeTown', 'Eden', 'Overberg', 'West Coast'],
      'KwaZulu-Natal': ['Amajuba', 'eThekwini', 'Harry Gwala', 'ilembe', 'King Cetshwayo', 'Ugu', 'uMgungundlovu', 'uMkhanyakude', 'uThukela', 'Zululand'],
      'Northern Cape': ['Fances Baard', 'John Taolo Gaetsewe', 'Namakwa', 'Pixley Ka Seme', 'ZF Mgcawa'],
      'Free State': ['Fezile Dabi', 'lejweeleputswa', 'Mangaung Thabo Mfoutsanyana', 'Xhaariep'],
      'Mpumalanga': ['EHLANZENI', 'GERT SIBANDE', 'NKANGALA']
    };
    return districts[provinceName] || [];
  }

  private getFallbackInstitutionsByProvinceName(provinceName: string): string[] {
    const institutions: { [key: string]: string[] } = {
      'Gauteng': [
        'Roodepoort West Princess Clinic', 'Lenmed Clinic', 'Randburg Clinic', 'Zandspruit Clinic',
        'West Rand', 'Siphumlile', 'Albertina Sisulu Clinic', 'Usizolwethu Clinic', 'Heidelberg Clinic',
        'Rensburg Clinic', 'Mpumelelo Clinic', 'Boitumelo Clinic', 'Khutsong East Clinic', 'Greenspark Clinic',
        'Randgate Clinic', 'Ya Rona Clinic', 'Thusanang Clinic', 'Venterspos Clinic', 'Ubuntu Clinic',
        'Doornpoort Satellite Clinic', 'Phahameng Clinic', 'Dilopye Clinic', 'Soshanguve Block Tt Clinic',
        'Skinner Street Clinic', 'Tsakane Clinic', 'Sead Clinic', 'Motsamai Clinic', 'Erin Clinic',
        'Dukathole Clinic', 'Boksburg North Clinic'
      ],
      'KwaZulu-Natal': [
        'HAILEY STOT CLINIC', 'KWANGCOLOSI CLINIC', 'KWANDENGEZI CLINIC', 'ZWELIBONVU CLINIC',
        'CLEMONT CLINIC', 'DANGANYA CLINIC', 'EZIMWINI CLINIC', 'KWAMAKHUTHA CLINIC'
      ],
      'Mpumalanga': [
        'Sihlangu Clinic', 'Zoeknog Clinic', 'Belfast Clinic', 'Hluvukani CHC', 'Edinburg Clinic',
        'Sabie Clinic', 'MAfrica CHC', 'Luphisi Clinic', 'Nkwalini Clinic', 'Msogwaba Clinic',
        'Vlakplass Clinic', 'Bettysgoet Clinic', 'Fernie Clinic 1', 'Morgenzon Clinic', 'Warbuton Clinic',
        'Driefontein CHC', 'Stanwest Clinic', 'KwaNgema CHC', 'Perdekop CHC', 'Wakkerstrom Clinic',
        'Hlalanikahle Clinic', 'Poly Clinic', 'Klarinet CHC', 'Rietspruit Clinic', 'Kriel Clinic',
        'Botleng Clinic', 'Delmas Clinic', 'Thubelihle CHC', 'Lynville Clinic', 'Beatty Clinic'
      ]
    };
    return institutions[provinceName] || [];
  }
}
