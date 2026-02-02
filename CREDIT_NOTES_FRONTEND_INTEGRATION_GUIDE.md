# Credit Notes Frontend Integration Guide

## 🎯 Quick Start for Frontend Team

**API Base URL:** `https://ngcanduapi.azurewebsites.net/api`

**Status:** ✅ Live and Ready for Integration

---

## 📋 All 11 Endpoints

### Phase 1: Core Operations

#### 1. GET All Credit Notes
```
GET /api/creditnotes
```

**Query Parameters:**
```
?status=Pending           // Filter by status
&customerId=1             // Filter by customer
&invoiceId=1              // Filter by invoice
&dateFrom=2026-01-01      // Filter by date range
&dateTo=2026-02-02
&search=text              // Search in reason/number
```

**Headers Required:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "creditNoteNumber": "CN-2026-001",
      "invoiceId": 1,
      "customerId": 1,
      "creditAmount": 500.00,
      "originalInvoiceAmount": 1000.00,
      "reason": "Damaged goods",
      "status": "Pending",
      "approvedBy": null,
      "approvedDate": null,
      "createdDate": "2026-02-02T12:03:00Z",
      "createdBy": "user@example.com"
    }
  ],
  "message": "Credit notes retrieved successfully",
  "isSuccess": true
}
```

---

#### 2. POST Create Credit Note
```
POST /api/creditnotes
```

**Request Body:**
```json
{
  "invoiceId": 1,
  "customerId": 1,
  "creditAmount": 500.00,
  "reason": "Product defect"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 1,
    "creditNoteNumber": "CN-2026-001",
    "invoiceId": 1,
    "customerId": 1,
    "creditAmount": 500.00,
    "status": "Pending",
    "createdDate": "2026-02-02T12:03:00Z"
  },
  "message": "Credit note created successfully",
  "isSuccess": true
}
```

---

#### 3. GET Specific Credit Note
```
GET /api/creditnotes/{id}
```

**Example:** `/api/creditnotes/1`

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "creditNoteNumber": "CN-2026-001",
    "invoiceId": 1,
    "customerId": 1,
    "creditAmount": 500.00,
    "originalInvoiceAmount": 1000.00,
    "reason": "Damaged goods",
    "status": "Pending",
    "approvedBy": null,
    "approvedDate": null,
    "rejectedBy": null,
    "rejectedDate": null,
    "documentUrl": null,
    "documentFileName": null,
    "createdDate": "2026-02-02T12:03:00Z",
    "createdBy": "user@example.com"
  },
  "message": "Credit note retrieved successfully",
  "isSuccess": true
}
```

---

### Phase 2: Management Operations

#### 4. PATCH Update Credit Note
```
PATCH /api/creditnotes/{id}
```

**Request Body (any fields to update):**
```json
{
  "creditAmount": 600.00,
  "reason": "Updated reason"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "creditAmount": 600.00,
    "reason": "Updated reason",
    "status": "Pending"
  },
  "message": "Credit note updated successfully",
  "isSuccess": true
}
```

---

#### 5. DELETE Credit Note
```
DELETE /api/creditnotes/{id}
```

**Response (204 No Content / 200 OK):**
```json
{
  "message": "Credit note deleted successfully",
  "isSuccess": true
}
```

---

#### 6. GET Credit Notes by Invoice
```
GET /api/creditnotes/invoice/{invoiceId}
```

**Example:** `/api/creditnotes/invoice/1`

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "creditNoteNumber": "CN-2026-001",
      "invoiceId": 1,
      "creditAmount": 500.00,
      "status": "Pending"
    }
  ],
  "message": "Credit notes retrieved successfully",
  "isSuccess": true
}
```

---

### Phase 3: Approval Workflow

#### 7. POST Approve Credit Note
```
POST /api/creditnotes/{id}/approve
```

**Request Body:**
```json
{
  "approvedBy": "manager@example.com",
  "reverseSales": true,
  "reverseInventory": true
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "Approved",
    "approvedBy": "manager@example.com",
    "approvedDate": "2026-02-02T12:05:00Z",
    "salesReversalId": 1,
    "inventoryReversalId": 1
  },
  "message": "Credit note approved successfully",
  "isSuccess": true
}
```

---

#### 8. POST Reject Credit Note
```
POST /api/creditnotes/{id}/reject
```

**Request Body:**
```json
{
  "rejectedBy": "manager@example.com",
  "rejectionReason": "Insufficient documentation"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "Rejected",
    "rejectedBy": "manager@example.com",
    "rejectedDate": "2026-02-02T12:06:00Z",
    "rejectionReason": "Insufficient documentation"
  },
  "message": "Credit note rejected successfully",
  "isSuccess": true
}
```

---

### Phase 4: Document Management

#### 9. POST Upload Document
```
POST /api/creditnotes/{id}/upload
Content-Type: multipart/form-data
```

**Parameters:**
- `file`: PDF file (max 5MB)

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "documentUrl": "https://storage.example.com/creditnotes/CN-2026-001.pdf",
    "documentFileName": "CN-2026-001.pdf",
    "documentUploadDate": "2026-02-02T12:07:00Z"
  },
  "message": "Document uploaded successfully",
  "isSuccess": true
}
```

---

#### 10. GET Download Document
```
GET /api/creditnotes/{id}/download
```

**Response:** Binary PDF file download

---

#### 11. GET with Filters (Advanced)
```
GET /api/creditnotes?status=Approved&customerId=1&dateFrom=2026-01-01&dateTo=2026-02-02&search=damaged
```

---

## 🔐 Authentication

All endpoints require JWT authentication.

**How to get token:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Use token in requests:**
```
Authorization: Bearer eyJhbGc...
```

---

## 🧪 Testing with Postman

### Import Collection
1. Download collection from: `CREDIT_NOTES_POSTMAN_COLLECTION.json` (if provided)
2. Open Postman → Import → Upload file
3. Select environment with JWT token
4. Run requests

### Manual Testing

**1. Create a test credit note:**
```
POST https://ngcanduapi.azurewebsites.net/api/creditnotes
Headers:
  Authorization: Bearer <your-token>
  Content-Type: application/json

Body:
{
  "invoiceId": 1,
  "customerId": 1,
  "creditAmount": 250.00,
  "reason": "Quality issue"
}
```

**2. Get all credit notes:**
```
GET https://ngcanduapi.azurewebsites.net/api/creditnotes
Headers:
  Authorization: Bearer <your-token>
```

**3. Approve credit note:**
```
POST https://ngcanduapi.azurewebsites.net/api/creditnotes/1/approve
Headers:
  Authorization: Bearer <your-token>
  Content-Type: application/json

Body:
{
  "approvedBy": "approver@example.com"
}
```

---

## 💻 Frontend Implementation Example

### JavaScript/Fetch

**Create credit note:**
```javascript
const createCreditNote = async (invoiceId, customerId, creditAmount, reason) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('https://ngcanduapi.azurewebsites.net/api/creditnotes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      invoiceId,
      customerId,
      creditAmount,
      reason
    })
  });
  
  return await response.json();
};
```

**Get all credit notes:**
```javascript
const getCreditNotes = async (filters = {}) => {
  const token = localStorage.getItem('jwt_token');
  
  const queryString = new URLSearchParams(filters).toString();
  const url = queryString 
    ? `https://ngcanduapi.azurewebsites.net/api/creditnotes?${queryString}`
    : 'https://ngcanduapi.azurewebsites.net/api/creditnotes';
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
};
```

**Approve credit note:**
```javascript
const approveCreditNote = async (creditNoteId, approvedBy) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(
    `https://ngcanduapi.azurewebsites.net/api/creditnotes/${creditNoteId}/approve`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        approvedBy,
        reverseSales: true,
        reverseInventory: true
      })
    }
  );
  
  return await response.json();
};
```

### Angular/HttpClient

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService {
  private apiUrl = 'https://ngcanduapi.azurewebsites.net/api/creditnotes';

  constructor(private http: HttpClient) {}

  getCreditNotes(filters?: any) {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}`, { params });
  }

  createCreditNote(data: any) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  approveCreditNote(id: number, data: any) {
    return this.http.post(`${this.apiUrl}/${id}/approve`, data);
  }

  rejectCreditNote(id: number, data: any) {
    return this.http.post(`${this.apiUrl}/${id}/reject`, data);
  }

  uploadDocument(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
  }
}
```

### React/Axios

```typescript
import axios from 'axios';

const API_BASE = 'https://ngcanduapi.azurewebsites.net/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Credit Notes API calls
export const creditNoteAPI = {
  getAll: (filters?: any) => apiClient.get('/creditnotes', { params: filters }),
  create: (data: any) => apiClient.post('/creditnotes', data),
  getById: (id: number) => apiClient.get(`/creditnotes/${id}`),
  update: (id: number, data: any) => apiClient.patch(`/creditnotes/${id}`, data),
  delete: (id: number) => apiClient.delete(`/creditnotes/${id}`),
  getByInvoice: (invoiceId: number) => apiClient.get(`/creditnotes/invoice/${invoiceId}`),
  approve: (id: number, data: any) => apiClient.post(`/creditnotes/${id}/approve`, data),
  reject: (id: number, data: any) => apiClient.post(`/creditnotes/${id}/reject`, data),
  uploadDocument: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/creditnotes/${id}/upload`, formData);
  },
  downloadDocument: (id: number) => apiClient.get(`/creditnotes/${id}/download`, { responseType: 'blob' })
};
```

---

## 🎨 UI Components to Build

### 1. Credit Notes List
- Display table with: CN Number, Invoice, Customer, Amount, Status, Actions
- Add filtering: by status, customer, date range
- Add search: by CN number or reason
- Pagination support

### 2. Create Credit Note Form
- Fields: Invoice ID, Customer ID, Credit Amount, Reason
- Validation: amount ≤ original invoice amount
- Submit button → POST endpoint
- Success toast notification

### 3. Credit Note Detail View
- Display all fields (read-only except status)
- Show document (if uploaded)
- Action buttons based on status:
  - If "Pending": Approve, Reject, Edit
  - If "Approved": View details only
  - If "Rejected": View rejection reason

### 4. Approval Workflow
- Modal/dialog for approval
- Input for approver name
- Checkboxes: Reverse Sales, Reverse Inventory
- Confirmation before submit

### 5. Rejection Form
- Modal for rejection
- Input: Rejection Reason
- Confirmation before submit

### 6. Document Upload
- Drag-and-drop or file picker
- File validation (PDF, max 5MB)
- Progress indicator
- Download link if exists

---

## ⚠️ Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "message": "Unauthorized",
  "isSuccess": false
}
```
**Solution:** Refresh JWT token

**400 Bad Request:**
```json
{
  "message": "Invoice not found",
  "isSuccess": false
}
```
**Solution:** Validate input data

**500 Internal Server Error:**
```json
{
  "message": "An error occurred",
  "isSuccess": false
}
```
**Solution:** Check logs, retry after delay

### Implement Retry Logic
```javascript
const retryRequest = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

---

## 🔄 Integration Checklist

- [ ] Update API base URL from `localhost` to `https://ngcanduapi.azurewebsites.net`
- [ ] Implement JWT token storage (localStorage/sessionStorage)
- [ ] Add Authorization header to all requests
- [ ] Build Credit Notes list page
- [ ] Build Create Credit Note form
- [ ] Build Credit Note detail view
- [ ] Build Approval workflow
- [ ] Build Document upload/download
- [ ] Add error handling & retry logic
- [ ] Add loading states (spinners)
- [ ] Add success/error notifications (toasts)
- [ ] Test all 11 endpoints
- [ ] Test filtering & search
- [ ] Test upload document (5MB limit)
- [ ] Test approval workflow
- [ ] Performance testing (load time)
- [ ] Security testing (token refresh)

---

## 📊 Status Values

Credit notes have 4 possible statuses:

| Status | Meaning | Actions Available |
|--------|---------|------------------|
| **Pending** | Awaiting approval | Approve, Reject, Edit, Delete |
| **Approved** | Approved & processed | View only |
| **Rejected** | Rejected with reason | View rejection reason |
| **Reversed** | Stock/sales reversed | View reversal details |

---

## 🚀 Deployment

Once frontend is ready:

1. **Test locally** against live API
2. **Deploy frontend** to CDN/hosting
3. **Configure CORS** if needed (in API settings)
4. **Enable monitoring** (Application Insights)
5. **Set up alerts** for errors

---

## 📞 Support

- **API Status:** https://ngcanduapi.azurewebsites.net/health (if available)
- **API Logs:** Azure Portal → App Service → Log Stream
- **Database:** Azure Portal → SQL Database → Query Editor
- **Documentation:** See all `.md` files in project root

---

## 🎯 Success Metrics

✅ All endpoints responding  
✅ Authentication working  
✅ CRUD operations functional  
✅ Approval workflow complete  
✅ Document upload working  
✅ Frontend integrated  
✅ No console errors  
✅ Loading under 2 seconds  

---

**API Base URL:** `https://ngcanduapi.azurewebsites.net/api`  
**Status:** ✅ Live and Ready  
**Version:** 1.0  
**Last Updated:** February 2, 2026  

Your frontend team can start integrating now! 🚀
