# Backend Requirements - Credit Notes System

## Overview
This document outlines the backend API requirements for the Credit Notes System and Credited Sales View functionality. The frontend has been implemented and is ready for API integration.

---

## 1. Database Schema Requirements

### 1.1 CreditNotes Table
Create a new table to store credit note records:

```sql
CREATE TABLE CreditNotes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CreditNoteNumber NVARCHAR(50) UNIQUE NOT NULL,
    InvoiceId INT NOT NULL,
    InvoiceNumber NVARCHAR(50) NOT NULL,
    CustomerId INT NULL,
    CustomerName NVARCHAR(200) NOT NULL,
    OriginalAmount DECIMAL(18,2) NOT NULL,
    CreditAmount DECIMAL(18,2) NOT NULL,
    Reason NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    ReverseStock BIT NOT NULL DEFAULT 0,
    ReverseSale BIT NOT NULL DEFAULT 1,
    Notes NVARCHAR(MAX) NULL,
    DocumentFileName NVARCHAR(255) NULL,
    DocumentFileUrl NVARCHAR(500) NULL,
    DocumentUploadedDate DATETIME NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    ApprovedDate DATETIME NULL,
    ApprovedBy NVARCHAR(100) NULL,
    LastUpdated DATETIME NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_CreditNotes_Sales FOREIGN KEY (InvoiceId) REFERENCES Sales(Id),
    CONSTRAINT CK_CreditNotes_Status CHECK (Status IN ('pending', 'approved', 'rejected', 'completed'))
);

-- Index for faster lookups
CREATE INDEX IX_CreditNotes_InvoiceId ON CreditNotes(InvoiceId);
CREATE INDEX IX_CreditNotes_Status ON CreditNotes(Status);
CREATE INDEX IX_CreditNotes_CreatedDate ON CreditNotes(CreatedDate DESC);
```

### 1.2 Sales Table Update (Optional)
Add a field to track if a sale has been credited:

```sql
ALTER TABLE Sales
ADD HasCreditNote BIT NOT NULL DEFAULT 0,
    CreditedAmount DECIMAL(18,2) NULL;
```

---

## 2. API Endpoints Required

### 2.1 Credit Notes Endpoints

#### GET /api/CreditNotes
Get all credit notes with optional filtering

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected, completed)
- `customerId` (optional): Filter by customer ID
- `invoiceId` (optional): Filter by invoice/sale ID
- `dateFrom` (optional): Filter by creation date (ISO 8601 format)
- `dateTo` (optional): Filter by creation date (ISO 8601 format)
- `search` (optional): Search in credit note number, customer name, or invoice number

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "creditNoteNumber": "CN-2026-001",
    "invoiceId": 123,
    "invoiceNumber": "INV-2026-0145",
    "customerId": 45,
    "customerName": "Groote Schuur Hospital",
    "originalAmount": 15000.00,
    "creditAmount": 15000.00,
    "reason": "Defective equipment returned",
    "status": "approved",
    "reverseStock": true,
    "reverseSale": true,
    "notes": "Full refund issued",
    "uploadedDocument": {
      "fileName": "credit_note_proof.pdf",
      "fileUrl": "/uploads/credit-notes/CN-2026-001.pdf",
      "uploadedDate": "2026-01-15T10:30:00Z"
    },
    "createdDate": "2026-01-15T09:00:00Z",
    "approvedDate": "2026-01-15T14:00:00Z",
    "approvedBy": "admin@ndcangu.com",
    "lastUpdated": "2026-01-15T14:00:00Z"
  }
]
```

---

#### GET /api/CreditNotes/{id}
Get a specific credit note by ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "creditNoteNumber": "CN-2026-001",
  "invoiceId": 123,
  "invoiceNumber": "INV-2026-0145",
  "customerId": 45,
  "customerName": "Groote Schuur Hospital",
  "originalAmount": 15000.00,
  "creditAmount": 15000.00,
  "reason": "Defective equipment returned",
  "status": "approved",
  "reverseStock": true,
  "reverseSale": true,
  "notes": "Full refund issued",
  "uploadedDocument": {
    "fileName": "credit_note_proof.pdf",
    "fileUrl": "/uploads/credit-notes/CN-2026-001.pdf",
    "uploadedDate": "2026-01-15T10:30:00Z"
  },
  "createdDate": "2026-01-15T09:00:00Z",
  "approvedDate": "2026-01-15T14:00:00Z",
  "approvedBy": "admin@ndcangu.com"
}
```

**Error Responses:**
- `404 Not Found` - Credit note not found

---

#### POST /api/CreditNotes
Create a new credit note

**Request Body:**
```json
{
  "invoiceId": 123,
  "creditAmount": 15000.00,
  "reason": "Defective equipment returned",
  "notes": "Customer reported issues with equipment",
  "reverseStock": true,
  "reverseSale": true
}
```

**Note:** The following fields are auto-populated from the Invoice/Sale:
- `invoiceNumber`
- `customerId`
- `customerName`
- `originalAmount`

**Response:** `201 Created`
```json
{
  "id": 1,
  "creditNoteNumber": "CN-2026-001",
  "invoiceId": 123,
  "invoiceNumber": "INV-2026-0145",
  "customerId": 45,
  "customerName": "Groote Schuur Hospital",
  "originalAmount": 15000.00,
  "creditAmount": 15000.00,
  "reason": "Defective equipment returned",
  "status": "pending",
  "reverseStock": true,
  "reverseSale": true,
  "notes": "Customer reported issues with equipment",
  "createdDate": "2026-01-16T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data or invoice not found
- `422 Unprocessable Entity` - Credit amount exceeds original amount

---

#### PATCH /api/CreditNotes/{id}
Update an existing credit note

**Request Body:** (all fields optional)
```json
{
  "creditAmount": 12000.00,
  "reason": "Partial refund - 3 items defective",
  "notes": "Updated after inspection",
  "status": "approved",
  "approvedBy": "admin@ndcangu.com"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "creditNoteNumber": "CN-2026-001",
  "status": "approved",
  "creditAmount": 12000.00,
  "lastUpdated": "2026-01-16T11:00:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Credit note not found
- `400 Bad Request` - Invalid status transition

---

#### DELETE /api/CreditNotes/{id}
Delete a credit note (only if status is 'pending')

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Credit note not found
- `400 Bad Request` - Cannot delete approved/completed credit notes

---

#### POST /api/CreditNotes/{id}/upload
Upload a PDF document for a credit note

**Request:** `multipart/form-data`
- `file`: PDF file (max 5MB)

**Response:** `200 OK`
```json
{
  "fileName": "credit_note_proof.pdf",
  "fileUrl": "/uploads/credit-notes/CN-2026-001.pdf",
  "uploadedDate": "2026-01-16T12:00:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Credit note not found
- `400 Bad Request` - Invalid file type (must be PDF)
- `413 Payload Too Large` - File exceeds 5MB

---

#### GET /api/CreditNotes/{id}/download
Download the credit note document

**Response:** `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="CN-2026-001.pdf"`

**Error Responses:**
- `404 Not Found` - Credit note or document not found

---

### 2.2 Sales Endpoints (Enhancements)

#### GET /api/Sales
**Enhancement Required:** Add filtering for credited sales

**New Query Parameters:**
- `hasCreditNote` (optional, boolean): Filter sales with/without credit notes

**Response:** Same as current, but optionally include credit note summary:
```json
[
  {
    "id": 123,
    "saleNumber": "INV-2026-0145",
    "saleDate": "2026-01-10T00:00:00Z",
    "customerId": 45,
    "customerName": "Groote Schuur Hospital",
    "customerPhone": "+27123456789",
    "subtotal": 15000.00,
    "total": 15000.00,
    "notes": "Medical equipment order",
    "provinceId": 1,
    "provinceName": "Western Cape",
    "saleItems": [...],
    "hasCreditNote": true,
    "creditedAmount": 15000.00,
    "creditNotes": [
      {
        "id": 1,
        "creditNoteNumber": "CN-2026-001",
        "creditAmount": 15000.00,
        "status": "approved"
      }
    ]
  }
]
```

---

#### GET /api/Sales/Credited
Get all sales that have associated credit notes

**Query Parameters:**
- `status` (optional): Filter by credit note status
- `dateFrom` (optional): Filter by sale date
- `dateTo` (optional): Filter by sale date

**Response:** `200 OK`
```json
[
  {
    "id": 123,
    "saleNumber": "INV-2026-0145",
    "saleDate": "2026-01-10T00:00:00Z",
    "customerName": "Groote Schuur Hospital",
    "customerPhone": "+27123456789",
    "total": 15000.00,
    "provinceName": "Western Cape",
    "saleItems": [...],
    "creditNotes": [
      {
        "id": 1,
        "creditNoteNumber": "CN-2026-001",
        "creditAmount": 15000.00,
        "status": "approved",
        "createdDate": "2026-01-15T09:00:00Z"
      }
    ]
  }
]
```

---

## 3. Business Logic Requirements

### 3.1 Credit Note Number Generation
- Format: `CN-YYYY-XXX` (e.g., CN-2026-001)
- Auto-increment counter resets yearly
- Must be unique across all credit notes

**Implementation:**
```csharp
public string GenerateCreditNoteNumber()
{
    var year = DateTime.Now.Year;
    var lastCreditNote = _context.CreditNotes
        .Where(cn => cn.CreditNoteNumber.StartsWith($"CN-{year}-"))
        .OrderByDescending(cn => cn.Id)
        .FirstOrDefault();
    
    int nextNumber = 1;
    if (lastCreditNote != null)
    {
        var parts = lastCreditNote.CreditNoteNumber.Split('-');
        if (parts.Length == 3 && int.TryParse(parts[2], out int lastNumber))
        {
            nextNumber = lastNumber + 1;
        }
    }
    
    return $"CN-{year}-{nextNumber:D3}";
}
```

### 3.2 Invoice Data Auto-Population
When creating a credit note with `invoiceId`:
1. Fetch the sale/invoice record
2. Auto-populate:
   - `invoiceNumber` from sale.saleNumber
   - `customerId` from sale.customerId
   - `customerName` from sale.customerName
   - `originalAmount` from sale.total

**Implementation:**
```csharp
public async Task<CreditNote> CreateCreditNote(CreateCreditNoteDto dto)
{
    // Fetch the invoice/sale
    var sale = await _context.Sales
        .Include(s => s.Customer)
        .FirstOrDefaultAsync(s => s.Id == dto.InvoiceId);
    
    if (sale == null)
        throw new NotFoundException("Invoice not found");
    
    // Validate credit amount
    if (dto.CreditAmount > sale.Total)
        throw new ValidationException("Credit amount cannot exceed original amount");
    
    var creditNote = new CreditNote
    {
        CreditNoteNumber = GenerateCreditNoteNumber(),
        InvoiceId = dto.InvoiceId,
        InvoiceNumber = sale.SaleNumber,
        CustomerId = sale.CustomerId,
        CustomerName = sale.CustomerName,
        OriginalAmount = sale.Total,
        CreditAmount = dto.CreditAmount,
        Reason = dto.Reason,
        Notes = dto.Notes,
        ReverseStock = dto.ReverseStock,
        ReverseSale = dto.ReverseSale,
        Status = "pending",
        CreatedDate = DateTime.UtcNow
    };
    
    _context.CreditNotes.Add(creditNote);
    await _context.SaveChangesAsync();
    
    return creditNote;
}
```

### 3.3 Stock Reversal Logic
When `reverseStock = true` and credit note is approved:
1. Get all items from the original sale (SaleItems table)
2. For each item, increase inventory quantity by the quantity sold
3. Update inventory last updated timestamp
4. Log the stock movement

**Implementation:**
```csharp
public async Task ReverseStock(int creditNoteId)
{
    var creditNote = await _context.CreditNotes
        .Include(cn => cn.Invoice)
        .ThenInclude(i => i.SaleItems)
        .FirstOrDefaultAsync(cn => cn.Id == creditNoteId);
    
    if (creditNote.ReverseStock && creditNote.Status == "approved")
    {
        foreach (var saleItem in creditNote.Invoice.SaleItems)
        {
            var inventoryItem = await _context.Inventory
                .FirstOrDefaultAsync(i => i.Id == saleItem.InventoryItemId);
            
            if (inventoryItem != null)
            {
                inventoryItem.CurrentStock += saleItem.Quantity;
                inventoryItem.LastUpdated = DateTime.UtcNow;
                
                // Log stock movement
                _context.StockMovements.Add(new StockMovement
                {
                    InventoryItemId = inventoryItem.Id,
                    Quantity = saleItem.Quantity,
                    MovementType = "Credit Note Return",
                    Reference = creditNote.CreditNoteNumber,
                    Date = DateTime.UtcNow
                });
            }
        }
        
        await _context.SaveChangesAsync();
    }
}
```

### 3.4 Sale Reversal Logic
When `reverseSale = true` and credit note is approved:
1. Update the sale status to "Credited" or add a flag
2. Update financial records
3. Reduce revenue totals if applicable

**Implementation:**
```csharp
public async Task ReverseSale(int creditNoteId)
{
    var creditNote = await _context.CreditNotes
        .Include(cn => cn.Invoice)
        .FirstOrDefaultAsync(cn => cn.Id == creditNoteId);
    
    if (creditNote.ReverseSale && creditNote.Status == "approved")
    {
        var sale = creditNote.Invoice;
        sale.HasCreditNote = true;
        sale.CreditedAmount = creditNote.CreditAmount;
        
        // If full credit, mark as reversed
        if (creditNote.CreditAmount >= sale.Total)
        {
            sale.Status = "Reversed";
        }
        
        await _context.SaveChangesAsync();
    }
}
```

### 3.5 Status Workflow
Valid status transitions:
- `pending` → `approved`
- `pending` → `rejected`
- `approved` → `completed`
- `rejected` → (no further transitions allowed)

When status changes to `approved`:
1. Set `approvedDate` to current timestamp
2. Set `approvedBy` to current user
3. Execute stock reversal if `reverseStock = true`
4. Execute sale reversal if `reverseSale = true`

### 3.6 File Upload Handling
- Accept only PDF files
- Maximum file size: 5MB
- Store files in `/uploads/credit-notes/` directory or cloud storage
- Filename format: `{CreditNoteNumber}.pdf` (e.g., `CN-2026-001.pdf`)
- Update database with file path and upload timestamp

**Implementation:**
```csharp
public async Task<DocumentUploadResult> UploadDocument(int creditNoteId, IFormFile file)
{
    // Validate file
    if (file.Length > 5 * 1024 * 1024) // 5MB
        throw new ValidationException("File size exceeds 5MB");
    
    if (file.ContentType != "application/pdf")
        throw new ValidationException("Only PDF files are allowed");
    
    var creditNote = await _context.CreditNotes.FindAsync(creditNoteId);
    if (creditNote == null)
        throw new NotFoundException("Credit note not found");
    
    // Generate file path
    var fileName = $"{creditNote.CreditNoteNumber}.pdf";
    var filePath = Path.Combine("uploads", "credit-notes", fileName);
    
    // Save file
    var fullPath = Path.Combine(_webHostEnvironment.WebRootPath, filePath);
    Directory.CreateDirectory(Path.GetDirectoryName(fullPath));
    
    using (var stream = new FileStream(fullPath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    
    // Update database
    creditNote.DocumentFileName = fileName;
    creditNote.DocumentFileUrl = $"/{filePath.Replace("\\", "/")}";
    creditNote.DocumentUploadedDate = DateTime.UtcNow;
    
    await _context.SaveChangesAsync();
    
    return new DocumentUploadResult
    {
        FileName = fileName,
        FileUrl = creditNote.DocumentFileUrl,
        UploadedDate = creditNote.DocumentUploadedDate.Value
    };
}
```

---

## 4. Data Transfer Objects (DTOs)

### CreateCreditNoteDto
```csharp
public class CreateCreditNoteDto
{
    [Required]
    public int InvoiceId { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal CreditAmount { get; set; }
    
    [Required]
    [StringLength(2000)]
    public string Reason { get; set; }
    
    [StringLength(2000)]
    public string Notes { get; set; }
    
    public bool ReverseStock { get; set; }
    
    public bool ReverseSale { get; set; }
}
```

### UpdateCreditNoteDto
```csharp
public class UpdateCreditNoteDto
{
    [Range(0.01, double.MaxValue)]
    public decimal? CreditAmount { get; set; }
    
    [StringLength(2000)]
    public string Reason { get; set; }
    
    [StringLength(2000)]
    public string Notes { get; set; }
    
    [RegularExpression("pending|approved|rejected|completed")]
    public string Status { get; set; }
    
    public string ApprovedBy { get; set; }
}
```

---

## 5. Frontend Integration Points

### 5.1 Component Files
The following components are already implemented in the frontend:

**Credit Notes Component:**
- `src/app/dashboard/sales/credit-notes/credit-notes.component.ts`
- `src/app/dashboard/sales/credit-notes/credit-notes.component.html`
- `src/app/dashboard/sales/credit-notes/credit-notes.component.scss`

**List Sales Component (Credited View):**
- `src/app/dashboard/sales/list-sales/list-sales.component.ts`
- `src/app/dashboard/sales/list-sales/list-sales.component.html`

### 5.2 Service Integration
Update the `SalesApiService`:
```typescript
// Add these methods to: src/app/dashboard/sales/services/sales-api.service.ts

getCreditNotes(): Observable<any> {
  return this.baseService.baseGet('/CreditNotes');
}

getCreditNoteById(id: number): Observable<any> {
  return this.baseService.baseGet(`/CreditNotes/${id}`);
}

createCreditNote(creditNote: any): Observable<any> {
  return this.baseService.basePost('/CreditNotes', creditNote);
}

updateCreditNote(id: number, creditNote: any): Observable<any> {
  return this.baseService.basePatch(`/CreditNotes/${id}`, creditNote);
}

deleteCreditNote(id: number): Observable<any> {
  return this.baseService.baseDelete(`/CreditNotes/${id}`);
}

uploadCreditNoteDocument(id: number, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  return this.baseService.basePost(`/CreditNotes/${id}/upload`, formData);
}

getCreditedSales(): Observable<any> {
  return this.baseService.baseGet('/Sales/Credited');
}
```

### 5.3 Current Mock Data
The frontend currently uses mock data. Replace these methods once API is ready:

**In credit-notes.component.ts:**
- Line 113: `getMockCreditNotes()` - Replace with API call to `/CreditNotes`
- Line 92: `getMockSales()` - Replace with API call to `/Sales`

**In list-sales.component.ts:**
- Line 211: Mock filter `sale.id % 2 === 0` - Replace with API call to `/Sales/Credited`

---

## 6. Testing Checklist

### 6.1 Credit Notes API
- [ ] Create credit note with valid invoice ID
- [ ] Create credit note with invalid invoice ID (should fail)
- [ ] Create credit note with credit amount > original amount (should fail)
- [ ] Retrieve all credit notes
- [ ] Retrieve single credit note by ID
- [ ] Filter credit notes by status
- [ ] Update credit note status from pending to approved
- [ ] Cannot update completed credit note
- [ ] Delete pending credit note
- [ ] Cannot delete approved credit note
- [ ] Upload PDF document (valid file)
- [ ] Upload non-PDF file (should fail)
- [ ] Upload file > 5MB (should fail)
- [ ] Download credit note document

### 6.2 Stock Reversal
- [ ] Approve credit note with reverseStock = true
- [ ] Verify inventory quantities increased correctly
- [ ] Verify stock movement logged
- [ ] Multiple items in sale are all reversed

### 6.3 Sale Reversal
- [ ] Approve credit note with reverseSale = true
- [ ] Verify sale marked as credited
- [ ] Partial credit applied correctly
- [ ] Full credit marks sale as reversed

### 6.4 Integration Tests
- [ ] Frontend displays credit notes from API
- [ ] Create credit note flow works end-to-end
- [ ] Invoice search returns correct results
- [ ] Auto-fill works when invoice selected
- [ ] PDF upload/download works
- [ ] Credited sales view displays correct data
- [ ] Filtering and searching works

---

## 7. Security Considerations

1. **Authorization:** Implement role-based access control
   - Only authorized users can approve credit notes
   - Managers/Admins can view all credit notes
   - Regular users can only view their own

2. **File Upload Security:**
   - Validate file type on server (don't trust client MIME type)
   - Scan uploaded files for malware
   - Store files outside web root or use cloud storage with access controls

3. **Audit Trail:**
   - Log all credit note status changes
   - Track who approved/rejected each credit note
   - Record stock reversal transactions

4. **Data Validation:**
   - Validate all input data on server side
   - Prevent SQL injection
   - Sanitize file names

---

## 8. Performance Optimization

1. **Indexing:**
   - Add indexes on frequently queried fields (InvoiceId, Status, CreatedDate)
   - Consider composite indexes for common filter combinations

2. **Pagination:**
   - Implement pagination for GET /api/CreditNotes endpoint
   - Default page size: 50 records
   - Include total count in response headers

3. **Caching:**
   - Cache credit note lookup by ID for 5 minutes
   - Cache sales data used for invoice search

---

## 9. Priority Implementation Order

**Phase 1 (Critical - Week 1):**
1. Create CreditNotes database table
2. Implement GET /api/CreditNotes
3. Implement GET /api/CreditNotes/{id}
4. Implement POST /api/CreditNotes
5. Update Sales API to include hasCreditNote flag

**Phase 2 (High Priority - Week 2):**
6. Implement PATCH /api/CreditNotes/{id}
7. Implement GET /api/Sales/Credited
8. Implement stock reversal logic
9. Implement sale reversal logic

**Phase 3 (Medium Priority - Week 3):**
10. Implement file upload endpoint
11. Implement file download endpoint
12. Add filtering and search capabilities
13. Implement DELETE endpoint

**Phase 4 (Low Priority - Week 4):**
14. Add audit logging
15. Implement pagination
16. Performance optimization
17. Security hardening

---

## 10. API Base URL Configuration

**Development:** `https://localhost:7295/api`
**Staging:** TBD
**Production:** TBD

Update in: `src/environments/environment.ts`

---

## Questions or Clarifications?

Contact: Frontend Development Team
Document Version: 1.0
Last Updated: January 16, 2026
