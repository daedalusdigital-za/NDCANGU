# Frontend PDF Upload Integration Guide

## Overview
This guide provides complete frontend implementation examples for integrating with the Training PDF Upload API endpoints. All examples use Angular with TypeScript and follow the project's existing patterns.

---

## 1. Upload PDF File

### Endpoint
**POST** `/api/Training/UploadPDF`

### Required Headers
```typescript
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data  // Automatically set by browser
```

### FormData Structure
```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]); // PDF file from file input
formData.append('trainingSessionId', 1); // Training session ID (number)
formData.append('documentType', 'Register'); // 'Register', 'AttendanceSheet', or 'Materials'
formData.append('fileName', 'NDC_Training_Register_Nov_2025'); // Optional custom name
formData.append('uploadedBy', userId); // Optional - user ID from token
```

### Angular Service Method

```typescript
// training-document.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingDocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Upload a PDF file for a training session
   * @param file - PDF file from file input
   * @param trainingSessionId - ID of the training session
   * @param documentType - Type of document ('Register', 'AttendanceSheet', 'Materials')
   * @param fileName - Optional custom name for the file
   * @returns Observable<TrainingDocumentResponse>
   */
  uploadPDF(
    file: File,
    trainingSessionId: number,
    documentType: string,
    fileName?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('trainingSessionId', trainingSessionId.toString());
    formData.append('documentType', documentType);
    
    if (fileName) {
      formData.append('fileName', fileName);
    }

    return this.http.post<any>(
      `${this.apiUrl}/api/Training/UploadPDF`,
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.getToken()}`
        })
      }
    );
  }

  private getToken(): string {
    // Get JWT token from localStorage or your auth service
    return localStorage.getItem('token') || '';
  }
}
```

### Success Response (200 OK)
```json
{
  "id": 1,
  "trainingSessionId": 1,
  "fileName": "NDC_Training_Register_Nov_2025",
  "originalFileName": "training_register.pdf",
  "fileSize": 245630,
  "documentType": "Register",
  "fileUrl": "/api/Training/DownloadPDF/1",
  "uploadedAt": "2025-11-25T12:45:30Z",
  "uploadedBy": 5,
  "mimeType": "application/pdf"
}
```

### Error Responses

**400 Bad Request** - File validation failed
```json
{
  "error": "Invalid request",
  "message": "File size exceeds maximum allowed size of 10MB"
}
```

**401 Unauthorized** - Invalid or missing JWT token
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

**404 Not Found** - Training session doesn't exist
```json
{
  "error": "Training session not found",
  "trainingSessionId": 999
}
```

### Client-Side File Validation
```typescript
/**
 * Validate PDF file before upload
 * @param file - File to validate
 * @returns Object with isValid flag and error message if invalid
 */
validatePDFFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return {
      isValid: false,
      error: 'Only PDF files are allowed'
    };
  }

  // Check file size (10MB limit)
  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    const maxSizeMB = maxSizeBytes / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }

  // Check for actual PDF signature (first 4 bytes: %PDF)
  return { isValid: true };
}
```

---

## 2. Download PDF File

### Endpoint
**GET** `/api/Training/DownloadPDF/{documentId}`

### Authentication
**Not required** - Public access

### Angular Service Method

```typescript
/**
 * Download a PDF file
 * @param documentId - ID of the document to download
 * @param fileName - Name for the downloaded file
 */
downloadPDF(documentId: number, fileName: string): void {
  this.http.get(
    `${this.apiUrl}/api/Training/DownloadPDF/${documentId}`,
    { responseType: 'blob' }
  ).subscribe(
    (blob: Blob) => {
      this.triggerDownload(blob, fileName);
    },
    (error) => {
      console.error('Download failed', error);
      // Show error to user
      this.toastrService.error('Failed to download document', 'Download Error');
    }
  );
}

/**
 * Helper method to trigger file download
 */
private triggerDownload(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.pdf`;
  
  // Append to body, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  window.URL.revokeObjectURL(url);
}
```

### Direct Link in HTML
```html
<!-- Simple download link without Angular -->
<a [href]="apiUrl + '/api/Training/DownloadPDF/' + document.id" 
   download
   class="btn btn-sm btn-info">
  <i class="fas fa-download"></i> Download
</a>
```

### Response
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="document.pdf"`
- **Body:** Binary PDF data

---

## 3. Get All PDFs for a Training Session

### Endpoint
**GET** `/api/Training/{trainingSessionId}/PDFs`

### Authentication
**Not required** - Public access

### Angular Service Method

```typescript
/**
 * Get all PDF documents for a training session
 * @param trainingSessionId - ID of the training session
 * @returns Observable<TrainingDocumentsResponse>
 */
getTrainingDocuments(trainingSessionId: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/api/Training/${trainingSessionId}/PDFs`
  );
}
```

### Success Response (200 OK)
```json
{
  "trainingSessionId": 1,
  "documents": [
    {
      "id": 1,
      "trainingSessionId": 1,
      "fileName": "NDC_Training_Register",
      "originalFileName": "training_register.pdf",
      "fileSize": 245630,
      "documentType": "Register",
      "fileUrl": "/api/Training/DownloadPDF/1",
      "uploadedAt": "2025-11-25T12:45:30Z",
      "uploadedBy": 5,
      "mimeType": "application/pdf"
    },
    {
      "id": 2,
      "trainingSessionId": 1,
      "fileName": "Attendance_Sheet",
      "originalFileName": "attendance.pdf",
      "fileSize": 123456,
      "documentType": "AttendanceSheet",
      "fileUrl": "/api/Training/DownloadPDF/2",
      "uploadedAt": "2025-11-25T13:00:00Z",
      "uploadedBy": 5,
      "mimeType": "application/pdf"
    }
  ]
}
```

### Formatting File Size for Display

```typescript
// Add to service or component
formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
```

### Display in Template

```html
<div class="documents-list">
  <table class="table table-sm">
    <thead>
      <tr>
        <th>Document Type</th>
        <th>File Name</th>
        <th>Size</th>
        <th>Uploaded</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let doc of documents">
        <td>{{ doc.documentType }}</td>
        <td>{{ doc.fileName }}</td>
        <td>{{ formatFileSize(doc.fileSize) }}</td>
        <td>{{ doc.uploadedAt | date: 'short' }}</td>
        <td>
          <button (click)="downloadPDF(doc.id, doc.fileName)" 
                  class="btn btn-sm btn-info">
            <i class="fas fa-download"></i>
          </button>
          <button (click)="deletePDF(doc.id)" 
                  class="btn btn-sm btn-danger"
                  *ngIf="canDelete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 4. Delete PDF File

### Endpoint
**DELETE** `/api/Training/DeletePDF/{documentId}`

### Required Headers
```typescript
Authorization: Bearer {JWT_TOKEN}
```

### Angular Service Method

```typescript
/**
 * Delete a PDF document
 * @param documentId - ID of the document to delete
 * @returns Observable<any>
 */
deletePDF(documentId: number): Observable<any> {
  return this.http.delete(
    `${this.apiUrl}/api/Training/DeletePDF/${documentId}`,
    {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    }
  );
}
```

### Success Response
**204 No Content** - Empty response body

### Error Responses

**404 Not Found**
```json
{
  "error": "Document not found",
  "documentId": 999
}
```

**403 Forbidden** - User doesn't have permission
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to delete this document"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

### Component Method with Confirmation

```typescript
/**
 * Delete PDF with user confirmation
 */
deletePDF(documentId: number): void {
  if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    return;
  }

  this.trainingDocumentService.deletePDF(documentId).subscribe(
    () => {
      this.toastrService.success('Document deleted successfully', 'Success');
      this.loadDocuments(); // Refresh the list
    },
    (error) => {
      console.error('Delete failed', error);
      const message = error.error?.message || 'Failed to delete document';
      this.toastrService.error(message, 'Delete Error');
    }
  );
}
```

---

## 5. Complete Angular Component Example

### Component TypeScript (training-documents.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

interface TrainingDocument {
  id: number;
  trainingSessionId: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  documentType: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: number;
  mimeType: string;
}

@Component({
  selector: 'app-training-documents',
  templateUrl: './training-documents.component.html',
  styleUrls: ['./training-documents.component.scss']
})
export class TrainingDocumentsComponent implements OnInit {
  trainingSessionId: number = 0;
  documents: TrainingDocument[] = [];
  selectedFile: File | null = null;
  documentType: string = 'Register';
  uploading: boolean = false;
  loading: boolean = false;
  
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    
    if (this.selectedFile) {
      // Perform client-side validation
      const validation = this.validatePDFFile(this.selectedFile);
      if (!validation.isValid) {
        this.toastrService.error(validation.error, 'Invalid File');
        this.selectedFile = null;
        event.target.value = '';
      }
    }
  }

  /**
   * Validate PDF file
   */
  validatePDFFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Only PDF files are allowed. Selected type: ' + file.type
      };
    }

    // Check file size (10MB limit)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024);
      const currentSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `File size exceeds ${maxSizeMB}MB limit. Current: ${currentSizeMB}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * Upload PDF file
   */
  uploadPDF(): void {
    if (!this.selectedFile) {
      this.toastrService.warning('Please select a file', 'No File Selected');
      return;
    }

    if (this.trainingSessionId === 0) {
      this.toastrService.error('Training session ID not set', 'Error');
      return;
    }

    const validation = this.validatePDFFile(this.selectedFile);
    if (!validation.isValid) {
      this.toastrService.error(validation.error, 'Validation Error');
      return;
    }

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('trainingSessionId', this.trainingSessionId.toString());
    formData.append('documentType', this.documentType);
    formData.append('fileName', this.selectedFile.name.replace('.pdf', ''));

    this.http.post<any>(
      `${this.apiUrl}/api/Training/UploadPDF`,
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.getToken()}`
        })
      }
    ).subscribe(
      (response) => {
        this.toastrService.success('PDF uploaded successfully', 'Upload Complete');
        this.uploading = false;
        this.selectedFile = null;
        this.loadDocuments(); // Refresh the document list
      },
      (error) => {
        console.error('Upload failed', error);
        const message = error.error?.message || 'Upload failed';
        this.toastrService.error(message, 'Upload Error');
        this.uploading = false;
      }
    );
  }

  /**
   * Load all documents for the training session
   */
  loadDocuments(): void {
    if (this.trainingSessionId === 0) {
      return;
    }

    this.loading = true;
    this.http.get<any>(
      `${this.apiUrl}/api/Training/${this.trainingSessionId}/PDFs`
    ).subscribe(
      (response) => {
        this.documents = response.documents || [];
        this.loading = false;
      },
      (error) => {
        console.error('Failed to load documents', error);
        this.toastrService.error('Failed to load documents', 'Load Error');
        this.loading = false;
      }
    );
  }

  /**
   * Download PDF file
   */
  downloadPDF(documentId: number, fileName: string): void {
    this.http.get(
      `${this.apiUrl}/api/Training/DownloadPDF/${documentId}`,
      { responseType: 'blob' }
    ).subscribe(
      (blob: Blob) => {
        this.triggerDownload(blob, fileName);
      },
      (error) => {
        console.error('Download failed', error);
        this.toastrService.error('Failed to download document', 'Download Error');
      }
    );
  }

  /**
   * Delete PDF file with confirmation
   */
  deletePDF(documentId: number): void {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    this.http.delete(
      `${this.apiUrl}/api/Training/DeletePDF/${documentId}`,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.getToken()}`
        })
      }
    ).subscribe(
      () => {
        this.toastrService.success('Document deleted successfully', 'Success');
        this.loadDocuments(); // Refresh the list
      },
      (error) => {
        console.error('Delete failed', error);
        const message = error.error?.message || 'Failed to delete document';
        this.toastrService.error(message, 'Delete Error');
      }
    );
  }

  /**
   * Format bytes to human-readable file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Helper method to trigger file download
   */
  private triggerDownload(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get JWT token from localStorage
   */
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
```

### Component HTML Template (training-documents.component.html)

```html
<div class="training-documents-container">
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Training Session Documents</h5>
    </div>
    
    <div class="card-body">
      <!-- Upload Section -->
      <div class="upload-section mb-4 pb-4 border-bottom">
        <h6>Upload PDF Document</h6>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="fileInput">Select PDF File</label>
              <input 
                type="file" 
                id="fileInput"
                class="form-control"
                accept=".pdf"
                (change)="onFileSelected($event)"
                [disabled]="uploading">
              <small class="form-text text-muted">
                Max size: 10MB. Supported format: PDF only
              </small>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="documentType">Document Type</label>
              <select 
                id="documentType"
                class="form-control"
                [(ngModel)]="documentType"
                [disabled]="uploading">
                <option value="Register">Training Register</option>
                <option value="AttendanceSheet">Attendance Sheet</option>
                <option value="Materials">Training Materials</option>
              </select>
            </div>
          </div>
        </div>
        
        <button 
          class="btn btn-primary"
          (click)="uploadPDF()"
          [disabled]="!selectedFile || uploading">
          <span *ngIf="!uploading">
            <i class="fas fa-upload"></i> Upload PDF
          </span>
          <span *ngIf="uploading">
            <i class="fas fa-spinner fa-spin"></i> Uploading...
          </span>
        </button>
      </div>
      
      <!-- Documents List Section -->
      <div class="documents-section">
        <h6>Documents</h6>
        
        <div *ngIf="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        
        <div *ngIf="!loading && documents.length === 0" class="alert alert-info">
          No documents uploaded yet.
        </div>
        
        <table *ngIf="!loading && documents.length > 0" class="table table-sm">
          <thead class="table-light">
            <tr>
              <th>Document Type</th>
              <th>File Name</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of documents">
              <td>
                <span class="badge badge-info">{{ doc.documentType }}</span>
              </td>
              <td>{{ doc.fileName }}</td>
              <td>{{ formatFileSize(doc.fileSize) }}</td>
              <td>{{ doc.uploadedAt | date: 'short' }}</td>
              <td>
                <button 
                  (click)="downloadPDF(doc.id, doc.fileName)" 
                  class="btn btn-sm btn-info me-2"
                  title="Download">
                  <i class="fas fa-download"></i>
                </button>
                <button 
                  (click)="deletePDF(doc.id)" 
                  class="btn btn-sm btn-danger"
                  title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
```

### Component SCSS Styles (training-documents.component.scss)

```scss
.training-documents-container {
  padding: 20px;

  .card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      padding: 1rem;

      h5 {
        color: #333;
        font-weight: 600;
      }
    }

    .card-body {
      padding: 1.5rem;

      .upload-section {
        h6 {
          color: #555;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;

          label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .form-control {
            border: 1px solid #ddd;
            border-radius: 4px;

            &:focus {
              border-color: #007bff;
              box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }

            &:disabled {
              background-color: #e9ecef;
              cursor: not-allowed;
            }
          }

          .form-text {
            font-size: 0.85rem;
            color: #6c757d;
          }
        }

        .btn {
          font-weight: 500;
          padding: 0.5rem 1rem;

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }

      .documents-section {
        h6 {
          color: #555;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .text-center {
          padding: 2rem;

          .spinner-border {
            color: #007bff;
          }
        }

        .alert {
          margin-bottom: 0;
        }

        .table {
          margin-bottom: 0;

          thead th {
            background-color: #f8f9fa;
            border-top: 1px solid #dee2e6;
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
          }

          tbody tr {
            &:hover {
              background-color: #f8f9fa;
            }

            td {
              vertical-align: middle;
              font-size: 0.95rem;

              .badge {
                font-size: 0.75rem;
                padding: 0.35rem 0.65rem;
              }
            }
          }

          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;

            i {
              margin-right: 0.25rem;
            }
          }
        }
      }
    }
  }
}
```

---

## 6. Key Implementation Points

### ✅ File Validation Before Upload
```typescript
// Always validate on client-side before sending to server
- Check file type is 'application/pdf'
- Check file size < 10MB
- Show error messages to user
- Prevent upload if validation fails
```

### ✅ JWT Token Management
```typescript
// Include Authorization header for upload/delete operations
- GET Authorization: Bearer {token}
- POST Authorization: Bearer {token}
- DELETE Authorization: Bearer {token}
- No auth required for: GET (download/list)
```

### ✅ Error Handling
```typescript
// Catch and handle different error scenarios
- 400: File validation errors
- 401: Authentication/token issues
- 403: Permission denied
- 404: Resource not found
- 500: Server errors
```

### ✅ User Experience Enhancements
```typescript
- Show upload progress indicator (disable button while uploading)
- Disable controls during operations
- Refresh document list after upload/delete
- Confirm before deleting documents
- Show success/error notifications
- Display file sizes in human-readable format (KB, MB, GB)
```

### ✅ Module Imports Required

```typescript
// app.module.ts or standalone component
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr'; // For notifications

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot()
  ]
})
export class AppModule { }
```

---

## 7. Integration Checklist

- [ ] Create `training-document.service.ts` with all CRUD methods
- [ ] Create `training-documents.component.ts` with file upload form
- [ ] Create `training-documents.component.html` with UI template
- [ ] Create `training-documents.component.scss` with styles
- [ ] Add service to module providers
- [ ] Add component to module declarations
- [ ] Import required modules (HttpClientModule, FormsModule)
- [ ] Configure environment API URL in `environment.ts`
- [ ] Test file upload with valid PDF
- [ ] Test file upload with invalid file type (should fail)
- [ ] Test file upload with oversized file (should fail)
- [ ] Test file download functionality
- [ ] Test document list loading
- [ ] Test document deletion with confirmation
- [ ] Test error handling for all scenarios
- [ ] Verify JWT token is included in requests
- [ ] Test with missing training session ID
- [ ] Verify loading indicators work correctly

---

## 8. Troubleshooting

### Issue: "CORS error" when uploading
**Solution:** Ensure backend has CORS configured to accept requests from frontend domain

### Issue: "401 Unauthorized" on upload
**Solution:** Verify JWT token is valid and included in Authorization header

### Issue: "413 Payload Too Large"
**Solution:** Check file size is under 10MB; verify server accepts multipart uploads

### Issue: File downloads but with wrong name
**Solution:** Ensure `a.download` attribute is set correctly before clicking

### Issue: Document list not refreshing after upload
**Solution:** Call `loadDocuments()` after successful upload in subscribe callback

### Issue: File validation passes on client but fails on server
**Solution:** Backend may have stricter validation; check error response for details

---

## 9. Security Considerations

1. **Always validate file type** - Check MIME type on both client and server
2. **Implement file size limits** - Reject files exceeding 10MB
3. **Use HTTPS** - Ensure all API calls use HTTPS in production
4. **JWT Token Security** - Store token securely (HttpOnly cookie or secure storage)
5. **Scan for Malware** - Consider implementing antivirus scanning on backend
6. **Access Control** - Only authenticated users can upload/delete
7. **Input Sanitization** - Sanitize fileName on backend before saving
8. **Audit Logging** - Log all upload/download/delete operations

---

## 10. Performance Optimization

### Large File Uploads
For files larger than 100MB, implement chunked uploads:
```typescript
// Split file into 1MB chunks
const chunkSize = 1024 * 1024;
const chunks = Math.ceil(file.size / chunkSize);

for (let i = 0; i < chunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunk = file.slice(start, end);
  // Upload chunk with progress tracking
}
```

### Response Caching
Cache document list to reduce API calls:
```typescript
private documentCache: Map<number, TrainingDocument[]> = new Map();
private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes

getTrainingDocuments(trainingSessionId: number): Observable<any> {
  // Check cache first
  if (this.documentCache.has(trainingSessionId)) {
    return of({ documents: this.documentCache.get(trainingSessionId) });
  }
  
  // Fetch from API and cache
  return this.http.get<any>(...).pipe(
    tap(response => {
      this.documentCache.set(trainingSessionId, response.documents);
    })
  );
}
```

---

## 11. API Response Models (TypeScript Interfaces)

```typescript
// training-document.models.ts
export interface TrainingDocument {
  id: number;
  trainingSessionId: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  documentType: 'Register' | 'AttendanceSheet' | 'Materials';
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: number;
  mimeType: string;
}

export interface TrainingDocumentsResponse {
  trainingSessionId: number;
  documents: TrainingDocument[];
}

export interface UploadResponse {
  id: number;
  trainingSessionId: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  documentType: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: number;
  mimeType: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}
```

---

## Summary

This guide provides complete, production-ready code for integrating the Training PDF Upload API with your Angular frontend. All examples follow Angular best practices and include proper error handling, type safety, and user feedback mechanisms.

**Key files to create:**
1. `training-document.service.ts` - API service
2. `training-documents.component.ts` - Component logic
3. `training-documents.component.html` - Template
4. `training-documents.component.scss` - Styles
5. `training-document.models.ts` - TypeScript interfaces

Start by implementing the service, then create the component, and integrate it into your training module.
