# Training Sessions PDF Upload API Requirements

## Overview
The frontend Angular application requires backend API endpoints to support PDF file uploads for training sessions. This document outlines the technical requirements and specifications for implementing these features.

---

## 1. Training Session PDF Upload Endpoint

### Endpoint Specification

**POST** `/api/Training/UploadPDF`

### Purpose
Upload a PDF file (training register, attendance sheet, or training materials) and associate it with a training session.

### Request Format

**Content-Type:** `multipart/form-data`

**Authorization:** Required (JWT Bearer Token in Authorization header)

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File (binary) | Yes | PDF file to upload. Max size: 10MB. Mime type must be `application/pdf` |
| `trainingSessionId` | int | Yes | ID of the training session to associate with the PDF |
| `documentType` | string | Yes | Type of document: `"Register"`, `"AttendanceSheet"`, or `"Materials"` |
| `fileName` | string | No | Custom name for the file. If not provided, use original filename |
| `uploadedBy` | int | No | User ID of person uploading the file (optional, can be extracted from JWT token) |

### Request Example (cURL)
```bash
curl -X POST \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -F "file=@/path/to/training_register.pdf" \
  -F "trainingSessionId=1" \
  -F "documentType=Register" \
  -F "fileName=NDC_Training_Register_2025_11" \
  https://api.example.com/api/Training/UploadPDF
```

### Response - Success (200 OK)
```json
{
  "id": 101,
  "trainingSessionId": 1,
  "fileName": "NDC_Training_Register_2025_11",
  "originalFileName": "training_register.pdf",
  "fileSize": 245630,
  "documentType": "Register",
  "fileUrl": "/api/Training/DownloadPDF/101",
  "uploadedAt": "2025-11-25T12:45:30Z",
  "uploadedBy": 5,
  "mimeType": "application/pdf"
}
```

### Response - Error Cases

**400 Bad Request** - Invalid input
```json
{
  "error": "Invalid request",
  "message": "File size exceeds maximum allowed size of 10MB",
  "details": {
    "maxSize": "10MB",
    "uploadedSize": "15MB"
  }
}
```

**400 Bad Request** - Invalid file type
```json
{
  "error": "Invalid file type",
  "message": "Only PDF files are allowed",
  "acceptedMimeTypes": ["application/pdf"]
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

**404 Not Found**
```json
{
  "error": "Training session not found",
  "trainingSessionId": 999
}
```

**500 Internal Server Error**
```json
{
  "error": "File upload failed",
  "message": "An error occurred while saving the file"
}
```

---

## 2. Training Session PDF Download Endpoint

### Endpoint Specification

**GET** `/api/Training/DownloadPDF/{documentId}`

### Purpose
Download a previously uploaded PDF file associated with a training session.

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | int | Yes | ID of the document to download (from URL path) |

### Response - Success (200 OK)
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="NDC_Training_Register_2025_11.pdf"`
- **Body:** Binary PDF file

### Response - Error Cases

**404 Not Found**
```json
{
  "error": "Document not found",
  "documentId": 999
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "You do not have permission to download this document"
}
```

---

## 3. Get Training Session PDFs Endpoint

### Endpoint Specification

**GET** `/api/Training/{trainingSessionId}/PDFs`

### Purpose
Retrieve all PDF documents associated with a training session.

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trainingSessionId` | int | Yes | ID of the training session (from URL path) |

### Response - Success (200 OK)
```json
{
  "trainingSessionId": 1,
  "documents": [
    {
      "id": 101,
      "trainingSessionId": 1,
      "fileName": "NDC_Training_Register_2025_11",
      "originalFileName": "training_register.pdf",
      "fileSize": 245630,
      "documentType": "Register",
      "fileUrl": "/api/Training/DownloadPDF/101",
      "uploadedAt": "2025-11-25T12:45:30Z",
      "uploadedBy": 5,
      "mimeType": "application/pdf"
    },
    {
      "id": 102,
      "trainingSessionId": 1,
      "fileName": "Attendance_Sheet_2025_11",
      "originalFileName": "attendance.pdf",
      "fileSize": 123456,
      "documentType": "AttendanceSheet",
      "fileUrl": "/api/Training/DownloadPDF/102",
      "uploadedAt": "2025-11-25T13:00:00Z",
      "uploadedBy": 5,
      "mimeType": "application/pdf"
    }
  ]
}
```

---

## 4. Delete Training Session PDF Endpoint

### Endpoint Specification

**DELETE** `/api/Training/DeletePDF/{documentId}`

### Purpose
Delete a previously uploaded PDF file.

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentId` | int | Yes | ID of the document to delete (from URL path) |

### Authorization
Required (JWT Bearer Token - user must be admin or the original uploader)

### Response - Success (204 No Content)
```
[No body]
```

### Response - Error Cases

**404 Not Found**
```json
{
  "error": "Document not found",
  "documentId": 999
}
```

**403 Forbidden** - User doesn't have permission to delete
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to delete this document"
}
```

---

## 5. Backend Database Schema

### TrainingDocument Table
```sql
CREATE TABLE TrainingDocuments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TrainingSessionId INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    OriginalFileName NVARCHAR(255) NOT NULL,
    FileSize BIGINT NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    DocumentType NVARCHAR(50) NOT NULL, -- 'Register', 'AttendanceSheet', 'Materials'
    MimeType NVARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    UploadedAt DATETIME NOT NULL DEFAULT GETUTCDATE(),
    UploadedBy INT NOT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_TrainingDocuments_TrainingSession 
        FOREIGN KEY (TrainingSessionId) REFERENCES TrainingSessions(Id),
    CONSTRAINT FK_TrainingDocuments_User 
        FOREIGN KEY (UploadedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_TrainingDocuments_TrainingSessionId 
    ON TrainingDocuments(TrainingSessionId);
```

### Update TrainingSessions Table (if needed)
Add columns to track associated PDFs:
```sql
ALTER TABLE TrainingSessions ADD
    RegisterPdfId INT NULL,
    AttendanceSheetPdfId INT NULL,
    CONSTRAINT FK_TrainingSessions_RegisterPdf 
        FOREIGN KEY (RegisterPdfId) REFERENCES TrainingDocuments(Id),
    CONSTRAINT FK_TrainingSessions_AttendanceSheetPdf 
        FOREIGN KEY (AttendanceSheetPdfId) REFERENCES TrainingDocuments(Id);
```

---

## 6. File Storage Considerations

### Storage Location
- Store PDF files in a dedicated server directory: `/uploads/training-documents/{YYYY}/{MM}/{trainingSessionId}/`
- Or use cloud storage: Azure Blob Storage, AWS S3, etc.

### File Naming Convention
```
{DocumentType}_{TrainingSessionId}_{Timestamp}_{RandomString}.pdf

Example: Register_1_20251125_145300_a7b8c9.pdf
```

### Security Recommendations
1. Validate file MIME type server-side (not just extension)
2. Scan uploaded files with antivirus/malware detection
3. Restrict access to PDF files to authenticated users only
4. Implement file size limits (10MB recommended)
5. Store files outside the web root if possible
6. Use secure file permissions (read-only for application)
7. Implement audit logging for all file uploads/downloads/deletions

---

## 7. C# Implementation Example

### Model Classes
```csharp
public class TrainingDocumentUploadRequest
{
    public IFormFile File { get; set; }
    public int TrainingSessionId { get; set; }
    public string DocumentType { get; set; } // "Register", "AttendanceSheet", "Materials"
    public string FileName { get; set; }
    public int? UploadedBy { get; set; }
}

public class TrainingDocumentResponse
{
    public int Id { get; set; }
    public int TrainingSessionId { get; set; }
    public string FileName { get; set; }
    public string OriginalFileName { get; set; }
    public long FileSize { get; set; }
    public string DocumentType { get; set; }
    public string FileUrl { get; set; }
    public DateTime UploadedAt { get; set; }
    public int UploadedBy { get; set; }
    public string MimeType { get; set; }
}
```

### Controller Example
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TrainingController : ControllerBase
{
    private readonly ITrainingService _trainingService;
    private readonly IConfiguration _configuration;

    [HttpPost("UploadPDF")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadPDF(
        [FromForm] IFormFile file,
        [FromForm] int trainingSessionId,
        [FromForm] string documentType,
        [FromForm] string fileName = null)
    {
        // Validate file
        if (file == null || file.Length == 0)
            return BadRequest("File is required");
        
        if (file.ContentType != "application/pdf")
            return BadRequest("Only PDF files are allowed");
        
        if (file.Length > 10 * 1024 * 1024) // 10MB
            return BadRequest("File size exceeds 10MB limit");

        // Validate training session exists
        var trainingSession = await _trainingService.GetTrainingSessionAsync(trainingSessionId);
        if (trainingSession == null)
            return NotFound("Training session not found");

        // Upload file
        try
        {
            var result = await _trainingService.UploadTrainingDocumentAsync(
                file, trainingSessionId, documentType, fileName);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"File upload failed: {ex.Message}");
        }
    }

    [HttpGet("DownloadPDF/{documentId}")]
    public async Task<IActionResult> DownloadPDF(int documentId)
    {
        var document = await _trainingService.GetTrainingDocumentAsync(documentId);
        if (document == null)
            return NotFound("Document not found");

        var fileBytes = System.IO.File.ReadAllBytes(document.FilePath);
        return File(fileBytes, "application/pdf", document.OriginalFileName);
    }

    [HttpGet("{trainingSessionId}/PDFs")]
    public async Task<IActionResult> GetTrainingSessionPDFs(int trainingSessionId)
    {
        var documents = await _trainingService.GetTrainingDocumentsAsync(trainingSessionId);
        return Ok(new { trainingSessionId, documents });
    }

    [HttpDelete("DeletePDF/{documentId}")]
    public async Task<IActionResult> DeletePDF(int documentId)
    {
        var result = await _trainingService.DeleteTrainingDocumentAsync(documentId);
        if (!result)
            return NotFound("Document not found");
        
        return NoContent();
    }
}
```

---

## 8. Frontend Integration Points

The Angular frontend expects:
1. **File Upload Form** - Multi-part form submission
2. **Download Links** - URLs in format `/api/Training/DownloadPDF/{documentId}`
3. **Document List** - GET endpoint returning array of documents with metadata
4. **Delete Capability** - DELETE endpoint for removing documents
5. **Error Handling** - Proper HTTP status codes with JSON error messages

---

## 9. Testing Checklist

- [ ] Upload valid PDF file
- [ ] Reject non-PDF files
- [ ] Enforce file size limits
- [ ] Verify JWT authentication required
- [ ] Test concurrent uploads
- [ ] Verify file storage location
- [ ] Test file download functionality
- [ ] Verify file permissions (only authorized users can download)
- [ ] Test deletion of files
- [ ] Verify audit logging of all operations
- [ ] Test with missing TrainingSessionId
- [ ] Test with invalid documentType values
- [ ] Verify malware scanning (if implemented)

---

## 10. Performance Considerations

1. **Async File Operations** - Use async/await for I/O operations
2. **Streaming Downloads** - Stream large files instead of loading into memory
3. **Database Indexing** - Index `TrainingSessionId` and `UploadedAt` columns
4. **Cleanup Job** - Implement a scheduled job to delete orphaned files
5. **Caching** - Consider caching document list per training session
6. **Chunked Uploads** - For large files, implement chunked upload for better reliability

---

## Summary

The backend needs to implement 4 main endpoints:
1. **POST** `/api/Training/UploadPDF` - Upload PDF files
2. **GET** `/api/Training/DownloadPDF/{documentId}` - Download PDF files
3. **GET** `/api/Training/{trainingSessionId}/PDFs` - List documents for a training session
4. **DELETE** `/api/Training/DeletePDF/{documentId}` - Delete PDF files

All endpoints require JWT authentication and proper error handling as specified above.
