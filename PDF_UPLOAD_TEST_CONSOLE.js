// PDF Upload API Test Script
// Run this in browser console: ng.probe(ng.coreTokens.ApplicationRef.get()).injector.get(HttpClient)

// Configuration
const API_URL = 'https://ngcanduapi.azurewebsites.net';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token from localStorage

// Helper function to get token from localStorage
function getToken() {
  return localStorage.getItem('token') || JWT_TOKEN;
}

// Helper function to log responses
function logResponse(title, response) {
  console.log(`\n========== ${title} ==========`);
  console.log(JSON.stringify(response, null, 2));
  console.log('=====================================\n');
}

// TEST 1: Get all PDFs for a training session (No Auth Required)
function testGetTrainingDocuments(trainingSessionId = 1) {
  console.log(`📋 TEST 1: Getting documents for training session ${trainingSessionId}...`);

  fetch(`${API_URL}/api/Training/${trainingSessionId}/PDFs`)
    .then(response => response.json())
    .then(data => logResponse(`GET Documents - Success (200)`, data))
    .catch(error => console.error('❌ Error:', error));
}

// TEST 2: Download a PDF file (No Auth Required)
function testDownloadPDF(documentId = 1, fileName = 'training_document') {
  console.log(`📥 TEST 2: Downloading document ID ${documentId}...`);

  fetch(`${API_URL}/api/Training/DownloadPDF/${documentId}`)
    .then(response => {
      if (response.ok) {
        console.log('✅ Download Success (200 OK)');
        console.log('Content-Type:', response.headers.get('content-type'));
        console.log('Content-Disposition:', response.headers.get('content-disposition'));

        // To actually download: uncomment below
        // return response.blob().then(blob => {
        //   const url = window.URL.createObjectURL(blob);
        //   const a = document.createElement('a');
        //   a.href = url;
        //   a.download = `${fileName}.pdf`;
        //   document.body.appendChild(a);
        //   a.click();
        //   document.body.removeChild(a);
        // });
      }
      return response.text();
    })
    .then(data => logResponse(`GET DownloadPDF - Response`, data))
    .catch(error => console.error('❌ Error:', error));
}

// TEST 3: Get a specific document metadata
function testGetDocumentMetadata(documentId = 1) {
  console.log(`📄 TEST 3: Getting metadata for document ID ${documentId}...`);

  fetch(`${API_URL}/api/Training/Documents/${documentId}`)
    .then(response => response.json())
    .then(data => logResponse(`GET Document Metadata - Success (200)`, data))
    .catch(error => console.error('❌ Error (Expected if endpoint not implemented):', error));
}

// TEST 4: Upload PDF File (Requires Auth)
function testUploadPDF(file, trainingSessionId = 1, documentType = 'Register', fileName = null) {
  console.log(`📤 TEST 4: Uploading PDF file...`);

  const token = getToken();
  if (!token || token === 'YOUR_JWT_TOKEN_HERE') {
    console.error('❌ No valid JWT token. Set token in getToken() function or localStorage.setItem("token", "YOUR_TOKEN")');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('trainingSessionId', trainingSessionId.toString());
  formData.append('documentType', documentType);
  if (fileName) {
    formData.append('fileName', fileName);
  }

  console.log('Request FormData:');
  console.log('  - file:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
  console.log('  - trainingSessionId:', trainingSessionId);
  console.log('  - documentType:', documentType);
  console.log('  - fileName:', fileName || '(auto-generated)');

  fetch(`${API_URL}/api/Training/UploadPDF`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
    .then(response => {
      console.log(`Status: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => logResponse('POST UploadPDF - Response', data))
    .catch(error => console.error('❌ Error:', error));
}

// TEST 5: Delete PDF (Requires Auth)
function testDeletePDF(documentId = 1) {
  console.log(`🗑️  TEST 5: Deleting document ID ${documentId}...`);

  const token = getToken();
  if (!token || token === 'YOUR_JWT_TOKEN_HERE') {
    console.error('❌ No valid JWT token.');
    return;
  }

  fetch(`${API_URL}/api/Training/DeletePDF/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(`Status: ${response.status} ${response.statusText}`);
      if (response.status === 204) {
        console.log('✅ Document deleted successfully (204 No Content)');
        return null;
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        logResponse('DELETE DownloadPDF - Response', data);
      }
    })
    .catch(error => console.error('❌ Error:', error));
}

// TEST 6: Test file validation before upload
function testFileValidation(file) {
  console.log(`✔️ TEST 6: Validating file...`);

  const results = {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileSizeKB: (file.size / 1024).toFixed(2),
    fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
    validations: {}
  };

  // Check file type
  results.validations.isPDF = file.type === 'application/pdf';

  // Check file size (10MB = 10485760 bytes)
  const maxSizeBytes = 10 * 1024 * 1024;
  results.validations.isSizeValid = file.size <= maxSizeBytes;
  results.validations.maxSizeBytes = maxSizeBytes;

  logResponse('File Validation', results);

  if (results.validations.isPDF && results.validations.isSizeValid) {
    console.log('✅ File is valid for upload!');
  } else {
    console.error('❌ File validation failed!');
  }
}

// TEST 7: Test error cases
function testErrorCases() {
  console.log(`⚠️ TEST 7: Testing error cases...`);

  // Test 404 - Non-existent document
  console.log('\n→ Testing 404 Not Found (non-existent document)...');
  fetch(`${API_URL}/api/Training/DownloadPDF/999999`)
    .then(response => {
      console.log(`Status: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => logResponse('404 Error Response', data))
    .catch(error => console.error('❌ Error:', error));

  // Test 404 - Non-existent training session
  console.log('\n→ Testing 404 Not Found (non-existent training session)...');
  fetch(`${API_URL}/api/Training/999999/PDFs`)
    .then(response => {
      console.log(`Status: ${response.status} ${response.statusText}`);
      if (response.status === 404) {
        return response.json();
      }
      return null;
    })
    .then(data => {
      if (data) {
        logResponse('404 Training Session Not Found', data);
      }
    })
    .catch(error => console.error('Error:', error));
}

// HELPER: Create a mock PDF file for testing
function createMockPDFFile(fileName = 'test.pdf', sizeKB = 100) {
  const arraybuffer = new ArrayBuffer(sizeKB * 1024);
  const view = new Uint8Array(arraybuffer);

  // Add PDF header
  const header = '%PDF-1.4';
  for (let i = 0; i < header.length; i++) {
    view[i] = header.charCodeAt(i);
  }

  const blob = new Blob([arraybuffer], { type: 'application/pdf' });
  const file = new File([blob], fileName, { type: 'application/pdf' });

  console.log(`✅ Created mock PDF file: ${fileName} (${sizeKB} KB)`);
  return file;
}

// ============================================
// QUICK TEST COMMANDS (Copy & Paste These)
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════════╗
║         PDF Upload API Test Suite - Browser Console               ║
╚════════════════════════════════════════════════════════════════════╝

QUICK START TESTS:
1. List documents:
   testGetTrainingDocuments(1)

2. Download document:
   testDownloadPDF(1, 'my_document')

3. Validate file:
   testFileValidation(FILE_FROM_INPUT)

4. Upload file (requires auth token):
   const mockFile = createMockPDFFile('test.pdf', 100);
   testUploadPDF(mockFile, 1, 'Register', 'NDC_Training_Register');

5. Delete document (requires auth token):
   testDeletePDF(1)

6. Test error cases:
   testErrorCases()

SETUP:
- Set JWT token: localStorage.setItem('token', 'YOUR_JWT_TOKEN')
- Check token: localStorage.getItem('token')
- Update API_URL if needed at top of this script

RESPONSE CODES TO EXPECT:
✅ 200 OK      - Success with data returned
✅ 204 No Content - Success with no data (DELETE)
❌ 400 Bad Request - File validation error
❌ 401 Unauthorized - Invalid/missing JWT token
❌ 403 Forbidden - Permission denied
❌ 404 Not Found - Resource doesn't exist
❌ 500 Server Error - Backend error
`);
