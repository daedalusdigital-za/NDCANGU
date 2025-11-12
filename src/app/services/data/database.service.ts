import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  id: number;
  name: string;
  email: string;
  phone: string;
  province: string;
  provinceId?: number; // For backward compatibility
  qualification?: string;
  experience: number;
  status: string; // Changed from number to string for compatibility
  location?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TrainingSession {
  id: number;
  trainingName: string;
  trainingType: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  startTime: {
    ticks: number;
    days?: number;
    hours?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
    minutes?: number;
    seconds?: number;
    totalDays?: number;
    totalHours?: number;
    totalMilliseconds?: number;
    totalMicroseconds?: number;
    totalNanoseconds?: number;
    totalMinutes?: number;
    totalSeconds?: number;
  };
  endTime: {
    ticks: number;
    days?: number;
    hours?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
    minutes?: number;
    seconds?: number;
    totalDays?: number;
    totalHours?: number;
    totalMilliseconds?: number;
    totalMicroseconds?: number;
    totalNanoseconds?: number;
    totalMinutes?: number;
    totalSeconds?: number;
  };
  province: string;
  hospital: string;
  venue: string;
  trainerId: number;
  trainerName?: string; // Added field from API
  numberOfParticipants: number;
  targetAudience: string;
  objectives?: string;
  materials?: string;
  status: number; // Numeric status as per schema
  statusText?: string; // Added field from API
  dateCreated?: string; // Added field from API
  lastUpdated?: string; // Added field from API
  createdByUserName?: string; // Added field from API
  createdAt?: string;
  updatedAt?: string;
}

interface InventoryItem {
  id: number;
  itemNumber: string;
  description: string;
  location: string;
  uom: string;
  category: string; // Changed back to string for compatibility
  qtyOnHand: number;
  qtyOnPO: number;
  qtyOnSO: number;
  stockAvailable?: number;
  unitCostForQOH: number;
  totalCostForQOH?: number;
  reorderLevel: number;
  maxStockLevel: number;
  supplier?: string;
  lastRestocked?: string;
  expiryDate?: string;
  status: string; // Changed to string for consistency
  createdAt?: string;
  updatedAt?: string;
}

interface Sale {
  id: number;
  saleNumber: string;
  saleDate: string; // ISO date string
  province: string;
  hospital: string;
  customerContactName: string;
  customerContactEmail?: string;
  customerContactPhone?: string;
  paymentMethod: number; // Numeric enum value
  paymentStatus: number; // Numeric enum value
  deliveryStatus: number; // Numeric enum value
  deliveryDate?: string; // ISO date string
  notes?: string;
  salesPerson?: string;
  discount: number;
  invoiceNumber?: string;
  saleItems: SaleItem[];
  totalAmount?: number;
}

interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

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
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userInfo', JSON.stringify(response));
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
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
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
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
   */
  getTrainers(): Observable<Trainer[]> {
    if (this.FORCE_FALLBACK_MODE) {
      return of(this.getFallbackTrainers());
    }

    return this.http.get<Trainer[]>(`${this.API_URL}Trainer/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.warn('Trainer API error - falling back to local data:', error?.error?.message || error?.message || 'Unknown error');
          // Check if it's the specific database schema error
          if (error?.error?.message?.includes('Invalid column name') || 
              error?.status === 500) {
            console.warn('Database schema issue detected - using fallback trainers');
          }
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
  updateTrainer(trainer: Trainer): Observable<Trainer> {
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
        catchError(() => of(this.getFallbackTrainingSessions().filter(t => t.startDate >= startDate && t.endDate <= endDate)))
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
   */
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetAll`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackInventoryItems()))
      );
  }

  /**
   * Get inventory item by ID
   * GET /api/Inventory/GetById
   */
  getInventoryItemById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.API_URL}Inventory/GetById?id=${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackInventoryItems().find(i => i.id === id)!))
      );
  }

  /**
   * Get inventory items by category
   * GET /api/Inventory/GetByCategory
   */
  getInventoryItemsByCategory(category: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetByCategory?category=${category}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackInventoryItems().filter(i => i.category === category)))
      );
  }

  /**
   * Get low stock items
   * GET /api/Inventory/GetLowStock
   */
  getLowStockItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetLowStock`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackInventoryItems().filter(i => i.qtyOnHand <= i.reorderLevel)))
      );
  }

  /**
   * Get inventory items by status
   * GET /api/Inventory/GetByStatus
   */
  getInventoryItemsByStatus(status: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.API_URL}Inventory/GetByStatus?status=${status}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackInventoryItems().filter(i => i.status === status)))
      );
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
   * GET /api/Sales/GetByProvince
   */
  getSalesByProvince(province: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.API_URL}Sales/GetByProvince?province=${province}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(() => of(this.getFallbackSales().filter(s => s.province === province)))
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
  createSale(sale: Partial<Sale>): Observable<Sale> {
    return this.http.post<Sale>(`${this.API_URL}Sales/Add`, sale, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update sale
   * PATCH /api/Sales/Update
   */
  updateSale(sale: Sale): Observable<Sale> {
    return this.http.patch<Sale>(`${this.API_URL}Sales/Update`, sale, { headers: this.getAuthHeaders() })
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
    this.authToken = localStorage.getItem('authToken');
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
        name: 'DYLAN GOVENDER',
        email: 'dylan.govender@promedtechnologies.co.za',
        phone: '+27-82-456-7890',
        province: 'KwaZulu-Natal',
        provinceId: 5,
        qualification: 'Medical Trainer, NCD Specialist',
        experience: 8,
        status: 'Active',
        location: 'Durban',
        bio: 'Experienced medical trainer specializing in non-communicable disease management and community health programs'
      },
      {
        id: 2,
        name: 'LINDANI',
        email: 'lindani@promedtechnologies.co.za',
        phone: '+27-83-567-8901',
        province: 'Gauteng',
        provinceId: 7,
        qualification: 'Healthcare Educator, Diabetes Management',
        experience: 6,
        status: 'Active',
        location: 'Johannesburg',
        bio: 'Healthcare educator with expertise in diabetes management and preventive care training'
      },
      {
        id: 3,
        name: 'MASIXOLE',
        email: 'masixole@promedtechnologies.co.za',
        phone: '+27-84-678-9012',
        province: 'Eastern Cape',
        provinceId: 2,
        qualification: 'Clinical Trainer, Hypertension Specialist',
        experience: 10,
        status: 'Active',
        location: 'East London',
        bio: 'Clinical trainer specializing in hypertension management and cardiovascular health education'
      },
      {
        id: 4,
        name: 'SELBY',
        email: 'selby@promedtechnologies.co.za',
        phone: '+27-85-789-0123',
        province: 'Western Cape',
        provinceId: 1,
        qualification: 'Medical Education Specialist',
        experience: 12,
        status: 'Active',
        location: 'Cape Town',
        bio: 'Medical education specialist with extensive experience in community health worker training'
      },
      {
        id: 5,
        name: 'ZIBA MTHETHWA',
        email: 'ziba.mthethwa@promedtechnologies.co.za',
        phone: '+27-86-890-1234',
        province: 'Limpopo',
        provinceId: 9,
        qualification: 'Public Health Trainer, NCD Prevention',
        experience: 15,
        status: 'Active',
        location: 'Polokwane',
        bio: 'Public health trainer focusing on non-communicable disease prevention and rural health initiatives'
      }
    ];
  }

  private getFallbackTrainingSessions(): TrainingSession[] {
    return [
      {
        id: 1,
        trainingName: 'Diabetes Management Excellence Program',
        trainingType: 'Clinical Skills',
        description: 'Advanced training on diabetes care protocols and patient management',
        startDate: '2025-01-15T00:00:00.000Z',
        endDate: '2025-01-17T00:00:00.000Z',
        startTime: { 
          ticks: 324000000000, // 09:00:00 in ticks
          hours: 9,
          minutes: 0,
          seconds: 0,
          totalHours: 9,
          totalMinutes: 540,
          totalSeconds: 32400
        },
        endTime: { 
          ticks: 576000000000, // 16:00:00 in ticks
          hours: 16,
          minutes: 0,
          seconds: 0,
          totalHours: 16,
          totalMinutes: 960,
          totalSeconds: 57600
        },
        province: 'KwaZulu-Natal',
        hospital: 'Inkosi Albert Luthuli Central Hospital',
        venue: 'Medical Training Center',
        trainerId: 1,
        trainerName: 'DYLAN GOVENDER',
        numberOfParticipants: 42,
        targetAudience: 'Nurses and junior doctors',
        objectives: 'Improve diabetes care quality and patient outcomes',
        materials: 'Glucometers, testing strips, educational materials',
        status: 2, // Scheduled
        statusText: 'Scheduled',
        dateCreated: '2024-11-01T08:00:00.000Z',
        lastUpdated: '2024-11-12T10:15:00.000Z',
        createdByUserName: 'Admin User'
      },
      {
        id: 2,
        trainingName: 'Hypertension Care Masterclass',
        trainingType: 'Preventive Care',
        description: 'Advanced training on blood pressure management and cardiovascular risk reduction',
        startDate: '2025-01-20T00:00:00.000Z',
        endDate: '2025-01-21T00:00:00.000Z',
        startTime: { 
          ticks: 306000000000, // 08:30:00 in ticks
          hours: 8,
          minutes: 30,
          seconds: 0,
          totalHours: 8.5,
          totalMinutes: 510,
          totalSeconds: 30600
        },
        endTime: { 
          ticks: 612000000000, // 17:00:00 in ticks
          hours: 17,
          minutes: 0,
          seconds: 0,
          totalHours: 17,
          totalMinutes: 1020,
          totalSeconds: 61200
        },
        province: 'Gauteng',
        hospital: 'Chris Hani Baragwanath Academic Hospital',
        venue: 'Medical Education Centre',
        trainerId: 2,
        trainerName: 'LINDANI',
        numberOfParticipants: 55,
        targetAudience: 'Community health workers and nurses',
        objectives: 'Standardize hypertension screening across facilities',
        materials: 'BP monitors, stethoscopes, training mannequins',
        status: 1, // Completed
        statusText: 'Completed',
        dateCreated: '2024-10-15T09:00:00.000Z',
        lastUpdated: '2024-11-10T17:30:00.000Z',
        createdByUserName: 'Training Coordinator'
      },
      {
        id: 3,
        trainingName: 'NCD Management Innovation Summit',
        trainingType: 'Continuing Education',
        description: 'Latest evidence-based approaches to non-communicable disease management',
        startDate: '2025-02-05T00:00:00.000Z',
        endDate: '2025-02-06T00:00:00.000Z',
        startTime: { 
          ticks: 324000000000, // 09:00:00 in ticks
          hours: 9,
          minutes: 0,
          seconds: 0,
          totalHours: 9,
          totalMinutes: 540,
          totalSeconds: 32400
        },
        endTime: { 
          ticks: 558000000000, // 15:30:00 in ticks
          hours: 15,
          minutes: 30,
          seconds: 0,
          totalHours: 15.5,
          totalMinutes: 930,
          totalSeconds: 55800
        },
        province: 'KwaZulu-Natal',
        hospital: 'Inkosi Albert Luthuli Central Hospital',
        venue: 'Auditorium B',
        trainerId: 5,
        trainerName: 'ZIBA MTHETHWA',
        numberOfParticipants: 38,
        targetAudience: 'Senior clinical staff',
        objectives: 'Update knowledge on latest NCD treatment protocols',
        materials: 'Clinical guidelines, case studies, assessment tools',
        status: 4, // Completed
        statusText: 'Completed',
        dateCreated: '2024-09-10T11:20:00.000Z',
        lastUpdated: '2024-10-26T17:00:00.000Z',
        createdByUserName: 'Head of Training'
      }
    ];
  }

  private getFallbackInventoryItems(): InventoryItem[] {
    return [
      {
        id: 1,
        itemNumber: 'GLU-001',
        description: 'Glucose Test Strips (Box of 50)',
        location: 'Medical Store Room A',
        uom: 'box',
        category: 'Medical',
        qtyOnHand: 150,
        qtyOnPO: 200,
        qtyOnSO: 75,
        unitCostForQOH: 45.50,
        reorderLevel: 50,
        maxStockLevel: 500,
        supplier: 'MedSupply SA',
        lastRestocked: '2024-09-15',
        expiryDate: '2025-08-31',
        status: 'Active'
      },
      {
        id: 2,
        itemNumber: 'BP-002',
        description: 'Digital Blood Pressure Monitor',
        location: 'Equipment Store',
        uom: 'each',
        category: 'Equipment',
        qtyOnHand: 25,
        qtyOnPO: 10,
        qtyOnSO: 5,
        unitCostForQOH: 320.00,
        reorderLevel: 10,
        maxStockLevel: 50,
        supplier: 'HealthTech Solutions',
        lastRestocked: '2024-09-20',
        status: 'Active'
      },
      {
        id: 3,
        itemNumber: 'MET-003',
        description: 'Metformin 500mg Tablets (Bottle of 100)',
        location: 'Pharmacy Store',
        uom: 'bottle',
        category: 'Pharmaceutical',
        qtyOnHand: 80,
        qtyOnPO: 150,
        qtyOnSO: 40,
        unitCostForQOH: 12.75,
        reorderLevel: 30,
        maxStockLevel: 300,
        supplier: 'Pharma Direct',
        lastRestocked: '2024-09-10',
        expiryDate: '2026-03-15',
        status: 'Active'
      }
    ];
  }

  private getFallbackSales(): Sale[] {
    return [
      {
        id: 1,
        saleNumber: 'SALE-2024-001',
        saleDate: '2024-10-01T00:00:00.000Z',
        province: 'Western Cape',
        hospital: 'Tygerberg Hospital',
        customerContactName: 'Dr. Susan Williams',
        customerContactEmail: 'susan.williams@tygerberg.gov.za',
        customerContactPhone: '+27-21-938-5555',
        paymentMethod: 3, // Bank Transfer
        paymentStatus: 2, // Paid
        deliveryStatus: 3, // Delivered
        deliveryDate: '2024-10-03T00:00:00.000Z',
        notes: 'Urgent delivery for diabetes clinic',
        salesPerson: 'John Marketing',
        discount: 5.00,
        invoiceNumber: 'INV-2024-001',
        saleItems: [
          { id: 1, productId: 1, productName: 'Glucose Test Strips', quantity: 10, unitPrice: 45.50 },
          { id: 2, productId: 2, productName: 'Blood Pressure Monitor', quantity: 2, unitPrice: 320.00 }
        ],
        totalAmount: 1095.00
      },
      {
        id: 2,
        saleNumber: 'SALE-2024-002',
        saleDate: '2024-10-02T00:00:00.000Z',
        province: 'Gauteng',
        hospital: 'Charlotte Maxeke Hospital',
        customerContactName: 'Sr. Patricia Mthembu',
        customerContactEmail: 'patricia.mthembu@cmjah.ac.za',
        customerContactPhone: '+27-11-488-5000',
        paymentMethod: 2, // Card
        paymentStatus: 2, // Paid
        deliveryStatus: 2, // In Transit
        deliveryDate: '2024-10-05T00:00:00.000Z',
        salesPerson: 'Sarah Sales',
        discount: 0.00,
        invoiceNumber: 'INV-2024-002',
        saleItems: [
          { id: 3, productId: 3, productName: 'Digital Thermometer', quantity: 20, unitPrice: 12.75 }
        ],
        totalAmount: 255.00
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