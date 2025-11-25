# 🧪 PDF Upload API Testing Guide

The Angular dev server is now running on `http://localhost:4200`. You have two ways to test the PDF Upload API:

---

## Option 1: Interactive HTML Test Tool (Recommended)

### How to Access:
1. Open the test tool file in a browser:
   ```
   file:///c:/Users/IT%20Department/Desktop/NDCANGU/PDF_UPLOAD_TEST_TOOL.html
   ```
   OR
   Locate the file: `PDF_UPLOAD_TEST_TOOL.html` and open with a browser

### Features:
✅ Graphical interface for all 6 tests
✅ Real-time response logging
✅ File upload with validation
✅ Error case testing
✅ No token setup required for read operations

### Quick Start:
1. **Copy your JWT token**
   - In your app at `http://localhost:4200`, open Developer Tools (F12)
   - Run: `localStorage.getItem('token')`
   - Copy the token value

2. **Paste in Test Tool**
   - Go to "Authentication Setup" section
   - Paste token in "JWT Token" field
   - Click "Verify Token"

3. **Run Tests**
   - **Test 1** (📋): Get training documents - no auth needed
   - **Test 2** (📥): Download PDF - no auth needed
   - **Test 3** (✔️): Validate file - select a PDF file first
   - **Test 4** (📤): Upload PDF - requires JWT token
   - **Test 5** (🗑️): Delete PDF - requires JWT token
   - **Test 6** (⚠️): Error cases

---

## Option 2: Browser Console Script

### How to Use:
1. Open your app: `http://localhost:4200`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Copy the entire content of: `PDF_UPLOAD_TEST_CONSOLE.js`
5. Paste into console and press Enter

### Available Console Commands:

#### Get JWT Token (required for some tests):
```javascript
// View your current token
localStorage.getItem('token')

// Set a token if needed
localStorage.setItem('token', 'YOUR_JWT_TOKEN_HERE')

// Clear token
localStorage.removeItem('token')
```

#### Test 1: List Documents (No Auth Required)
```javascript
testGetTrainingDocuments(1)  // Get documents for training session 1
```

#### Test 2: Download PDF (No Auth Required)
```javascript
testDownloadPDF(1, 'training_document')  // Download document 1
```

#### Test 3: Validate File (No Auth Required)
```javascript
// First select a file from input element with id='fileInput'
testFileValidation(document.getElementById('fileInput').files[0])
```

#### Test 4: Upload PDF (Requires Auth)
```javascript
// Create a mock PDF for testing
const mockFile = createMockPDFFile('test.pdf', 100);

// Upload it
testUploadPDF(mockFile, 1, 'Register', 'NDC_Training_Register');
```

#### Test 5: Delete PDF (Requires Auth)
```javascript
testDeletePDF(1)  // Delete document 1
```

#### Test 6: Test Error Cases (No Auth Required)
```javascript
testErrorCases()  // Test all error scenarios
```

---

## What to Expect from Backend Responses

### ✅ Success Responses

**GET Documents (200 OK):**
```json
{
  "trainingSessionId": 1,
  "documents": [
    {
      "id": 1,
      "fileName": "NDC_Training_Register",
      "fileSize": 245630,
      "documentType": "Register",
      "uploadedAt": "2025-11-25T12:45:30Z"
    }
  ]
}
```

**POST Upload (200 OK):**
```json
{
  "id": 101,
  "trainingSessionId": 1,
  "fileName": "NDC_Training_Register_Nov_2025",
  "originalFileName": "training_register.pdf",
  "fileSize": 245630,
  "documentType": "Register",
  "fileUrl": "/api/Training/DownloadPDF/101",
  "uploadedAt": "2025-11-25T12:45:30Z",
  "uploadedBy": 5,
  "mimeType": "application/pdf"
}
```

**GET Download (200 OK):**
- Binary PDF file content
- Header: `Content-Type: application/pdf`
- Header: `Content-Disposition: attachment; filename="document.pdf"`

**DELETE (204 No Content):**
- Empty response body
- Status: 204

### ❌ Error Responses

**400 Bad Request** - File validation error:
```json
{
  "error": "Invalid request",
  "message": "File size exceeds maximum allowed size of 10MB"
}
```

**401 Unauthorized** - Missing/invalid token:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

**404 Not Found** - Resource doesn't exist:
```json
{
  "error": "Document not found",
  "documentId": 999
}
```

---

## Testing Checklist

- [ ] **Test 1**: Can get documents from training session ✅
- [ ] **Test 2**: Can download PDF file ✅
- [ ] **Test 3**: File validation works for PDF ✅
- [ ] **Test 3**: File validation rejects non-PDF ✅
- [ ] **Test 3**: File validation rejects >10MB files ✅
- [ ] **Test 4**: Can upload PDF with auth token ✅
- [ ] **Test 4**: Upload fails without auth token ❌
- [ ] **Test 5**: Can delete PDF with auth token ✅
- [ ] **Test 5**: Delete fails without auth token ❌
- [ ] **Test 6**: 404 error for non-existent document ❌
- [ ] **Test 6**: 401 error for missing token ❌

---

## Common Issues & Solutions

### Issue: "CORS error" in browser console
**Solution**: Backend needs CORS headers configured. This will be set up on the backend.

### Issue: "401 Unauthorized" on upload/delete
**Solution**: Your JWT token is missing or invalid. 
- Run: `localStorage.getItem('token')`
- If empty, you need to login first in the app
- Then copy the token and paste into test tool

### Issue: "404 Not Found" for documents
**Solution**: Normal if no documents exist yet. This error is expected before upload.

### Issue: Upload button disabled in HTML test tool
**Solution**: Select a PDF file first using the file input field.

### Issue: "No valid JWT token" warning
**Solution**: 
1. Login to the app at `http://localhost:4200`
2. Copy token from browser console: `localStorage.getItem('token')`
3. Paste into test tool Authentication section

---

## Next Steps for Backend Team

Once you have tested the frontend and confirmed API contracts:

1. **Implement 4 endpoints** (see TRAINING_PDF_UPLOAD_API_REQUIREMENTS.md):
   - POST `/api/Training/UploadPDF`
   - GET `/api/Training/DownloadPDF/{documentId}`
   - GET `/api/Training/{trainingSessionId}/PDFs`
   - DELETE `/api/Training/DeletePDF/{documentId}`

2. **Create database table** `TrainingDocuments` with schema in requirements doc

3. **Test each endpoint** with the test tool once implemented

4. **Verify error handling** for all status codes (400, 401, 403, 404, 500)

---

## Backend Implementation Reference

Complete backend implementation examples are in:
- `TRAINING_PDF_UPLOAD_API_REQUIREMENTS.md` - Full API specs
- `FRONTEND_PDF_UPLOAD_INTEGRATION_GUIDE.md` - Frontend integration code

Files to review:
- C# controller and service examples
- Database schema (SQL)
- Request/response models
- Error handling patterns
- File storage recommendations
- Security best practices

---

## Test Tool Files Included

1. **PDF_UPLOAD_TEST_TOOL.html** - Interactive GUI test tool (open in browser)
2. **PDF_UPLOAD_TEST_CONSOLE.js** - Console commands (paste into DevTools console)
3. **TRAINING_PDF_UPLOAD_API_REQUIREMENTS.md** - Full API specification
4. **FRONTEND_PDF_UPLOAD_INTEGRATION_GUIDE.md** - Frontend code examples

---

## Running the Tests Now

### Quick Start (30 seconds):
1. Open test tool HTML file in browser
2. Copy your JWT token from app (F12 → Console → `localStorage.getItem('token')`)
3. Paste into test tool
4. Click "Test 1" button to verify API URL is correct
5. Follow the checklist above

**You should see the backend respond with either data or a meaningful error message.**

Current backend status:
- ❌ Endpoints not yet implemented
- ⏳ Ready for backend team to implement using the provided specs

---

## Support

If you encounter issues:
1. Check error message in browser console (F12)
2. Verify JWT token is valid and present
3. Confirm API URL is correct (default: https://ngcanduapi.azurewebsites.net)
4. Review the troubleshooting section above

Good luck! 🚀
