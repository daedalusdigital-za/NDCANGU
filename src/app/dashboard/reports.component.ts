import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ReportData {
  id: number;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  testType: string;
  testDate: string;
  result: string;
  status: string;
  province: string;
  hospital: string;
  doctorName: string;
  priority: string;
  notes: string;
}

@Component({
  selector: 'app-reports',
  template: `
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <div>
              <h4 class="mb-1">Reports Dashboard</h4>
              <p class="text-muted mb-0">Generate and export custom reports with advanced filtering</p>
            </div>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item"><a href="javascript: void(0);">Dashboard</a></li>
                <li class="breadcrumb-item active">Reports</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Configuration Card -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <div class="d-flex align-items-center">
                <i class="fas fa-chart-line me-2"></i>
                <h5 class="mb-0">Report Builder</h5>
              </div>
            </div>
            <div class="card-body">
              
              <!-- Step 1: Report Type and Date Range -->
              <div class="mb-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="step-number">1</div>
                  <h6 class="mb-0 ms-2">Report Configuration</h6>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-file-alt me-1"></i>Report Type
                    </label>
                    <select class="form-select" [(ngModel)]="reportType" (change)="onReportTypeChange()">
                      <option value="">Select Report Type</option>
                      <option value="patient">👤 Patient Report</option>
                      <option value="test">🧪 Test Results Report</option>
                      <option value="hospital">🏥 Hospital Report</option>
                      <option value="doctor">👨‍⚕️ Doctor Report</option>
                    </select>
                  </div>
                  
                  <div class="col-lg-3 col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-calendar me-1"></i>Date Range
                    </label>
                    <select class="form-select" [(ngModel)]="dateRange" (change)="onDateRangeChange()">
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  
                  <div class="col-lg-3 col-md-6 mb-3" *ngIf="dateRange === 'custom'">
                    <label class="form-label fw-semibold">Start Date</label>
                    <input type="date" class="form-control" [(ngModel)]="startDate">
                  </div>
                  
                  <div class="col-lg-3 col-md-6 mb-3" *ngIf="dateRange === 'custom'">
                    <label class="form-label fw-semibold">End Date</label>
                    <input type="date" class="form-control" [(ngModel)]="endDate">
                  </div>
                </div>
              </div>

              <!-- Step 2: Filters -->
              <div class="mb-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="step-number">2</div>
                  <h6 class="mb-0 ms-2">Apply Filters</h6>
                </div>
                <div class="row">
                  <div class="col-lg-3 col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-map-marker-alt me-1"></i>Province
                    </label>
                    <select class="form-select" [(ngModel)]="selectedProvince" (change)="onProvinceChange()">
                      <option value="">All Provinces</option>
                      <option *ngFor="let province of provinces" [value]="province">{{province}}</option>
                    </select>
                  </div>
                  
                  <div class="col-lg-3 col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-hospital me-1"></i>Hospital
                    </label>
                    <select class="form-select" [(ngModel)]="selectedHospital">
                      <option value="">All Hospitals</option>
                      <option *ngFor="let hospital of filteredHospitals" [value]="hospital">{{hospital}}</option>
                    </select>
                  </div>
                  
                  <div class="col-lg-3 col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-vial me-1"></i>Test Type
                    </label>
                    <select class="form-select" [(ngModel)]="selectedTestType">
                      <option value="">All Test Types</option>
                      <option *ngFor="let testType of testTypes" [value]="testType">{{testType}}</option>
                    </select>
                  </div>
                  
                  <div class="col-lg-3 col-md-6 mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-flag me-1"></i>Status
                    </label>
                    <select class="form-select" [(ngModel)]="selectedStatus">
                      <option value="">All Status</option>
                      <option value="Completed">✅ Completed</option>
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🔄 In Progress</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="text-center">
                <button class="btn btn-primary btn-sm me-2" (click)="generateReport()">
                  <i class="fas fa-search me-1"></i>Generate Report
                </button>
                <button class="btn btn-success btn-sm me-2" (click)="exportToExcel()" [disabled]="!hasData">
                  <i class="fas fa-file-excel me-1"></i>Export to Excel
                </button>
                <button class="btn btn-outline-secondary btn-sm" (click)="clearFilters()">
                  <i class="fas fa-undo me-1"></i>Reset All
                </button>
            </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Search Section -->
      <div class="row" *ngIf="reportGenerated && hasData">
        <div class="col-12">
          <div class="card shadow-sm search-card">
            <div class="card-header bg-gradient-info text-white">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <i class="fas fa-search me-2"></i>
                  <h6 class="mb-0">Advanced Search & Filter</h6>
                </div>
                <button class="btn btn-sm btn-outline-light" (click)="clearSearch()" *ngIf="searchTerm">
                  <i class="fas fa-times me-1"></i>Clear
                </button>
              </div>
            </div>
            <div class="card-body search-body">
              <div class="row align-items-center">
                <div class="col-lg-6 col-md-8 mb-3 mb-lg-0">
                  <div class="search-input-container">
                    <div class="search-input-wrapper">
                      <i class="fas fa-search search-icon"></i>
                      <input 
                        type="text" 
                        class="form-control search-input" 
                        placeholder="Search" 
                        [(ngModel)]="searchTerm"
                        (input)="onSearchChange()"
                        (keyup.enter)="performSearch()"
                        autocomplete="off"
                      >
                      <button 
                        class="btn btn-link search-clear-btn" 
                        *ngIf="searchTerm" 
                        (click)="clearSearch()"
                        type="button"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-4 mb-3 mb-lg-0">
                  <div class="search-field-selector">
                    <select class="form-select search-field-select" [(ngModel)]="searchField" (change)="onSearchFieldChange()">
                      <option value="all">🔍 All Fields</option>
                      <option value="patientName">👤 Patient Name</option>
                      <option value="patientId">🆔 Patient ID</option>
                      <option value="testType">🧪 Test Type</option>
                      <option value="hospital">🏥 Hospital</option>
                      <option value="doctorName">👨‍⚕️ Doctor</option>
                      <option value="result">📊 Result</option>
                      <option value="status">📋 Status</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-3 col-md-12">
                  <div class="search-actions">
                    <button class="btn btn-primary search-btn" (click)="performSearch()" [disabled]="isSearching">
                      <i class="fas fa-search me-1" *ngIf="!isSearching"></i>
                      <i class="fas fa-spinner fa-spin me-1" *ngIf="isSearching"></i>
                      {{ isSearching ? 'Searching...' : 'Search' }}
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Search Results Summary -->
              <div class="search-results-summary" *ngIf="searchTerm && reportGenerated">
                <div class="row align-items-center">
                  <div class="col-md-6">
                    <div class="results-count">
                      <i class="fas fa-filter me-2 text-primary"></i>
                      <span class="fw-semibold">{{ filteredReportData.length }}</span> 
                      of {{ reportData.length }} results
                      <span class="text-muted" *ngIf="searchTerm">for "</span>
                      <span class="search-term-highlight" *ngIf="searchTerm">{{ searchTerm }}</span>
                      <span class="text-muted" *ngIf="searchTerm">"</span>
                    </div>
                  </div>
                  <div class="col-md-6 text-end">
                    <div class="search-field-info">
                      <small class="text-muted">
                        <i class="fas fa-crosshairs me-1"></i>
                        Searching in: <strong>{{ getSearchFieldLabel() }}</strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div class="row mt-4" *ngIf="reportGenerated && hasData">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-success text-white">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <h6 class="mb-0">
                    <i class="fas fa-table me-2"></i>Report Results
                  </h6>
                </div>
                <div class="d-flex align-items-center">
                  <span class="badge bg-light text-dark me-2">
                    {{ filteredReportData.length }} Records
                  </span>
                  <button class="btn btn-sm btn-outline-light" (click)="exportToExcel()">
                    <i class="fas fa-file-excel me-1"></i>Export
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-dark">
                    <tr>
                      <th>Patient</th>
                      <th>ID</th>
                      <th>Test Type</th>
                      <th>Date</th>
                      <th>Result</th>
                      <th>Status</th>
                      <th>Hospital</th>
                      <th>Doctor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of filteredReportData; trackBy: trackByFn">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="patient-avatar">
                            {{ row.patientName.charAt(0) }}
                          </div>
                          <div class="ms-2">
                            <div class="fw-semibold">{{ row.patientName }}</div>
                            <small class="text-muted">{{ row.age }} yrs, {{ row.gender }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code class="patient-id">{{ row.patientId }}</code>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ row.testType }}</span>
                      </td>
                      <td>
                        <small>{{ row.testDate | date:'mediumDate' }}</small>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getResultBadgeClass(row.result)">
                          {{ row.result }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getStatusBadgeClass(row.status)">
                          {{ row.status }}
                        </span>
                      </td>
                      <td>
                        <div class="text-truncate" style="max-width: 150px;">
                          {{ row.hospital }}
                        </div>
                      </td>
                      <td>{{ row.doctorName }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" title="View Details">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-secondary" title="Edit">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data Message -->
      <div class="row mt-4" *ngIf="reportData.length === 0 && reportGenerated">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body text-center py-5">
              <div class="mb-3">
                <i class="fas fa-search text-muted" style="font-size: 3rem;"></i>
              </div>
              <h5 class="text-muted">No Data Found</h5>
              <p class="text-muted mb-3">No records match your current filter criteria. Try adjusting your filters or date range.</p>
              <button class="btn btn-primary" (click)="clearFilters()">
                <i class="fas fa-undo me-1"></i>Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Getting Started Guide -->
      <div class="row mt-4" *ngIf="!reportGenerated">
        <div class="col-12">
          <div class="card shadow-sm border-info">
            <div class="card-body text-center py-5">
              <div class="mb-3">
                <i class="fas fa-rocket text-info" style="font-size: 3rem;"></i>
              </div>
              <h5 class="text-info">Get Started with Custom Reports</h5>
              <p class="text-muted mb-4">Follow these simple steps to create your custom report:</p>
              <div class="row">
                <div class="col-md-4">
                  <div class="text-center mb-3">
                    <div class="step-number-large bg-primary text-white">1</div>
                    <h6 class="mt-2">Choose Report Type</h6>
                    <p class="text-muted small">Select the type of report you want to generate</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center mb-3">
                    <div class="step-number-large bg-primary text-white">2</div>
                    <h6 class="mt-2">Apply Filters</h6>
                    <p class="text-muted small">Set filters to narrow down your report data</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center mb-3">
                    <div class="step-number-large bg-primary text-white">3</div>
                    <h6 class="mt-2">Generate & Export</h6>
                    <p class="text-muted small">Create your report and export to Excel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      min-height: 100vh;
    }
    
    .container-fluid {
      padding-top: 120px !important;
      padding-left: 2rem !important;
      padding-right: 2rem !important;
      padding-bottom: 2rem !important;
      position: relative;
      margin-top: 0;
    }
    
    .page-title-box {
      margin-bottom: 2rem;
      padding: 1.5rem 0;
      position: relative;
      z-index: 1;
    }
    
    .step-number {
      width: 30px;
      height: 30px;
      background-color: #0d6efd;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }
    
    .step-number-large {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      margin: 0 auto;
    }
    
    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
      border-top: 1px solid #dee2e6;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    .table-hover tbody tr:hover {
      background-color: rgba(13, 110, 253, 0.05);
    }
    
    .btn {
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
    
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .card {
      border: none;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
      position: relative;
      z-index: 1;
      margin-top: 0;
      margin-bottom: 2rem;
      clear: both;
    }
    
    .card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .card-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px 12px 0 0 !important;
      position: relative;
      z-index: 1;
      background-color: #0d6efd !important;
      padding: 1.5rem;
    }
    
    .card-body {
      padding: 2rem;
    }
    
    .mb-4 {
      margin-bottom: 2.5rem !important;
    }
    
    .mb-3 {
      margin-bottom: 1.5rem !important;
    }
    
    .page-title-box {
      margin-bottom: 1.5rem;
      padding: 1rem 0;
      position: relative;
      z-index: 1;
    }
    
    .form-select, .form-control {
      border-radius: 6px;
      border: 1px solid #ced4da;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .form-select:focus, .form-control:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
    
    .badge {
      font-size: 0.875em;
      font-weight: 500;
    }
    
    .text-truncate {
      max-width: 200px;
    }
    
    .table-responsive {
      border-radius: 8px;
      overflow: hidden;
    }
    
    .fw-semibold {
      font-weight: 600;
    }
    
    .shadow-sm {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    }
    
    /* Search Card Styles */
    .search-card {
      border: 1px solid #e3f2fd;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      margin-bottom: 1.5rem;
    }
    
    .search-card .card-header {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
      border-bottom: 2px solid #0c7489;
    }
    
    .search-body {
      padding: 1.5rem;
    }
    
    .search-input-container {
      position: relative;
    }
    
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-input {
      padding-left: 3rem !important;
      padding-right: 3rem !important;
      border-radius: 50px !important;
      border: 2px solid #e9ecef;
      font-size: 1rem;
      height: 3rem;
      background: #fff;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .search-input:focus {
      border-color: #17a2b8;
      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
    
    .search-icon {
      position: absolute;
      left: 1rem;
      z-index: 10;
      color: #6c757d;
      font-size: 1.1rem;
    }
    
    .search-clear-btn {
      position: absolute;
      right: 0.5rem;
      z-index: 10;
      color: #6c757d;
      border: none;
      background: none;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
    
    .search-clear-btn:hover {
      color: #dc3545;
      background: #f8f9fa;
    }
    
    .search-field-select {
      border-radius: 12px !important;
      border: 2px solid #e9ecef;
      height: 3rem;
      background: #fff;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .search-field-select:focus {
      border-color: #17a2b8;
      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.25);
    }
    
    .search-btn {
      border-radius: 12px !important;
      height: 3rem;
      padding: 0 1.5rem;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .search-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .search-results-summary {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }
    
    .results-count {
      display: flex;
      align-items: center;
      font-size: 1rem;
    }
    
    .search-term-highlight {
      background: linear-gradient(135deg, #fff3cd, #ffeaa7);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      color: #856404;
    }
    
    .search-field-info {
      text-align: right;
    }
    
    /* Patient Avatar */
    .patient-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .patient-id {
      background: #e9ecef;
      color: #495057;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    /* Badge Styles */
    .badge {
      font-size: 0.75rem;
      padding: 0.35em 0.65em;
      border-radius: 6px;
    }
    
    .bg-gradient-info {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
    }
    
    /* Table Enhancements */
    .table {
      border-radius: 0 0 12px 12px;
      overflow: hidden;
    }
    
    .table th {
      background: #343a40 !important;
      color: white !important;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
      padding: 1rem 0.75rem;
    }
    
    .table td {
      padding: 1rem 0.75rem;
      vertical-align: middle;
    }
    
    .table-hover tbody tr:hover {
      background-color: rgba(23, 162, 184, 0.05);
    }
    
    @media (max-width: 768px) {
      .container-fluid {
        padding-top: 140px !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
        padding-bottom: 1rem !important;
      }
      
      .page-title-box {
        margin-bottom: 1.5rem;
        padding: 1rem 0;
      }
      
      .card-header {
        padding: 1rem;
      }
      
      .step-number {
        width: 25px;
        height: 25px;
        font-size: 12px;
      }
      
      .card-body {
        padding: 1.5rem;
      }
      
      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  reportType: string = '';
  dateRange: string = 'month';
  startDate: string = '';
  endDate: string = '';
  selectedProvince: string = '';
  selectedHospital: string = '';
  selectedTestType: string = '';
  selectedStatus: string = '';
  
  selectedFields: string[] = [];
  reportData: ReportData[] = [];
  filteredReportData: ReportData[] = [];
  reportGenerated: boolean = false;
  hasData: boolean = false;
  
  // Search functionality
  searchTerm: string = '';
  searchField: string = 'all';
  isSearching: boolean = false;

  provinces: string[] = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
    'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'
  ];

  hospitals: { [key: string]: string[] } = {
    'Eastern Cape': ['Frere Hospital', 'Cecilia Makiwane Hospital', 'Livingstone Hospital'],
    'Free State': ['Universitas Hospital', 'Pelonomi Hospital', 'National Hospital'],
    'Gauteng': ['Chris Hani Baragwanath Hospital', 'Charlotte Maxeke Hospital', 'Steve Biko Hospital'],
    'KwaZulu-Natal': ['Inkosi Albert Luthuli Hospital', 'Addington Hospital', 'King Edward VIII Hospital'],
    'Limpopo': ['Pietersburg Hospital', 'Mankweng Hospital', 'Tshilidzini Hospital'],
    'Mpumalanga': ['Witbank Hospital', 'Themba Hospital', 'Mapulaneng Hospital'],
    'North West': ['Klerksdorp Hospital', 'Mafikeng Hospital', 'Potchefstroom Hospital'],
    'Northern Cape': ['Kimberley Hospital', 'Upington Hospital', 'De Aar Hospital'],
    'Western Cape': ['Groote Schuur Hospital', 'Tygerberg Hospital', 'Red Cross Hospital']
  };

  testTypes: string[] = [
    'Blood Test', 'Urine Test', 'X-Ray', 'CT Scan', 'MRI',
    'Ultrasound', 'ECG', 'Biopsy', 'Colonoscopy', 'Endoscopy'
  ];

  availableFields: { key: string; label: string }[] = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'patientId', label: 'Patient ID' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'testType', label: 'Test Type' },
    { key: 'testDate', label: 'Test Date' },
    { key: 'result', label: 'Result' },
    { key: 'status', label: 'Status' },
    { key: 'province', label: 'Province' },
    { key: 'hospital', label: 'Hospital' },
    { key: 'doctorName', label: 'Doctor Name' },
    { key: 'priority', label: 'Priority' },
    { key: 'notes', label: 'Notes' }
  ];

  filteredHospitals: string[] = [];

  ngOnInit() {
    this.setDefaultDateRange();
    this.filteredHospitals = this.getAllHospitals();
  }

  setDefaultDateRange() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  getAllHospitals(): string[] {
    return Object.values(this.hospitals).flat();
  }

  onReportTypeChange() {
    // Report type changed - could be used for future enhancements
  }

  onDateRangeChange() {
    const today = new Date();
    
    switch (this.dateRange) {
      case 'today':
        this.startDate = today.toISOString().split('T')[0];
        this.endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        this.startDate = weekStart.toISOString().split('T')[0];
        this.endDate = new Date().toISOString().split('T')[0];
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        this.startDate = monthStart.toISOString().split('T')[0];
        this.endDate = new Date().toISOString().split('T')[0];
        break;
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        this.startDate = quarterStart.toISOString().split('T')[0];
        this.endDate = new Date().toISOString().split('T')[0];
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        this.startDate = yearStart.toISOString().split('T')[0];
        this.endDate = new Date().toISOString().split('T')[0];
        break;
    }
  }

  onFieldToggle(fieldKey: string) {
    // Field selection functionality removed
  }

  onProvinceChange() {
    if (this.selectedProvince) {
      this.filteredHospitals = this.hospitals[this.selectedProvince] || [];
    } else {
      this.filteredHospitals = this.getAllHospitals();
    }
    this.selectedHospital = '';
  }

  generateReport() {
    this.reportGenerated = true;
    
    // Generate sample data - in real implementation, this would come from API
    this.reportData = this.generateSampleData();
    
    // Apply filters
    this.reportData = this.applyFilters(this.reportData);
    
    // Initialize filtered data
    this.filteredReportData = [...this.reportData];
    
    this.hasData = this.reportData.length > 0;
    
    // Apply search if there's a search term
    if (this.searchTerm) {
      this.performSearch();
    }
  }

  generateSampleData(): ReportData[] {
    const sampleData: ReportData[] = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones'];
    const results = ['Normal', 'Abnormal', 'Borderline', 'Critical', 'Pending'];
    const priorities = ['High', 'Medium', 'Low', 'Urgent'];
    
    for (let i = 1; i <= 50; i++) {
      const province = this.provinces[Math.floor(Math.random() * this.provinces.length)];
      const hospital = this.hospitals[province][Math.floor(Math.random() * this.hospitals[province].length)];
      const testType = this.testTypes[Math.floor(Math.random() * this.testTypes.length)];
      
      const testDate = new Date();
      testDate.setDate(testDate.getDate() - Math.floor(Math.random() * 30));
      
      sampleData.push({
        id: i,
        patientName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        patientId: `P${String(i).padStart(6, '0')}`,
        age: Math.floor(Math.random() * 80) + 18,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        testType: testType,
        testDate: testDate.toISOString().split('T')[0],
        result: results[Math.floor(Math.random() * results.length)],
        status: ['Completed', 'Pending', 'In Progress'][Math.floor(Math.random() * 3)],
        province: province,
        hospital: hospital,
        doctorName: doctors[Math.floor(Math.random() * doctors.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        notes: `Sample notes for test ${i}`
      });
    }
    
    return sampleData;
  }

  applyFilters(data: ReportData[]): ReportData[] {
    return data.filter(item => {
      // Date range filter
      const itemDate = new Date(item.testDate);
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      
      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
      
      // Province filter
      if (this.selectedProvince && item.province !== this.selectedProvince) {
        return false;
      }
      
      // Hospital filter
      if (this.selectedHospital && item.hospital !== this.selectedHospital) {
        return false;
      }
      
      // Test type filter
      if (this.selectedTestType && item.testType !== this.selectedTestType) {
        return false;
      }
      
      // Status filter
      if (this.selectedStatus && item.status !== this.selectedStatus) {
        return false;
      }
      
      return true;
    });
  }

  getFieldValue(row: ReportData, fieldKey: string): any {
    return (row as any)[fieldKey];
  }

  exportToExcel() {
    if (!this.hasData) {
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report Data');

    const fileName = `custom-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  }

  // Search functionality methods

  // Search functionality methods
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredReportData = [...this.reportData];
    } else {
      this.performSearch();
    }
  }

  onSearchFieldChange(): void {
    if (this.searchTerm.trim() !== '') {
      this.performSearch();
    }
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReportData = [...this.reportData];
      return;
    }

    this.isSearching = true;
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const searchTerm = this.searchTerm.toLowerCase().trim();
      
      this.filteredReportData = this.reportData.filter(item => {
        if (this.searchField === 'all') {
          // Search in all fields
          return this.searchInAllFields(item, searchTerm);
        } else {
          // Search in specific field
          const fieldValue = this.getFieldValue(item, this.searchField);
          return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm);
        }
      });
      
      this.isSearching = false;
    }, 300);
  }

  searchInAllFields(item: ReportData, searchTerm: string): boolean {
    const searchableFields = [
      'patientName', 'patientId', 'testType', 'result', 'status',
      'hospital', 'doctorName', 'province', 'priority', 'notes'
    ];
    
    return searchableFields.some(field => {
      const value = this.getFieldValue(item, field);
      return value && value.toString().toLowerCase().includes(searchTerm);
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchField = 'all';
    this.filteredReportData = [...this.reportData];
  }

  getSearchFieldLabel(): string {
    const fieldLabels: { [key: string]: string } = {
      'all': 'All Fields',
      'patientName': 'Patient Name',
      'patientId': 'Patient ID',
      'testType': 'Test Type',
      'hospital': 'Hospital',
      'doctorName': 'Doctor',
      'result': 'Result',
      'status': 'Status'
    };
    
    return fieldLabels[this.searchField] || 'All Fields';
  }

  getResultBadgeClass(result: string): string {
    switch (result.toLowerCase()) {
      case 'normal':
        return 'bg-success';
      case 'abnormal':
        return 'bg-warning';
      case 'critical':
        return 'bg-danger';
      case 'pending':
        return 'bg-secondary';
      default:
        return 'bg-info';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'in progress':
        return 'bg-primary';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  trackByFn(index: number, item: ReportData): number {
    return item.id;
  }

  clearFilters() {
    this.reportType = '';
    this.selectedProvince = '';
    this.selectedHospital = '';
    this.selectedTestType = '';
    this.selectedStatus = '';
    this.reportData = [];
    this.filteredReportData = [];
    this.reportGenerated = false;
    this.hasData = false;
    this.searchTerm = '';
    this.searchField = 'all';
    this.setDefaultDateRange();
    this.filteredHospitals = this.getAllHospitals();
  }
}
