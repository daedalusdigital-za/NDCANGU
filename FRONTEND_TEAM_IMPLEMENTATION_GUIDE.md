# Frontend Team - Implementation Guide
## Credit Notes Feature + VAT Conversion (15% South Africa)

**API Status:** ✅ Live and Ready for Integration  
**Base URL:** `https://ngcanduapi.azurewebsites.net/api`  
**Date:** February 2, 2026  
**Version:** 1.0

---

## 📌 CRITICAL: Two Major Changes

### 1. New Feature: Credit Notes (11 Endpoints)
Complete credit note management system with approval workflow.

### 2. Price Format Change: VAT INCLUSIVE
All prices now include 15% VAT (no need to add tax separately).

**Key Rule:** All prices from API = VAT INCLUSIVE. Use them as-is! 🎯

---

## 🚨 PRIORITY 1: VAT PRICING - IMMEDIATE CHANGES NEEDED

### ❌ STOP Doing This
```javascript
// OLD WAY - Don't multiply by 1.15 anymore!
const displayPrice = (price) => {
  return price * 1.15;  // ❌ Prices already include VAT!
};
```

### ✅ START Doing This
```javascript
// NEW WAY - Prices already include VAT
const displayPrice = (price) => {
  return `R${price.toFixed(2)}`;
};
```

### The Math
```
Example Product: Test Strips

BEFORE (VAT Exclusive):
  Listed Price: R100.00
  + VAT (15%):  R15.00
  Total:        R115.00

AFTER (VAT Inclusive):
  Listed Price: R115.00  ← Use this directly!
  VAT included: R15.00
  Total:        R115.00
```

### If You Need VAT Breakdown
```javascript
// For invoice/detailed views
const getVATBreakdown = (inclusivePrice) => {
  const exclusive = Math.round((inclusivePrice / 1.15) * 100) / 100;
  const vat = Math.round((inclusivePrice - exclusive) * 100) / 100;
  
  return {
    including: inclusivePrice,
    excluding: exclusive,
    vat: vat
  };
};

// Usage:
const breakdown = getVATBreakdown(115.00);
// Result: { including: 115.00, excluding: 100.00, vat: 15.00 }
```

### Pages to Update TODAY
- [ ] Inventory/Product listings
- [ ] Shopping cart
- [ ] Checkout page
- [ ] Invoice templates
- [ ] Price displays everywhere

---

## 🎯 PRIORITY 2: Credit Notes Feature (11 Endpoints)

### What You're Building
A complete credit note management system with:
- Create/view/update/delete credit notes
- Approval workflow (approve/reject)
- Document upload/download
- Advanced filtering

### Feature Overview
```
Credit Note Lifecycle:
1. CREATE: Manager creates credit note for returned/defective goods
2. PENDING: Awaiting approval
3. APPROVE/REJECT: Manager reviews and approves/rejects
4. UPLOAD: Attach supporting documents (PDF)
5. APPROVED: Final status, stock/sales reversed
```

---

## 📋 All 11 Credit Note Endpoints

### PHASE 1: Core Operations (3 endpoints)

#### 1️⃣ GET All Credit Notes
```
GET /api/creditnotes
```

**Query Parameters (all optional):**
```
?status=Pending           // Filter: Pending, Approved, Rejected, Reversed
&customerId=1             // Filter by customer
&invoiceId=1              // Filter by invoice
&dateFrom=2026-01-01      // Filter by date range
&dateTo=2026-02-02
&search=text              // Search in reason/CN number
```

**Required Headers:**
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

**Display Example:**
```javascript
// In your component
creditNotes.map(cn => (
  <tr key={cn.id}>
    <td>{cn.creditNoteNumber}</td>
    <td>R{cn.creditAmount.toFixed(2)}</td>
    <td>{cn.status}</td>
    <td>{new Date(cn.createdDate).toLocaleDateString()}</td>
  </tr>
))
```

---

#### 2️⃣ POST Create Credit Note
```
POST /api/creditnotes
```

**Request Body:**
```json
{
  "invoiceId": 1,
  "customerId": 1,
  "creditAmount": 500.00,
  "reason": "Product defect - returned by customer"
}
```

**Required Fields:**
- `invoiceId` - Which invoice this credit is for
- `customerId` - Customer being credited
- `creditAmount` - Amount to credit (must be ≤ original invoice)
- `reason` - Why the credit note is being issued

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

**Form Validation:**
```javascript
const validateCreditNote = (data, originalAmount) => {
  const errors = {};
  
  if (!data.invoiceId) errors.invoiceId = "Invoice required";
  if (!data.customerId) errors.customerId = "Customer required";
  if (data.creditAmount <= 0) errors.creditAmount = "Amount must be > 0";
  if (data.creditAmount > originalAmount) 
    errors.creditAmount = "Cannot exceed original amount";
  if (!data.reason || data.reason.length < 10) 
    errors.reason = "Reason required (min 10 chars)";
  
  return errors;
};
```

**Sample Form:**
```html
<form onSubmit={handleSubmit}>
  <input type="number" name="invoiceId" placeholder="Invoice ID" required />
  <input type="number" name="customerId" placeholder="Customer ID" required />
  <input type="number" name="creditAmount" placeholder="Credit Amount (R)" required />
  <textarea name="reason" placeholder="Reason for credit note" required></textarea>
  <button type="submit">Create Credit Note</button>
</form>
```

---

#### 3️⃣ GET Specific Credit Note
```
GET /api/creditnotes/{id}
```

**Example:** `GET /api/creditnotes/1`

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
    "rejectionReason": null,
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

### PHASE 2: Management Operations (3 endpoints)

#### 4️⃣ PATCH Update Credit Note
```
PATCH /api/creditnotes/{id}
```

**Request Body (send only fields to update):**
```json
{
  "creditAmount": 600.00,
  "reason": "Updated - additional damage found"
}
```

**Allowed Updates:**
- `creditAmount` - If still in Pending status
- `reason` - If still in Pending status
- Cannot update approved/rejected notes

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

#### 5️⃣ DELETE Credit Note
```
DELETE /api/creditnotes/{id}
```

**Rules:**
- Only delete if status = "Pending"
- Cannot delete approved/rejected notes

**Response (200 OK):**
```json
{
  "message": "Credit note deleted successfully",
  "isSuccess": true
}
```

**Usage:**
```javascript
const deleteCreditNote = async (id) => {
  const confirmed = window.confirm('Delete this credit note?');
  if (!confirmed) return;
  
  const response = await fetch(
    `https://ngcanduapi.azurewebsites.net/api/creditnotes/${id}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  if (result.isSuccess) {
    showNotification('Credit note deleted');
    refreshList();
  }
};
```

---

#### 6️⃣ GET Credit Notes by Invoice
```
GET /api/creditnotes/invoice/{invoiceId}
```

**Example:** `GET /api/creditnotes/invoice/123`

**Use Case:** Show all credit notes for a specific invoice

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "creditNoteNumber": "CN-2026-001",
      "invoiceId": 123,
      "creditAmount": 500.00,
      "status": "Pending"
    },
    {
      "id": 2,
      "creditNoteNumber": "CN-2026-002",
      "invoiceId": 123,
      "creditAmount": 250.00,
      "status": "Approved"
    }
  ],
  "message": "Credit notes retrieved successfully",
  "isSuccess": true
}
```

---

### PHASE 3: Approval Workflow (2 endpoints)

#### 7️⃣ POST Approve Credit Note
```
POST /api/creditnotes/{id}/approve
```

**Request Body:**
```json
{
  "approvedBy": "manager@hospital.co.za",
  "reverseSales": true,
  "reverseInventory": true
}
```

**Fields:**
- `approvedBy` - Email of approver
- `reverseSales` - Reverse the original sale (true/false)
- `reverseInventory` - Return items to inventory (true/false)

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "Approved",
    "approvedBy": "manager@hospital.co.za",
    "approvedDate": "2026-02-02T12:05:00Z",
    "salesReversalId": 1,
    "inventoryReversalId": 1
  },
  "message": "Credit note approved successfully",
  "isSuccess": true
}
```

**Approval Modal Example:**
```javascript
const ApprovalModal = ({ creditNote, onApprove, onCancel }) => {
  const [approverEmail, setApproverEmail] = useState('');
  const [reverseSales, setReverseSales] = useState(true);
  const [reverseInventory, setReverseInventory] = useState(true);
  
  return (
    <div className="modal">
      <h2>Approve Credit Note {creditNote.creditNoteNumber}?</h2>
      <p>Amount: R{creditNote.creditAmount.toFixed(2)}</p>
      <p>Reason: {creditNote.reason}</p>
      
      <div className="form-group">
        <label>Approver Email:</label>
        <input 
          type="email" 
          value={approverEmail} 
          onChange={(e) => setApproverEmail(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label>
          <input 
            type="checkbox" 
            checked={reverseSales}
            onChange={(e) => setReverseSales(e.target.checked)}
          />
          Reverse Original Sale
        </label>
      </div>
      
      <div className="form-group">
        <label>
          <input 
            type="checkbox" 
            checked={reverseInventory}
            onChange={(e) => setReverseInventory(e.target.checked)}
          />
          Return Items to Inventory
        </label>
      </div>
      
      <button onClick={() => onApprove({
        approvedBy: approverEmail,
        reverseSales,
        reverseInventory
      })}>Approve</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};
```

---

#### 8️⃣ POST Reject Credit Note
```
POST /api/creditnotes/{id}/reject
```

**Request Body:**
```json
{
  "rejectedBy": "manager@hospital.co.za",
  "rejectionReason": "Insufficient documentation - no proof of return"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "Rejected",
    "rejectedBy": "manager@hospital.co.za",
    "rejectedDate": "2026-02-02T12:06:00Z",
    "rejectionReason": "Insufficient documentation - no proof of return"
  },
  "message": "Credit note rejected successfully",
  "isSuccess": true
}
```

---

### PHASE 4: Document Management (2 endpoints)

#### 9️⃣ POST Upload Document
```
POST /api/creditnotes/{id}/upload
Content-Type: multipart/form-data
```

**Parameters:**
- `file` - PDF file (max 5MB)

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

**Upload Component:**
```javascript
const DocumentUpload = ({ creditNoteId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File must be less than 5MB');
      return;
    }
    if (selectedFile.type !== 'application/pdf') {
      alert('Only PDF files allowed');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        `https://ngcanduapi.azurewebsites.net/api/creditnotes/${creditNoteId}/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      const result = await response.json();
      if (result.isSuccess) {
        alert('Document uploaded successfully');
        // Refresh credit note to show document
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button 
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
};
```

---

#### 🔟 GET Download Document
```
GET /api/creditnotes/{id}/download
```

**Response:** Binary PDF file

**Download Component:**
```javascript
const downloadDocument = async (creditNoteId, fileName) => {
  const response = await fetch(
    `https://ngcanduapi.azurewebsites.net/api/creditnotes/${creditNoteId}/download`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'credit-note.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
};
```

---

#### 1️⃣1️⃣ GET with Filters (Advanced)
```
GET /api/creditnotes?status=Approved&customerId=1&dateFrom=2026-01-01&dateTo=2026-02-02&search=damaged
```

**Combines all filters in one query**

---

## 🔐 Authentication: JWT Tokens

### Get a Token
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@hospital.co.za",
  "password": "your-password"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Store Token
```javascript
// Login
const response = await fetch('https://ngcanduapi.azurewebsites.net/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    password: userPassword
  })
});

const result = await response.json();
localStorage.setItem('jwt_token', result.data.token);
localStorage.setItem('token_expiry', Date.now() + (result.data.expiresIn * 1000));
```

### Use Token in All Requests
```javascript
const token = localStorage.getItem('jwt_token');

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Use in fetch
const response = await fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
});
```

### Token Refresh
```javascript
const getValidToken = async () => {
  const token = localStorage.getItem('jwt_token');
  const expiry = localStorage.getItem('token_expiry');
  
  // If expired or expiring soon (< 5 mins), refresh
  if (!expiry || Date.now() > expiry - (5 * 60 * 1000)) {
    // Redirect to login
    window.location.href = '/login';
    return null;
  }
  
  return token;
};
```

---

## 💻 Complete Code Examples

### JavaScript/Fetch - Complete API Service
```javascript
class CreditNoteAPI {
  constructor(baseUrl = 'https://ngcanduapi.azurewebsites.net/api') {
    this.baseUrl = baseUrl;
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('jwt_token');
  }

  // Build headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    };
  }

  // Get all credit notes
  async getAll(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const url = query 
      ? `${this.baseUrl}/creditnotes?${query}`
      : `${this.baseUrl}/creditnotes`;
    
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Get by ID
  async getById(id) {
    const response = await fetch(`${this.baseUrl}/creditnotes/${id}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Create new
  async create(data) {
    const response = await fetch(`${this.baseUrl}/creditnotes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Update
  async update(id, data) {
    const response = await fetch(`${this.baseUrl}/creditnotes/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Delete
  async delete(id) {
    const response = await fetch(`${this.baseUrl}/creditnotes/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Get by invoice
  async getByInvoice(invoiceId) {
    const response = await fetch(
      `${this.baseUrl}/creditnotes/invoice/${invoiceId}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  // Approve
  async approve(id, data) {
    const response = await fetch(
      `${this.baseUrl}/creditnotes/${id}/approve`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  // Reject
  async reject(id, data) {
    const response = await fetch(
      `${this.baseUrl}/creditnotes/${id}/reject`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }

  // Upload document
  async uploadDocument(id, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${this.baseUrl}/creditnotes/${id}/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      }
    );
    return response.json();
  }

  // Download document
  async downloadDocument(id, fileName) {
    const response = await fetch(
      `${this.baseUrl}/creditnotes/${id}/download`,
      { headers: this.getHeaders() }
    );
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'credit-note.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Usage
const api = new CreditNoteAPI();

// Get all
const creditNotes = await api.getAll({ status: 'Pending' });

// Create
const newCN = await api.create({
  invoiceId: 1,
  customerId: 1,
  creditAmount: 500,
  reason: 'Damaged goods'
});

// Approve
await api.approve(1, {
  approvedBy: 'manager@hospital.co.za',
  reverseSales: true,
  reverseInventory: true
});
```

### Angular/HttpClient Service
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreditNoteService {
  private apiUrl = 'https://ngcanduapi.azurewebsites.net/api/creditnotes';

  constructor(private http: HttpClient) {}

  getAll(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getByInvoice(invoiceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/invoice/${invoiceId}`);
  }

  approve(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, data);
  }

  reject(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, data);
  }

  uploadDocument(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, 
      { responseType: 'blob' });
  }
}

// Component usage
export class CreditNotesComponent implements OnInit {
  creditNotes$ = this.creditNoteService.getAll({ status: 'Pending' });
  
  constructor(private creditNoteService: CreditNoteService) {}
  
  approveCreditNote(id: number, approver: string) {
    this.creditNoteService.approve(id, {
      approvedBy: approver,
      reverseSales: true,
      reverseInventory: true
    }).subscribe(
      result => console.log('Approved:', result),
      error => console.error('Error:', error)
    );
  }
}
```

### React/Axios Service
```typescript
import axios from 'axios';

const API_BASE = 'https://ngcanduapi.azurewebsites.net/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Add token interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const creditNoteAPI = {
  getAll: (filters?: any) => 
    apiClient.get('/creditnotes', { params: filters }),
  
  getById: (id: number) => 
    apiClient.get(`/creditnotes/${id}`),
  
  create: (data: any) => 
    apiClient.post('/creditnotes', data),
  
  update: (id: number, data: any) => 
    apiClient.patch(`/creditnotes/${id}`, data),
  
  delete: (id: number) => 
    apiClient.delete(`/creditnotes/${id}`),
  
  getByInvoice: (invoiceId: number) => 
    apiClient.get(`/creditnotes/invoice/${invoiceId}`),
  
  approve: (id: number, data: any) => 
    apiClient.post(`/creditnotes/${id}/approve`, data),
  
  reject: (id: number, data: any) => 
    apiClient.post(`/creditnotes/${id}/reject`, data),
  
  uploadDocument: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/creditnotes/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  downloadDocument: (id: number) => 
    apiClient.get(`/creditnotes/${id}/download`, 
      { responseType: 'blob' })
};

// Component usage
function CreditNotesList() {
  const [creditNotes, setCreditNotes] = useState([]);
  
  useEffect(() => {
    creditNoteAPI.getAll({ status: 'Pending' })
      .then(res => setCreditNotes(res.data.data))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <table>
      <tbody>
        {creditNotes.map(cn => (
          <tr key={cn.id}>
            <td>{cn.creditNoteNumber}</td>
            <td>R{cn.creditAmount.toFixed(2)}</td>
            <td>{cn.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🎯 Implementation Phases

### Phase 1: Setup (Day 1)
- [ ] Create API service class (see code examples above)
- [ ] Implement JWT token storage & refresh
- [ ] Create error handling & retry logic

### Phase 2: VAT Pricing (Day 1-2)
- [ ] Review VAT changes (prices are now inclusive)
- [ ] Remove `price * 1.15` calculations everywhere
- [ ] Update all price displays
- [ ] Test with sample prices

### Phase 3: Core Features (Day 2-3)
- [ ] Build credit notes list page
- [ ] Build create form
- [ ] Build detail view
- [ ] Implement filtering & search

### Phase 4: Advanced Features (Day 3-4)
- [ ] Build approval workflow
- [ ] Implement document upload
- [ ] Build rejection modal
- [ ] Add loading states & error handling

### Phase 5: Testing (Day 4-5)
- [ ] Test all 11 endpoints
- [ ] Test VAT calculations
- [ ] Test approval workflow
- [ ] Test error scenarios

### Phase 6: Deployment (Day 5)
- [ ] Deploy to staging
- [ ] Final testing
- [ ] Deploy to production

---

## ✅ Frontend Team Checklist

### Before Starting
- [ ] Review this entire guide
- [ ] Understand VAT changes (VAT INCLUSIVE now)
- [ ] Understand all 11 credit note endpoints
- [ ] Get test credentials for authentication

### Development
- [ ] Create API service class
- [ ] Build credit notes list
- [ ] Build create form with validation
- [ ] Build detail view
- [ ] Build approval workflow
- [ ] Implement document upload
- [ ] Add all filters
- [ ] Add error handling

### VAT Updates
- [ ] Remove all `price * 1.15` calculations
- [ ] Update inventory displays
- [ ] Update shopping cart
- [ ] Update checkout page
- [ ] Update invoices
- [ ] Update reports

### Testing
- [ ] Test list with 10+ items
- [ ] Test create with validation
- [ ] Test approve/reject workflow
- [ ] Test document upload (5MB limit)
- [ ] Test filters & search
- [ ] Test error scenarios (401, 400, 500)
- [ ] Test on mobile devices
- [ ] Verify VAT calculations

### Code Quality
- [ ] No console errors
- [ ] Proper error messages
- [ ] Loading indicators on slow operations
- [ ] Success/error notifications (toasts)
- [ ] Token refresh before expiry
- [ ] Responsive design

---

## 🚨 Common Errors & Solutions

### Error 1: "Unauthorized" (401)
```
Problem: Token expired or invalid
Solution: Refresh token or redirect to login
```

### Error 2: "Bad Request" (400)
```
Problem: Invalid data sent to API
Solution: Validate form data before sending
  - Check all required fields
  - Validate data types
  - Check amount ≤ original amount
```

### Error 3: "Not Found" (404)
```
Problem: Credit note doesn't exist
Solution: Verify ID is correct, refresh list
```

### Error 4: VAT Calculation Wrong
```
Problem: Multiplying prices by 1.15 again
Solution: DELETE all price * 1.15 code!
  - Prices already include VAT
  - Use as-is from API
```

---

## 📞 Quick Reference: Copy-Paste Templates

### Get All with Filters
```javascript
await api.getAll({
  status: 'Pending',
  dateFrom: '2026-01-01',
  dateTo: '2026-02-02'
});
```

### Create New
```javascript
await api.create({
  invoiceId: 123,
  customerId: 456,
  creditAmount: 500.00,
  reason: 'Damaged goods returned'
});
```

### Approve
```javascript
await api.approve(creditNoteId, {
  approvedBy: currentUser.email,
  reverseSales: true,
  reverseInventory: true
});
```

### Price Display
```javascript
`R${price.toFixed(2)}`  // That's it!
```

### VAT Breakdown (if needed)
```javascript
const exclusive = (price / 1.15).toFixed(2);
const vat = (price - exclusive).toFixed(2);
```

---

## 📚 Additional Resources

- **Full VAT Guide:** `VAT_QUICK_REFERENCE.md`
- **Original Credit Notes Guide:** `CREDIT_NOTES_FRONTEND_INTEGRATION_GUIDE.md`
- **API Status:** https://ngcanduapi.azurewebsites.net/health
- **Support:** Ask backend team

---

## 🎉 You're Ready!

Everything you need is in this document:
- ✅ All 11 endpoints documented
- ✅ Complete code examples (JS, Angular, React)
- ✅ VAT conversion explained
- ✅ Implementation checklist
- ✅ Common errors & solutions

**Questions? Check the sections above or ask your backend team!**
