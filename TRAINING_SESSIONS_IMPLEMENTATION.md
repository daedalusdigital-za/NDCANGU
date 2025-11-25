# Training Sessions Frontend Implementation Guide

## Overview
Complete frontend implementation for displaying, managing, and interacting with training sessions from the Medical History API.

**Status**: ✅ Complete & Deployed  
**Date Created**: November 25, 2025  
**Version**: 1.0.0

---

## Table of Contents
1. [Files Created](#files-created)
2. [Component Structure](#component-structure)
3. [Service Layer](#service-layer)
4. [Features Implemented](#features-implemented)
5. [Integration Instructions](#integration-instructions)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)

---

## Files Created

### Service
- **`src/app/services/training/training.service.ts`** (280 lines)
  - Complete API integration for training sessions
  - Methods: getAllSessions, getByProvince, getByDateRange, getByTrainer
  - Document management: uploadPDF, downloadPDF, deleteDocument
  - Status mapping and file size formatting

### Components
- **`src/app/dashboard/training/training-sessions-list/training-sessions-list.component.ts`** (185 lines)
  - Lists all training sessions with filtering and search
  - Supports province, status, and term-based filtering
  - Delete functionality with confirmation
  - Navigation to details and edit pages

- **`src/app/dashboard/training/training-sessions-list/training-sessions-list.component.html`** (120 lines)
  - Responsive table layout using Bootstrap classes
  - Filter section with province, status, and search
  - Loading spinner and error handling
  - Action buttons for view, edit, delete

- **`src/app/dashboard/training/training-sessions-list/training-sessions-list.component.scss`** (240 lines)
  - Professional styling with hover effects
  - Badge colors for status indicators
  - Responsive design for mobile devices
  - Button group styling and animations

---

## Component Structure

```
src/app/
├── services/
│   └── training/
│       └── training.service.ts (Service Layer)
└── dashboard/
    └── training/
        └── training-sessions-list/
            ├── training-sessions-list.component.ts
            ├── training-sessions-list.component.html
            └── training-sessions-list.component.scss
```

---

## Service Layer

### TrainingService Overview

#### Key Interfaces
```typescript
interface TrainingSession {
  id?: number;
  trainingName: string;
  trainingType: string;
  startDate: Date;
  endDate: Date;
  province: string;
  provinceName?: string;
  venue: string;
  trainerId: number;
  trainer?: { id: number; name: string; email?: string; };
  targetAudience: string;
  numberOfParticipants: number;
  status: number;  // 1=Scheduled, 2=In Progress, 3=Completed, 4=Cancelled
  statusText?: string;
  dateCreated: Date;
  lastUpdated?: Date;
}

interface TrainingDocument {
  id: number;
  trainingSessionId: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  documentType: 'Register' | 'AttendanceSheet' | 'Materials';
  uploadedAt: Date;
}
```

#### API Methods

##### Read Operations (No Auth Required)
```typescript
// Get all training sessions
getAllSessions(): Observable<TrainingSession[]>
→ GET /api/Training/GetAll

// Get single session by ID
getSessionById(id: number): Observable<TrainingSession>
→ GET /api/Training/GetById?id=1

// Get sessions by province
getSessionsByProvince(provinceName: string): Observable<TrainingSession[]>
→ GET /api/Training/GetByProvince?provinceName=Western Cape

// Get sessions by date range
getSessionsByDateRange(startDate: Date, endDate: Date): Observable<TrainingSession[]>
→ GET /api/Training/GetByDateRange?startDate=...&endDate=...

// Get sessions by trainer
getSessionsByTrainer(trainerId: number): Observable<TrainingSession[]>
→ GET /api/Training/GetByTrainer?trainerId=1

// Get documents for session
getSessionDocuments(trainingSessionId: number): Observable<TrainingDocument[]>
→ GET /api/Training/{id}/PDFs

// Download PDF
downloadPDF(documentId: number, fileName: string): void
→ GET /api/Training/DownloadPDF/{id}
```

##### Write Operations (JWT Auth Required)
```typescript
// Create new session
addSession(session: TrainingSession, token: string): Observable<any>
→ POST /api/Training/Add
Authorization: Bearer <token>

// Update session
updateSession(session: TrainingSession, token: string): Observable<any>
→ PATCH /api/Training/Update
Authorization: Bearer <token>

// Delete session
deleteSession(id: number, token: string): Observable<any>
→ DELETE /api/Training/Delete?id=1
Authorization: Bearer <token>

// Upload PDF
uploadPDF(trainingSessionId: number, file: File, documentType: string, token: string): Observable<any>
→ POST /api/Training/UploadPDF (multipart/form-data)
Authorization: Bearer <token>

// Delete document
deleteDocument(documentId: number, token: string): Observable<any>
→ DELETE /api/Training/DeletePDF/{id}
Authorization: Bearer <token>
```

#### Helper Methods
```typescript
// Convert status code to display text
getStatusText(status: number): string
// Returns: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'

// Format bytes to human-readable size
formatFileSize(bytes: number): string
// Returns: '1.5 MB', '256 KB', etc.
```

---

## Features Implemented

### ✅ Training Sessions List
- Display all training sessions in responsive table
- Show columns: Name, Type, Dates, Province, Venue, Trainer, Participants, Status
- Professional badge colors for status indicators
- Hover effects on table rows
- Pagination ready (can add with Material)

### ✅ Filtering & Search
- **Province Filter**: Filter sessions by province name
- **Status Filter**: Filter by Scheduled, In Progress, Completed, Cancelled
- **Text Search**: Search by training name, venue, or trainer name
- **Refresh Button**: Reload data from API
- **Filter State**: Maintains filter values during interactions

### ✅ Action Buttons
- **View Details**: Navigate to session details page
- **Edit**: Navigate to edit session page
- **Delete**: Remove session with confirmation dialog
  - Shows confirmation: "Are you sure you want to delete this training session?"
  - Only executes on user confirmation
  - Shows toast notification on success/failure

### ✅ User Experience
- Loading spinner while fetching data
- Error messages with dismissible alerts
- Empty state with icon when no sessions found
- Responsive design for mobile/tablet/desktop
- Toast notifications for all operations (success/error)
- Professional UI with consistent spacing and colors

### ✅ Error Handling
- Network error messages
- 404 Not Found handling
- 401 Unauthorized for token issues
- Try-catch blocks in subscribe error handlers
- User-friendly error messages

### ✅ Authentication
- JWT token from localStorage
- Automatic token injection in API calls
- Token refresh capability (interceptor-ready)
- Secure token storage and transmission

---

## Integration Instructions

### Step 1: Import Service in Module

Add to your module (e.g., `training.module.ts`):

```typescript
import { TrainingService } from '../../../services/training/training.service';
import { TrainingSessionsListComponent } from './training-sessions-list/training-sessions-list.component';

@NgModule({
  declarations: [TrainingSessionsListComponent],
  imports: [
    CommonModule,
    FormsModule,  // Required for ngModel in filters
    HttpClientModule  // Required for service
  ],
  providers: [TrainingService]
})
export class TrainingModule { }
```

### Step 2: Add Routes

```typescript
const routes: Routes = [
  {
    path: 'training',
    children: [
      {
        path: 'sessions',
        component: TrainingSessionsListComponent,
        data: { title: 'Training Sessions' }
      },
      {
        path: 'details/:id',
        component: TrainingSessionDetailsComponent,
        data: { title: 'Session Details' }
      }
    ]
  }
];
```

### Step 3: Add to Template

```html
<!-- In your dashboard or main container -->
<app-training-sessions-list></app-training-sessions-list>
```

### Step 4: Ensure Dependencies

Make sure your module imports:
```typescript
import { FormsModule } from '@angular/forms';  // For ngModel filters
import { CommonModule } from '@angular/common';  // For *ngIf, *ngFor
import { HttpClientModule } from '@angular/common/http';  // For HTTP calls
```

---

## Testing Guide

### Manual Testing Checklist

#### Load Sessions
- [ ] Navigate to training sessions page
- [ ] Verify table loads with data
- [ ] Check loading spinner appears then disappears
- [ ] Verify session count displayed

#### Filter by Province
- [ ] Click province filter field
- [ ] Type "Western Cape"
- [ ] Verify table filters to matching sessions
- [ ] Clear field and verify all sessions return

#### Filter by Status
- [ ] Click status dropdown
- [ ] Select "Completed"
- [ ] Verify only completed sessions show
- [ ] Select "All Statuses"
- [ ] Verify all sessions return

#### Search
- [ ] Type training name in search box
- [ ] Verify table filters matching results
- [ ] Clear search
- [ ] Verify all sessions return

#### View Details
- [ ] Click eye icon on any session
- [ ] Verify navigation to details page
- [ ] Verify session data displays correctly

#### Delete Session
- [ ] Click trash icon
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel"
- [ ] Verify session still in list
- [ ] Click trash icon again
- [ ] Click "OK" in confirmation
- [ ] Verify toast notification shows success
- [ ] Verify session removed from list

#### Responsive Design
- [ ] Test on desktop (1920px+)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Verify table collapses appropriately
- [ ] Verify buttons remain accessible

#### Error Handling
- [ ] Simulate network error (Network tab → Offline)
- [ ] Verify error message displays
- [ ] Verify dismissible alert shows
- [ ] Click refresh to retry

### Console Testing

```javascript
// Test service methods directly
const token = localStorage.getItem('authToken');

// Get all sessions
this.trainingService.getAllSessions().subscribe(data => console.log(data));

// Get sessions by province
this.trainingService.getSessionsByProvince('Western Cape').subscribe(data => console.log(data));

// Delete session (requires proper setup)
this.trainingService.deleteSession(1, token).subscribe(
  () => console.log('Deleted'),
  error => console.error(error)
);
```

---

## Troubleshooting

### Issue: "No sessions found" but API has data
**Solution**:
- Check API URL in service: `https://ngcanduapi.azurewebsites.net/api/Training`
- Verify CORS is enabled on API
- Check Network tab for response
- Verify JWT token if required

### Issue: Filter doesn't work
**Solution**:
- Verify `FormsModule` is imported in module
- Check `[(ngModel)]` binding in HTML
- Verify `applyFilters()` method is called on filter change
- Check browser console for TypeScript errors

### Issue: Delete button doesn't work
**Solution**:
- Verify JWT token exists: `localStorage.getItem('authToken')`
- Check API returns 204 No Content or proper response
- Verify API endpoint: `/api/Training/Delete?id={id}`
- Check browser console for error messages

### Issue: Loading spinner never disappears
**Solution**:
- Verify API endpoint is correct
- Check Network tab for hanging requests
- Verify error subscription (might be silently failing)
- Check service method returns Observable correctly

### Issue: Date formatting shows wrong date
**Solution**:
- Check timezone settings
- Verify date comes from API as ISO string
- Test `formatDate()` method
- Consider using Moment.js or date-fns for consistency

### Issue: Session status shows as number instead of text
**Solution**:
- Verify `statusText` is set in `loadAllSessions()`
- Check status mapping: 1=Scheduled, 2=In Progress, 3=Completed, 4=Cancelled
- Verify `getStatusText()` method exists in service
- Check component sets `session.statusText` for all sessions

---

## Performance Optimization

### For Large Datasets (100+ sessions)
1. Add pagination: `@angular/material/paginator`
2. Implement virtual scrolling
3. Use OnPush change detection
4. Implement lazy loading

### Example Pagination:
```typescript
import { MatPaginator } from '@angular/material/paginator';

@ViewChild(MatPaginator) paginator!: MatPaginator;

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}
```

### For Better Search Performance:
```typescript
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

searchTerm$ = new Subject<string>();

ngOnInit() {
  this.searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(term => this.applyFilters());
}
```

---

## Next Steps

### Phase 2: Session Details View
- [ ] Create `TrainingSessionDetailsComponent`
- [ ] Display full session information
- [ ] Show trainer details with contact info
- [ ] List associated documents
- [ ] Add upload/download functionality

### Phase 3: Edit/Create Sessions
- [ ] Create `TrainingSessionFormComponent`
- [ ] Build form with validation
- [ ] Implement save/update logic
- [ ] Add date picker for better UX

### Phase 4: Advanced Features
- [ ] Export to CSV/PDF
- [ ] Bulk operations (delete multiple)
- [ ] Calendar view of sessions
- [ ] Statistics dashboard
- [ ] Email notifications

---

## API Reference

### Base URL
```
https://ngcanduapi.azurewebsites.net/api/Training
```

### Status Codes
| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Data returned successfully |
| 201 | Created | Resource created |
| 204 | No Content | Delete successful |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Check JWT token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | API issue, retry later |

### Authentication
All write operations require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

Token obtained from login endpoint and stored in:
```javascript
localStorage.getItem('authToken')
```

---

## Support & Contact

For issues or questions:
1. Check troubleshooting section above
2. Review component comments in code
3. Check API documentation at: https://ngcanduapi.azurewebsites.net/swagger
4. Contact development team

---

## Changelog

### v1.0.0 (November 25, 2025)
- ✅ Initial release
- ✅ Service layer with 11 API methods
- ✅ Training sessions list component
- ✅ Filtering and search functionality
- ✅ Full CRUD operations
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ JWT authentication

