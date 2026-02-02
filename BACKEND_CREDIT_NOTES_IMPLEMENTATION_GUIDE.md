# Backend Credit Notes Implementation Guide

**Status:** Ready for Development  
**Priority:** High  
**Timeline:** 2-3 weeks (phased approach)  
**Date Created:** February 2, 2026

---

## 📋 Executive Summary

The **Credit Notes feature** is fully designed and ready for backend implementation. The frontend is built and waiting for API endpoints. This guide provides step-by-step instructions to build the backend API to support the Credit Notes module.

**Frontend Status:** ✅ Complete and functional (using mock data)  
**Backend Status:** ⏳ Requires implementation  
**Database Status:** ✅ Schema provided  
**API Base URL:** `https://ngcanduapi.azurewebsites.net/api`

---

## 🎯 What Needs to Be Built

**11 API Endpoints** to handle:
- Creating credit notes
- Viewing credit notes (with filtering)
- Updating credit notes
- Approving/rejecting credit notes
- Uploading/downloading documents
- Processing stock and sale reversals
- Querying credited sales

---

## 📊 Phase-Based Implementation Plan

### Phase 1: Foundation (Week 1) - CRITICAL
**Estimated Time:** 3-4 days  
**What:** Database setup + Core CRUD endpoints

- [ ] Create CreditNotes database table
- [ ] Implement GET /api/CreditNotes (all, no filters)
- [ ] Implement GET /api/CreditNotes/{id}
- [ ] Implement POST /api/CreditNotes (create)
- [ ] Test with Postman/Swagger

**Endpoints:** 3  
**Estimated Hours:** 12-16 hours

---

### Phase 2: Update & Filtering (Week 2) - HIGH PRIORITY
**Estimated Time:** 3-4 days  
**What:** Full CRUD + filtering + search

- [ ] Implement PATCH /api/CreditNotes/{id} (update)
- [ ] Implement DELETE /api/CreditNotes/{id}
- [ ] Add filtering to GET /api/CreditNotes
- [ ] Add search functionality
- [ ] Implement GET /api/Sales/Credited

**Endpoints:** 3 (enhanced)  
**Estimated Hours:** 14-18 hours

---

### Phase 3: Approval & Processing (Week 3) - MEDIUM PRIORITY
**Estimated Time:** 4-5 days  
**What:** Approval workflow + stock/sale reversals

- [ ] Implement POST /api/CreditNotes/{id}/approve
- [ ] Implement POST /api/CreditNotes/{id}/reject
- [ ] Implement stock reversal logic
- [ ] Implement sale reversal logic
- [ ] Add audit logging

**Endpoints:** 2 new  
**Estimated Hours:** 16-20 hours

---

### Phase 4: Document Upload (Week 4) - MEDIUM PRIORITY
**Estimated Time:** 3-4 days  
**What:** File handling + retrieval

- [ ] Implement POST /api/CreditNotes/{id}/upload
- [ ] Implement GET /api/CreditNotes/{id}/download
- [ ] Configure file storage (Azure Blob or local)
- [ ] Add file validation
- [ ] Test file operations

**Endpoints:** 2 new  
**Estimated Hours:** 12-16 hours

---

## 🗄️ Phase 1: Database Schema

### Create CreditNotes Table

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
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    ReverseStock BIT NOT NULL DEFAULT 0,
    ReverseSale BIT NOT NULL DEFAULT 1,
    Notes NVARCHAR(MAX) NULL,
    DocumentFileName NVARCHAR(255) NULL,
    DocumentFileUrl NVARCHAR(500) NULL,
    DocumentUploadedDate DATETIME NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    CreatedBy NVARCHAR(100) NULL,
    ApprovedDate DATETIME NULL,
    ApprovedBy NVARCHAR(100) NULL,
    LastUpdated DATETIME NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT FK_CreditNotes_Sales FOREIGN KEY (InvoiceId) REFERENCES Sales(Id),
    CONSTRAINT CK_CreditNotes_Status CHECK (Status IN ('pending', 'approved', 'rejected', 'completed'))
);

-- Create indexes for performance
CREATE INDEX IX_CreditNotes_InvoiceId ON CreditNotes(InvoiceId);
CREATE INDEX IX_CreditNotes_Status ON CreditNotes(Status);
CREATE INDEX IX_CreditNotes_CreatedDate ON CreditNotes(CreatedDate DESC);
CREATE INDEX IX_CreditNotes_CustomerId ON CreditNotes(CustomerId);
```

### Update Sales Table (Optional)

```sql
ALTER TABLE Sales
ADD HasCreditNote BIT NOT NULL DEFAULT 0,
    CreditedAmount DECIMAL(18,2) NULL;
```

---

## 📡 Phase 1: Core API Endpoints

### 1. GET /api/CreditNotes
**Retrieve all credit notes with optional filters**

**HTTP Method:** GET  
**Status Code:** 200 OK

**Query Parameters:**
```
status       (optional) - pending, approved, rejected, completed
customerId   (optional) - int, filter by customer
invoiceId    (optional) - int, filter by invoice/sale
dateFrom     (optional) - datetime, YYYY-MM-DD
dateTo       (optional) - datetime, YYYY-MM-DD
search       (optional) - string, search in CN#, customer name, invoice#
pageNumber   (optional) - int, default 1
pageSize     (optional) - int, default 50
```

**Example Requests:**
```
GET /api/CreditNotes
GET /api/CreditNotes?status=pending
GET /api/CreditNotes?status=approved&dateFrom=2026-01-01
GET /api/CreditNotes?search=CN-2026
```

**Response (200):**
```json
[
  {
    "id": 1,
    "creditNoteNumber": "CN-2026-001",
    "invoiceId": 45,
    "invoiceNumber": "SAL-202601-0023",
    "customerId": 12,
    "customerName": "Gauteng Provincial Hospital",
    "originalAmount": 15000.00,
    "creditAmount": 5000.00,
    "reason": "Damaged items returned",
    "status": "pending",
    "reverseStock": true,
    "reverseSale": true,
    "notes": "Customer reported damage",
    "documentFileName": "damage_report.pdf",
    "documentFileUrl": "/uploads/credit-notes/CN-2026-001.pdf",
    "documentUploadedDate": "2026-01-15T10:30:00Z",
    "createdDate": "2026-01-15T09:00:00Z",
    "createdBy": "admin@ndcangu.com",
    "approvedDate": null,
    "approvedBy": null,
    "lastUpdated": "2026-01-15T09:00:00Z"
  }
]
```

---

### 2. GET /api/CreditNotes/{id}
**Retrieve specific credit note by ID**

**HTTP Method:** GET  
**Status Code:** 200 OK  
**Error Codes:** 404 Not Found

**Example Request:**
```
GET /api/CreditNotes/1
```

**Response (200):**
```json
{
  "id": 1,
  "creditNoteNumber": "CN-2026-001",
  "invoiceId": 45,
  "invoiceNumber": "SAL-202601-0023",
  "customerId": 12,
  "customerName": "Gauteng Provincial Hospital",
  "originalAmount": 15000.00,
  "creditAmount": 5000.00,
  "reason": "Damaged items returned",
  "status": "pending",
  "reverseStock": true,
  "reverseSale": true,
  "notes": "Customer reported damage",
  "documentFileName": "damage_report.pdf",
  "documentFileUrl": "/uploads/credit-notes/CN-2026-001.pdf",
  "documentUploadedDate": "2026-01-15T10:30:00Z",
  "createdDate": "2026-01-15T09:00:00Z",
  "createdBy": "admin@ndcangu.com",
  "approvedDate": null,
  "approvedBy": null,
  "lastUpdated": "2026-01-15T09:00:00Z"
}
```

---

### 3. POST /api/CreditNotes
**Create a new credit note**

**HTTP Method:** POST  
**Status Code:** 201 Created  
**Error Codes:** 400 Bad Request, 404 Not Found (invoice)

**Request Body:**
```json
{
  "invoiceId": 45,
  "invoiceNumber": "SAL-202601-0023",
  "customerId": 12,
  "customerName": "Gauteng Provincial Hospital",
  "originalAmount": 15000.00,
  "creditAmount": 5000.00,
  "reason": "Damaged items returned",
  "reverseStock": true,
  "reverseSale": true,
  "notes": "Customer reported damage"
}
```

**Implementation Notes:**
- Auto-generate `CreditNoteNumber` in format: `CN-YYYY-XXX` (e.g., CN-2026-001)
- Auto-set `CreatedDate` to current timestamp
- Set `Status` to `pending` by default
- Validate `InvoiceId` exists in Sales table
- Validate `CreditAmount` ≤ `OriginalAmount`

**Response (201):**
```json
{
  "id": 1,
  "creditNoteNumber": "CN-2026-001",
  "invoiceId": 45,
  "invoiceNumber": "SAL-202601-0023",
  "customerId": 12,
  "customerName": "Gauteng Provincial Hospital",
  "originalAmount": 15000.00,
  "creditAmount": 5000.00,
  "reason": "Damaged items returned",
  "status": "pending",
  "reverseStock": true,
  "reverseSale": true,
  "notes": "Customer reported damage",
  "createdDate": "2026-01-15T09:00:00Z",
  "createdBy": "admin@ndcangu.com",
  "lastUpdated": "2026-01-15T09:00:00Z"
}
```

---

## 🔧 C# Implementation Template (Phase 1)

### Entity Model

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    [Table("CreditNotes")]
    public class CreditNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string CreditNoteNumber { get; set; }

        [Required]
        [ForeignKey("Sale")]
        public int InvoiceId { get; set; }

        [Required]
        [StringLength(50)]
        public string InvoiceNumber { get; set; }

        public int? CustomerId { get; set; }

        [Required]
        [StringLength(200)]
        public string CustomerName { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal OriginalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CreditAmount { get; set; }

        [Required]
        public string Reason { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "pending";

        public bool ReverseStock { get; set; } = false;

        public bool ReverseSale { get; set; } = true;

        public string Notes { get; set; }

        [StringLength(255)]
        public string DocumentFileName { get; set; }

        [StringLength(500)]
        public string DocumentFileUrl { get; set; }

        public DateTime? DocumentUploadedDate { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string CreatedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        [StringLength(100)]
        public string ApprovedBy { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; } = DateTime.Now;

        // Navigation
        public virtual Sale Sale { get; set; }
    }
}
```

### DTO Classes

```csharp
namespace YourNamespace.DTOs
{
    public class CreateCreditNoteDto
    {
        [Required]
        public int InvoiceId { get; set; }

        [Required]
        [StringLength(50)]
        public string InvoiceNumber { get; set; }

        public int? CustomerId { get; set; }

        [Required]
        [StringLength(200)]
        public string CustomerName { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal OriginalAmount { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal CreditAmount { get; set; }

        [Required]
        [StringLength(2000)]
        public string Reason { get; set; }

        public bool ReverseStock { get; set; } = false;

        public bool ReverseSale { get; set; } = true;

        [StringLength(2000)]
        public string Notes { get; set; }
    }

    public class CreditNoteResponseDto
    {
        public int Id { get; set; }
        public string CreditNoteNumber { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal OriginalAmount { get; set; }
        public decimal CreditAmount { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public bool ReverseStock { get; set; }
        public bool ReverseSale { get; set; }
        public string Notes { get; set; }
        public string DocumentFileName { get; set; }
        public string DocumentFileUrl { get; set; }
        public DateTime? DocumentUploadedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
```

### Controller Skeleton (Phase 1)

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YourNamespace.Models;
using YourNamespace.DTOs;
using YourNamespace.Data;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreditNotesController : ControllerBase
    {
        private readonly YourDbContext _context;

        public CreditNotesController(YourDbContext context)
        {
            _context = context;
        }

        // GET: api/CreditNotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreditNoteResponseDto>>> GetCreditNotes(
            [FromQuery] string status = null,
            [FromQuery] int? customerId = null,
            [FromQuery] int? invoiceId = null,
            [FromQuery] string dateFrom = null,
            [FromQuery] string dateTo = null,
            [FromQuery] string search = null)
        {
            try
            {
                // TODO: Implement filtering logic
                var creditNotes = _context.CreditNotes.AsQueryable();

                // Apply filters here
                if (!string.IsNullOrEmpty(status))
                {
                    creditNotes = creditNotes.Where(cn => cn.Status == status);
                }

                if (customerId.HasValue)
                {
                    creditNotes = creditNotes.Where(cn => cn.CustomerId == customerId);
                }

                if (invoiceId.HasValue)
                {
                    creditNotes = creditNotes.Where(cn => cn.InvoiceId == invoiceId);
                }

                if (!string.IsNullOrEmpty(search))
                {
                    var searchLower = search.ToLower();
                    creditNotes = creditNotes.Where(cn =>
                        cn.CreditNoteNumber.ToLower().Contains(searchLower) ||
                        cn.CustomerName.ToLower().Contains(searchLower) ||
                        cn.InvoiceNumber.ToLower().Contains(searchLower)
                    );
                }

                var result = await creditNotes
                    .OrderByDescending(cn => cn.CreatedDate)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error retrieving credit notes", error = ex.Message });
            }
        }

        // GET: api/CreditNotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CreditNoteResponseDto>> GetCreditNote(int id)
        {
            try
            {
                var creditNote = await _context.CreditNotes.FindAsync(id);
                if (creditNote == null)
                {
                    return NotFound(new { message = "Credit note not found" });
                }

                return Ok(creditNote);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error retrieving credit note", error = ex.Message });
            }
        }

        // POST: api/CreditNotes
        [HttpPost]
        public async Task<ActionResult<CreditNoteResponseDto>> CreateCreditNote(CreateCreditNoteDto dto)
        {
            try
            {
                // Validate invoice exists
                var sale = await _context.Sales.FindAsync(dto.InvoiceId);
                if (sale == null)
                {
                    return NotFound(new { message = "Invoice/Sale not found" });
                }

                // Validate credit amount
                if (dto.CreditAmount > dto.OriginalAmount)
                {
                    return BadRequest(new { message = "Credit amount cannot exceed original amount" });
                }

                // Generate credit note number
                var maxNumber = await _context.CreditNotes
                    .Where(cn => cn.CreditNoteNumber.StartsWith("CN-2026"))
                    .OrderByDescending(cn => cn.Id)
                    .FirstOrDefaultAsync();

                var nextNumber = (maxNumber == null ? 1 : int.Parse(maxNumber.CreditNoteNumber.Split("-")[2]) + 1);
                var creditNoteNumber = $"CN-2026-{nextNumber:D3}";

                var creditNote = new CreditNote
                {
                    CreditNoteNumber = creditNoteNumber,
                    InvoiceId = dto.InvoiceId,
                    InvoiceNumber = dto.InvoiceNumber,
                    CustomerId = dto.CustomerId,
                    CustomerName = dto.CustomerName,
                    OriginalAmount = dto.OriginalAmount,
                    CreditAmount = dto.CreditAmount,
                    Reason = dto.Reason,
                    ReverseStock = dto.ReverseStock,
                    ReverseSale = dto.ReverseSale,
                    Notes = dto.Notes,
                    Status = "pending",
                    CreatedDate = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow
                };

                _context.CreditNotes.Add(creditNote);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCreditNote), new { id = creditNote.Id }, creditNote);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error creating credit note", error = ex.Message });
            }
        }
    }
}
```

---

## ✅ Phase 1 Testing Checklist

### Postman Tests

**Test 1: Create Credit Note**
```
POST /api/CreditNotes
Body:
{
  "invoiceId": 45,
  "invoiceNumber": "SAL-202601-0023",
  "customerId": 12,
  "customerName": "Gauteng Provincial Hospital",
  "originalAmount": 15000.00,
  "creditAmount": 5000.00,
  "reason": "Damaged items returned",
  "reverseStock": true,
  "reverseSale": true,
  "notes": "Customer reported damage"
}

Expected: 201 Created + credit note with auto-generated CN number
```

**Test 2: Get All Credit Notes**
```
GET /api/CreditNotes

Expected: 200 OK + array of credit notes
```

**Test 3: Get Credit Note by ID**
```
GET /api/CreditNotes/1

Expected: 200 OK + single credit note object
```

**Test 4: Filter by Status**
```
GET /api/CreditNotes?status=pending

Expected: 200 OK + only pending credit notes
```

**Test 5: Search**
```
GET /api/CreditNotes?search=CN-2026

Expected: 200 OK + matching credit notes
```

---

## 🔗 Frontend Integration Points

The frontend is waiting for these endpoints at:
```
https://ngcanduapi.azurewebsites.net/api/CreditNotes
```

**Frontend Component:** `src/app/dashboard/sales/credit-notes/credit-notes.component.ts`

**Service:** `src/app/dashboard/sales/services/sales-api.service.ts`

**Currently:** Using mock data with TODO comments:
```typescript
// TODO: Replace with actual API call when backend is ready
```

---

## 📋 Next Phases Quick Reference

### Phase 2 Endpoints
- PATCH /api/CreditNotes/{id} - Update
- DELETE /api/CreditNotes/{id} - Delete
- GET /api/Sales/Credited - Get credited sales

### Phase 3 Endpoints
- POST /api/CreditNotes/{id}/approve - Approve with stock/sale reversal
- POST /api/CreditNotes/{id}/reject - Reject

### Phase 4 Endpoints
- POST /api/CreditNotes/{id}/upload - File upload
- GET /api/CreditNotes/{id}/download - File download

---

## 📞 Questions?

Refer to:
- [BACKEND_REQUIREMENTS_CREDIT_NOTES.md](./BACKEND_REQUIREMENTS_CREDIT_NOTES.md) - Full technical specifications
- [CREDIT_NOTES_FRONTEND_TESTING_GUIDE.md](./CREDIT_NOTES_FRONTEND_TESTING_GUIDE.md) - Frontend expectations

---

## 🚀 Getting Started

1. **Create the database table** using the SQL provided above
2. **Create the C# models** using the Entity model template
3. **Create the Controller** using the skeleton provided
4. **Implement Phase 1** (3 endpoints)
5. **Test with Postman** using the test cases provided
6. **Update the database context** to include CreditNotes DbSet
7. **Deploy to Azure** after successful local testing

**Estimated Time for Phase 1:** 12-16 hours

Good luck! The frontend is ready and waiting! 🎉
