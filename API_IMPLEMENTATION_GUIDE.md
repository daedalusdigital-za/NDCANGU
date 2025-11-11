# NDCANGU Medical Management API - Implementation Guide

**API Base URL**: `https://localhost:7217` or `http://localhost:5217`  
**Swagger Documentation**: `http://localhost:5217/swagger/index.html`  
**Last Updated**: October 7, 2025

## 🎯 Overview

This document provides a comprehensive guide for implementing and integrating with the NDCANGU Medical Management API. The API provides **80+ endpoints** across multiple healthcare management modules with complete CRUD operations.

---

## 🔐 Authentication

All endpoints (except Auth endpoints) require JWT Bearer token authentication.

### Auth Controller
- **POST** `/api/Auth/login` - User login
- **POST** `/api/Auth/register` - User registration
- **POST** `/api/Auth/reset-password` - Reset user password
- **POST** `/api/Auth/change-password` - Change user password

#### Authentication Example:
```json
POST /api/Auth/login
{
  "email": "admin@hospital.co.za",
  "password": "Admin123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@hospital.co.za",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "Administrator"
}
```

---

## 🌍 Location Management APIs

### Province Controller
- **GET** `/api/Province` - Get all provinces
- **GET** `/api/Province/{id}` - Get province by ID
- **POST** `/api/Province` - Create new province
- **PUT** `/api/Province/{id}` - Update province
- **DELETE** `/api/Province/{id}` - Delete province

### District Controller
- **GET** `/api/District` - Get all districts
- **GET** `/api/District/{id}` - Get district by ID
- **GET** `/api/District/by-province/{provinceId}` - Get districts by province
- **POST** `/api/District` - Create new district
- **PUT** `/api/District/{id}` - Update district
- **DELETE** `/api/District/{id}` - Delete district

### Hospital Controller
- **GET** `/api/Hospital` - Get all hospitals
- **GET** `/api/Hospital/{id}` - Get hospital by ID
- **GET** `/api/Hospital/by-district/{districtId}` - Get hospitals by district
- **GET** `/api/Hospital/by-province/{provinceId}` - Get hospitals by province
- **POST** `/api/Hospital` - Create new hospital
- **PUT** `/api/Hospital/{id}` - Update hospital
- **DELETE** `/api/Hospital/{id}` - Delete hospital

### Location API Implementation
```typescript
// Angular Service Implementation
@Injectable()
export class LocationService {
  private baseUrl = 'http://localhost:5217/api';

  // Get all provinces
  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.baseUrl}/Province`);
  }

  // Get hospitals by province
  getHospitalsByProvince(provinceId: number): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(`${this.baseUrl}/Hospital/by-province/${provinceId}`);
  }
}
```

---

## 👨‍⚕️ Training Management APIs

### Trainer Controller
- **GET** `/api/Trainer` - Get all trainers
- **GET** `/api/Trainer/{id}` - Get trainer by ID
- **GET** `/api/Trainer/by-hospital/{hospitalId}` - Get trainers by hospital
- **POST** `/api/Trainer` - Create new trainer
- **PUT** `/api/Trainer/{id}` - Update trainer
- **DELETE** `/api/Trainer/{id}` - Delete trainer

### Training Session Controller
- **GET** `/api/TrainingSession` - Get all training sessions
- **GET** `/api/TrainingSession/{id}` - Get training session by ID
- **GET** `/api/TrainingSession/by-trainer/{trainerId}` - Get sessions by trainer
- **GET** `/api/TrainingSession/by-hospital/{hospitalId}` - Get sessions by hospital
- **GET** `/api/TrainingSession/upcoming` - Get upcoming training sessions
- **POST** `/api/TrainingSession` - Create new training session
- **PUT** `/api/TrainingSession/{id}` - Update training session
- **DELETE** `/api/TrainingSession/{id}` - Delete training session

### Training API Implementation
```typescript
// Angular Service Implementation
@Injectable()
export class TrainingService {
  private baseUrl = 'http://localhost:5217/api';

  // Create new training session
  createTrainingSession(session: TrainingSession): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.baseUrl}/TrainingSession`, session);
  }

  // Get upcoming training sessions
  getUpcomingTrainingSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.baseUrl}/TrainingSession/upcoming`);
  }
}
```

---

## 📦 Inventory Management APIs

### Inventory Item Controller
- **GET** `/api/InventoryItem` - Get all inventory items
- **GET** `/api/InventoryItem/{id}` - Get inventory item by ID
- **GET** `/api/InventoryItem/by-hospital/{hospitalId}` - Get inventory by hospital
- **GET** `/api/InventoryItem/low-stock` - Get low stock items
- **GET** `/api/InventoryItem/by-category/{category}` - Get items by category
- **POST** `/api/InventoryItem` - Create new inventory item
- **PUT** `/api/InventoryItem/{id}` - Update inventory item
- **DELETE** `/api/InventoryItem/{id}` - Delete inventory item

### Inventory API Implementation
```typescript
// Angular Service Implementation
@Injectable()
export class InventoryService {
  private baseUrl = 'http://localhost:5217/api';

  // Get low stock items
  getLowStockItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/InventoryItem/low-stock`);
  }

  // Update inventory stock
  updateInventoryItem(id: number, item: InventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.baseUrl}/InventoryItem/${id}`, item);
  }
}
```

---

## 💰 Sales Management APIs

### Sale Controller
- **GET** `/api/Sale` - Get all sales
- **GET** `/api/Sale/{id}` - Get sale by ID
- **GET** `/api/Sale/by-hospital/{hospitalId}` - Get sales by hospital
- **GET** `/api/Sale/by-date-range` - Get sales by date range
- **GET** `/api/Sale/revenue-summary` - Get revenue summary
- **POST** `/api/Sale` - Create new sale
- **PUT** `/api/Sale/{id}` - Update sale
- **DELETE** `/api/Sale/{id}` - Delete sale

### Sales API Implementation
```typescript
// Angular Service Implementation
@Injectable()
export class SalesService {
  private baseUrl = 'http://localhost:5217/api';

  // Create new sale
  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.baseUrl}/Sale`, sale);
  }

  // Get revenue summary
  getRevenueSummary(): Observable<RevenueSummary> {
    return this.http.get<RevenueSummary>(`${this.baseUrl}/Sale/revenue-summary`);
  }
}
```

---

## 📊 Dashboard & Analytics APIs

### Dashboard Controller
- **GET** `/api/Dashboard/overview` - Get dashboard overview
- **GET** `/api/Dashboard/hospital-stats` - Get hospital statistics
- **GET** `/api/Dashboard/training-metrics` - Get training metrics
- **GET** `/api/Dashboard/inventory-summary` - Get inventory summary
- **GET** `/api/Dashboard/sales-analytics` - Get sales analytics
- **GET** `/api/Dashboard/user-activity` - Get user activity reports

### Dashboard API Implementation
```typescript
// Angular Service Implementation
@Injectable()
export class DashboardService {
  private baseUrl = 'http://localhost:5217/api';

  // Get dashboard overview
  getDashboardOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.baseUrl}/Dashboard/overview`);
  }

  // Get training metrics
  getTrainingMetrics(): Observable<TrainingMetrics> {
    return this.http.get<TrainingMetrics>(`${this.baseUrl}/Dashboard/training-metrics`);
  }
}
```

---

## 📋 Required Fields for POST Endpoints

### 🔐 Authentication Endpoints

#### POST `/api/Auth/login`
```json
{
  "email": "string",           // Required - User email address
  "password": "string"         // Required - User password
}
```

#### POST `/api/Auth/register`
```json
{
  "firstName": "string",       // Required - User first name
  "lastName": "string",        // Required - User last name
  "email": "string",           // Required - Valid email address
  "phoneNumber": "string",     // Required - Phone number
  "password": "string"         // Required - Strong password
}
```

### 🌍 Location Management

#### POST `/api/Province`
```json
{
  "name": "string",            // Required - Province name (e.g., "Western Cape")
  "code": "string",            // Required - Province code (e.g., "WC")
  "population": 0,             // Optional - Population count
  "healthFacilities": 0        // Optional - Number of health facilities
}
```

#### POST `/api/Hospital`
```json
{
  "name": "string",            // Required - Hospital name
  "code": "string",            // Required - Hospital code
  "provinceId": 0,             // Required - Valid Province ID
  "districtId": 0,             // Optional - District ID
  "type": 1,                   // Required - 1=Hospital, 2=Clinic, 3=CHC, 4=Specialized
  "level": 1,                  // Optional - 1=Primary, 2=Secondary, 3=Tertiary
  "address": "string",         // Optional - Physical address
  "contactNumber": "string",   // Optional - Contact phone number
  "email": "string",           // Optional - Contact email
  "status": 1,                 // Required - 1=Active, 2=Inactive, 3=UnderConstruction
  "capacity": 0,               // Optional - Bed capacity
  "services": "string"         // Optional - JSON array of services
}
```

### 👨‍⚕️ Training Management

#### POST `/api/Trainer`
```json
{
  "name": "string",            // Required - Trainer full name
  "email": "string",           // Required - Valid email address
  "phone": "string",           // Required - Phone number
  "province": "string",        // Required - Province name
  "qualification": "string",   // Optional - Professional qualifications
  "experience": 0,             // Required - Years of experience
  "status": 1,                 // Required - 1=Active, 2=Inactive, 3=OnLeave
  "location": "string",        // Optional - Based location
  "bio": "string"              // Optional - Biography/description
}
```

#### POST `/api/TrainingSession`
```json
{
  "trainingName": "string",        // Required - Training session name
  "trainingType": "string",        // Required - Type of training
  "description": "string",         // Optional - Detailed description
  "startDate": "2024-01-01",       // Required - Start date (YYYY-MM-DD)
  "endDate": "2024-01-01",         // Required - End date (YYYY-MM-DD)
  "startTime": "09:00:00",         // Required - Start time (HH:MM:SS)
  "endTime": "17:00:00",           // Required - End time (HH:MM:SS)
  "province": "string",            // Required - Province name
  "hospital": "string",            // Required - Hospital/venue name
  "venue": "string",               // Required - Specific venue/room
  "trainerId": 0,                  // Required - Valid Trainer ID
  "numberOfParticipants": 0,       // Required - Expected participants
  "targetAudience": "string",      // Required - Target audience description
  "objectives": "string",          // Optional - Training objectives
  "materials": "string",           // Optional - Required materials
  "status": 1                      // Required - 1=Scheduled, 2=InProgress, 3=Completed, 4=Cancelled
}
```

### 📦 Inventory Management

#### POST `/api/InventoryItem`
```json
{
  "itemNumber": "string",          // Required - Unique item number
  "description": "string",         // Required - Item description
  "location": "string",            // Required - Storage location
  "uom": "string",                 // Required - Unit of measure (e.g., "each", "box")
  "category": 1,                   // Required - 1=Medical, 2=Equipment, 3=Pharmaceutical, 4=Consumable
  "qtyOnHand": 0,                  // Required - Current stock quantity
  "qtyOnPO": 0,                    // Required - Quantity on purchase order
  "qtyOnSO": 0,                    // Required - Quantity on sales order
  "unitCostForQOH": 0.00,          // Required - Unit cost (decimal)
  "reorderLevel": 0,               // Required - Minimum stock level
  "maxStockLevel": 0,              // Required - Maximum stock level
  "supplier": "string",            // Optional - Supplier name
  "lastRestocked": "2024-01-01",   // Optional - Last restock date
  "expiryDate": "2024-12-31",      // Optional - Expiry date
  "status": 1                      // Required - 1=Active, 2=Discontinued, 3=OutOfStock
}
```

### 💰 Sales Management

#### POST `/api/Sale`
```json
{
  "saleNumber": "string",              // Required - Unique sale number
  "saleDate": "2024-01-01",            // Required - Sale date
  "province": "string",                // Required - Province name
  "hospital": "string",                // Required - Hospital name
  "customerContactName": "string",     // Required - Customer contact person
  "customerContactEmail": "string",    // Optional - Customer email
  "customerContactPhone": "string",    // Optional - Customer phone
  "paymentMethod": 1,                  // Required - 1=Cash, 2=Card, 3=EFT, 4=Cheque
  "paymentStatus": 1,                  // Required - 1=Pending, 2=Paid, 3=Overdue
  "deliveryStatus": 1,                 // Required - 1=Pending, 2=InTransit, 3=Delivered
  "deliveryDate": "2024-01-01",        // Optional - Expected delivery date
  "notes": "string",                   // Optional - Additional notes
  "salesPerson": "string",             // Optional - Sales person name
  "discount": 0.00,                    // Required - Discount amount (decimal)
  "invoiceNumber": "string",           // Optional - Invoice number
  "saleItems": [                       // Required - Array of sale items
    {
      "inventoryItemId": 0,            // Required - Valid Inventory Item ID
      "quantity": 1,                   // Required - Quantity sold
      "unitPrice": 0.00,               // Required - Unit price (decimal)
      "totalPrice": 0.00               // Required - Total price (decimal)
    }
  ]
}
```

---

## 🚀 Angular Integration Guide

### 1. Base Service Configuration

```typescript
// base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected baseUrl = 'http://localhost:5217/api';

  constructor(protected http: HttpClient) {}

  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    });
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    });
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }
}
```

### 2. Training Service Implementation

```typescript
// training.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface TrainingSession {
  id?: number;
  trainingName: string;
  trainingType: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  province: string;
  hospital: string;
  venue: string;
  trainerId: number;
  numberOfParticipants: number;
  targetAudience: string;
  objectives?: string;
  materials?: string;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Trainer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  province: string;
  qualification?: string;
  experience: number;
  status: number;
  location?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService extends BaseService {

  // Training Sessions
  getAllTrainingSessions(): Observable<TrainingSession[]> {
    return this.get<TrainingSession[]>('/TrainingSession');
  }

  getTrainingSessionById(id: number): Observable<TrainingSession> {
    return this.get<TrainingSession>(`/TrainingSession/${id}`);
  }

  createTrainingSession(session: TrainingSession): Observable<TrainingSession> {
    return this.post<TrainingSession>('/TrainingSession', session);
  }

  updateTrainingSession(id: number, session: TrainingSession): Observable<TrainingSession> {
    return this.put<TrainingSession>(`/TrainingSession/${id}`, session);
  }

  deleteTrainingSession(id: number): Observable<any> {
    return this.delete(`/TrainingSession/${id}`);
  }

  getUpcomingTrainingSessions(): Observable<TrainingSession[]> {
    return this.get<TrainingSession[]>('/TrainingSession/upcoming');
  }

  // Trainers
  getAllTrainers(): Observable<Trainer[]> {
    return this.get<Trainer[]>('/Trainer');
  }

  getTrainerById(id: number): Observable<Trainer> {
    return this.get<Trainer>(`/Trainer/${id}`);
  }

  createTrainer(trainer: Trainer): Observable<Trainer> {
    return this.post<Trainer>('/Trainer', trainer);
  }

  updateTrainer(id: number, trainer: Trainer): Observable<Trainer> {
    return this.put<Trainer>(`/Trainer/${id}`, trainer);
  }

  deleteTrainer(id: number): Observable<any> {
    return this.delete(`/Trainer/${id}`);
  }
}
```

### 3. Location Service Implementation

```typescript
// location.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

export interface Province {
  id?: number;
  name: string;
  code: string;
  population?: number;
  healthFacilities?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Hospital {
  id?: number;
  name: string;
  code: string;
  provinceId: number;
  districtId?: number;
  type: number;
  level?: number;
  address?: string;
  contactNumber?: string;
  email?: string;
  status: number;
  capacity?: number;
  services?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService extends BaseService {

  // Provinces
  getAllProvinces(): Observable<Province[]> {
    return this.get<Province[]>('/Province');
  }

  getProvinceById(id: number): Observable<Province> {
    return this.get<Province>(`/Province/${id}`);
  }

  createProvince(province: Province): Observable<Province> {
    return this.post<Province>('/Province', province);
  }

  // Hospitals
  getAllHospitals(): Observable<Hospital[]> {
    return this.get<Hospital[]>('/Hospital');
  }

  getHospitalById(id: number): Observable<Hospital> {
    return this.get<Hospital>(`/Hospital/${id}`);
  }

  getHospitalsByProvince(provinceId: number): Observable<Hospital[]> {
    return this.get<Hospital[]>(`/Hospital/by-province/${provinceId}`);
  }

  createHospital(hospital: Hospital): Observable<Hospital> {
    return this.post<Hospital>('/Hospital', hospital);
  }

  updateHospital(id: number, hospital: Hospital): Observable<Hospital> {
    return this.put<Hospital>(`/Hospital/${id}`, hospital);
  }

  deleteHospital(id: number): Observable<any> {
    return this.delete(`/Hospital/${id}`);
  }
}
```

### 4. Component Integration Example

```typescript
// add-training.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService, TrainingSession, Trainer } from '../services/training.service';
import { LocationService, Province, Hospital } from '../services/location.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  provinces: Province[] = [];
  hospitals: Hospital[] = [];
  trainers: Trainer[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private locationService: LocationService,
    private toastr: ToastrService
  ) {
    this.trainingForm = this.fb.group({
      trainingName: ['', [Validators.required, Validators.minLength(3)]],
      trainingType: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      province: ['', Validators.required],
      hospital: ['', Validators.required],
      venue: ['', Validators.required],
      trainerId: ['', Validators.required],
      numberOfParticipants: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      targetAudience: ['', Validators.required],
      objectives: [''],
      materials: [''],
      status: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadTrainers();
  }

  loadProvinces(): void {
    this.locationService.getAllProvinces().subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: (error) => {
        this.toastr.error('Failed to load provinces', 'Error');
        console.error('Error loading provinces:', error);
      }
    });
  }

  loadTrainers(): void {
    this.trainingService.getAllTrainers().subscribe({
      next: (trainers) => {
        this.trainers = trainers.filter(t => t.status === 1); // Active trainers only
      },
      error: (error) => {
        this.toastr.error('Failed to load trainers', 'Error');
        console.error('Error loading trainers:', error);
      }
    });
  }

  onProvinceChange(): void {
    const selectedProvince = this.trainingForm.get('province')?.value;
    if (selectedProvince) {
      const province = this.provinces.find(p => p.name === selectedProvince);
      if (province) {
        this.loadHospitalsByProvince(province.id!);
      }
    }
  }

  loadHospitalsByProvince(provinceId: number): void {
    this.locationService.getHospitalsByProvince(provinceId).subscribe({
      next: (hospitals) => {
        this.hospitals = hospitals.filter(h => h.status === 1); // Active hospitals only
      },
      error: (error) => {
        this.toastr.error('Failed to load hospitals', 'Error');
        console.error('Error loading hospitals:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.isSubmitting = true;
      
      const trainingData: TrainingSession = {
        ...this.trainingForm.value
      };

      this.trainingService.createTrainingSession(trainingData).subscribe({
        next: (response) => {
          this.toastr.success('Training session created successfully!', 'Success');
          this.trainingForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.toastr.error('Failed to create training session', 'Error');
          console.error('Error creating training session:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.toastr.error('Please fill in all required fields correctly.', 'Form Error');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.trainingForm.controls).forEach(field => {
      const control = this.trainingForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
```

---

## 🔧 Migration from Hardcoded Data

### Step 1: Replace Hardcoded Arrays

**Before (Hardcoded):**
```typescript
// trainers.component.ts
loadTrainers(): void {
  this.trainers = [
    {
      id: 1,
      name: 'ZIBA',
      email: 'ziba@Promedtechnologies.co.za',
      phone: '+27721234567',
      province: 'Gauteng',
      qualification: 'MD',
      experience: 8,
      status: 'Active',
      location: 'Johannesburg',
      bio: 'Experienced medical trainer'
    }
    // ... more hardcoded data
  ];
}
```

**After (API Integration):**
```typescript
// trainers.component.ts
loadTrainers(): void {
  this.trainingService.getAllTrainers().subscribe({
    next: (trainers) => {
      this.trainers = trainers;
    },
    error: (error) => {
      // Fallback to mock data if API fails
      this.loadMockTrainers();
      this.toastr.warning('Using offline data', 'API Unavailable');
    }
  });
}

private loadMockTrainers(): void {
  // Keep existing mock data as fallback
  this.trainers = this.getMockTrainers();
}
```

### Step 2: Update Component Methods

**Before:**
```typescript
saveTrainer(trainer: any): void {
  // Save to local array
  if (trainer.id) {
    const index = this.trainers.findIndex(t => t.id === trainer.id);
    this.trainers[index] = trainer;
  } else {
    trainer.id = Date.now();
    this.trainers.push(trainer);
  }
}
```

**After:**
```typescript
saveTrainer(trainer: Trainer): void {
  if (trainer.id) {
    // Update existing trainer
    this.trainingService.updateTrainer(trainer.id, trainer).subscribe({
      next: (response) => {
        this.toastr.success('Trainer updated successfully!');
        this.loadTrainers(); // Refresh list
      },
      error: (error) => {
        this.toastr.error('Failed to update trainer');
      }
    });
  } else {
    // Create new trainer
    this.trainingService.createTrainer(trainer).subscribe({
      next: (response) => {
        this.toastr.success('Trainer created successfully!');
        this.loadTrainers(); // Refresh list
      },
      error: (error) => {
        this.toastr.error('Failed to create trainer');
      }
    });
  }
}
```

---

## 📋 Field Validation & Error Handling

### 1. Client-Side Validation
```typescript
// Form validation with API field requirements
createTrainingForm(): FormGroup {
  return this.fb.group({
    trainingName: ['', [
      Validators.required, 
      Validators.minLength(3),
      Validators.maxLength(200)
    ]],
    trainingType: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    province: ['', [Validators.required]],
    hospital: ['', [Validators.required]],
    venue: ['', [Validators.required]],
    trainerId: ['', [Validators.required]],
    numberOfParticipants: ['', [
      Validators.required, 
      Validators.min(1), 
      Validators.max(100)
    ]],
    targetAudience: ['', [Validators.required]]
  }, {
    validators: this.dateRangeValidator // Custom validator
  });
}

// Custom validator for date range
dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const startDate = group.get('startDate')?.value;
  const endDate = group.get('endDate')?.value;
  
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return { dateRange: true };
  }
  return null;
}
```

### 2. API Error Handling
```typescript
// Global error handler service
@Injectable()
export class ErrorHandlerService {
  
  handleApiError(error: any): string {
    if (error.status === 400) {
      // Validation errors
      if (error.error.errors) {
        const validationErrors = Object.values(error.error.errors).flat();
        return validationErrors.join(', ');
      }
      return error.error.message || 'Invalid data provided';
    } else if (error.status === 401) {
      return 'Authentication required. Please log in again.';
    } else if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'Network error. Please check your connection.';
    }
  }
}
```

---

## 🗄️ Database Information

**Database**: SQL Server  
**Tables**: 12 comprehensive tables  
**Sample Data**: 200+ realistic records for South African healthcare system  

### Sample Data Includes:
- **9 South African Provinces**: Western Cape, Eastern Cape, Northern Cape, etc.
- **52 Districts**: Cape Town Metro, Nelson Mandela Bay, etc.
- **150+ Hospitals**: Groote Schuur, Chris Hani Baragwanath, etc.
- **25 Medical Trainers**: Specialists across different fields
- **30 Training Sessions**: NCD management training programs
- **50 Medical Inventory Items**: Equipment, medications, supplies
- **75 Sales Transactions**: Medical equipment and supply sales

---

## 🚀 Getting Started

### 1. Start the API
```bash
cd MH.Api
dotnet run --project MH.Api.csproj
```

### 2. Access Swagger Documentation
Navigate to: `http://localhost:5217/swagger/index.html`

### 3. Test Authentication
```javascript
// Test login endpoint
fetch('http://localhost:5217/api/Auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@hospital.co.za',
    password: 'Admin123!'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Auth Token:', data.token);
  localStorage.setItem('authToken', data.token);
});
```

### 4. Test API Endpoints
```javascript
// Test with authentication
const token = localStorage.getItem('authToken');

fetch('http://localhost:5217/api/Province', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Provinces:', data));
```

---

## 📊 Implementation Progress Tracking

### Phase 1: Core APIs (✅ Completed)
- [x] Authentication (Login, Register, Password Reset)
- [x] Location Management (Provinces, Districts, Hospitals)
- [x] Training Management (Trainers, Training Sessions)
- [x] Dashboard Analytics
- [x] User Management

### Phase 2: Business APIs (✅ Completed)
- [x] Inventory Management (Items, Stock Tracking)
- [x] Sales Management (Sales, Revenue Tracking)
- [x] Medical System (Patients, Appointments, Medical History)

### Phase 3: Integration (🔄 In Progress)
- [ ] Replace hardcoded data in Angular components
- [ ] Implement error handling and fallbacks
- [ ] Add loading states and skeleton screens
- [ ] Performance optimization and caching

---

## 🔗 API Response Standards

### Success Response Format
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

**🔒 Security**: All endpoints require JWT authentication except Auth endpoints  
**📄 Content-Type**: `application/json` (multipart/form-data for file uploads)  
**🌐 CORS**: Enabled for Angular frontend integration  
**📚 Documentation**: Auto-generated Swagger UI available at `/swagger/index.html`

---

**📝 Document Status**: Ready for Frontend Integration  
**📅 Last Updated**: October 7, 2025  
**👥 Stakeholders**: Frontend Team, Backend Team, QA Team  
**🔄 Version**: 1.0 - Complete API Implementation Guide