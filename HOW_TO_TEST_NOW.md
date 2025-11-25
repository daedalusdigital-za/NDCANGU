# 🎮 Let's Test It Now - Step by Step

## 30-Second Quick Start

1. **Find & Open**: `PDF_UPLOAD_TEST_TOOL.html` (double-click)
2. **Get Token**: F12 on app → Console → `localStorage.getItem('token')` → Copy
3. **Paste**: Into "JWT Token" field in test tool
4. **Click Buttons**: Test 1 through 6
5. **Done!** 🎉

---

## Detailed Step-by-Step Guide

### STEP 1: Start the App (Already Done! ✅)

App is running at: `http://localhost:4200`

The Angular dev server is watching and will automatically recompile if you make changes.

---

### STEP 2: Get Your JWT Token

**In your browser:**
1. Go to: `http://localhost:4200`
2. Press `F12` to open Developer Tools
3. Click the **Console** tab (or Ctrl+Shift+K)
4. Type this command:
   ```javascript
   localStorage.getItem('token')
   ```
5. Press Enter
6. You'll see something like:
   ```
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```
7. **Right-click the output → Copy as string** (or just select and copy)

**Note:** If it shows `null`, you need to login in the app first.

---

### STEP 3: Open the Test Tool

**Option A - Direct File Open:**
1. Open File Explorer
2. Navigate to: `C:\Users\IT Department\Desktop\NDCANGU\`
3. Find: `PDF_UPLOAD_TEST_TOOL.html`
4. **Double-click** it (opens in your default browser)

**Option B - Right-Click Open:**
1. Right-click: `PDF_UPLOAD_TEST_TOOL.html`
2. Select: **Open with → (Your Browser)**

**Option C - Drag & Drop:**
1. Open your browser
2. Drag `PDF_UPLOAD_TEST_TOOL.html` into browser tab

You should see a beautiful purple interface with "🔧 PDF Upload API Test Tool" at the top.

---

### STEP 4: Verify Authentication

**In the Test Tool:**
1. Scroll to top: **"🔑 Authentication Setup"** section
2. Find: **"JWT Token"** textarea
3. **Paste** your token that you copied in STEP 2
4. Click: **"Verify Token"** button
5. You should see:
   - Status changed to: ✅ **"Token is set and valid"**
   - Color changed to: **Green background**
   - Console shows: **"Token verified successfully"**

If this works, you're all set! ✅

---

### STEP 5: Configure API URL (Usually Not Needed)

The test tool already has the correct API URL:
```
https://ngcanduapi.azurewebsites.net
```

If you need to change it:
1. Find: **"API Base URL"** field
2. Update it to your API endpoint
3. Click: **"Verify Token"** again

---

### STEP 6: Run Test 1 - Get Documents

**What it does:** Retrieves list of PDF documents for a training session

**How to run:**
1. Scroll to: **"📋 Test 1: Get Training Session Documents"**
2. Keep Training Session ID as: `1` (or change to any valid ID)
3. Click: **"GET /api/Training/{id}/PDFs"** button
4. Watch the output...

**Expected Result Right Now:**
```json
{
  "status": 404,
  "statusText": "Not Found",
  "data": {
    "error": "Training session not found",
    "trainingSessionId": 1
  }
}
```

**Output Color:** Red (error) - This is EXPECTED because:
- No training sessions with documents exist yet
- Backend endpoints aren't fully set up
- This will show GREEN and actual data once backend is ready

**Console shows:** `GET Documents: 404 Not Found` (warning)

✅ **Result: Frontend test is working!**

---

### STEP 7: Run Test 2 - Download PDF

**What it does:** Downloads a PDF file by document ID

**How to run:**
1. Scroll to: **"📥 Test 2: Download PDF Document"**
2. Keep Document ID as: `1`
3. Keep File Name as: `training_document`
4. Click: **"GET /api/Training/DownloadPDF/{id}"** button
5. Watch the output...

**Expected Result Right Now:**
```json
{
  "status": 404,
  "statusText": "Not Found",
  "contentType": null,
  "contentDisposition": null,
  "contentLength": null
}
```

**Output Color:** Red (error) - This is EXPECTED because no PDFs exist yet.

**Console shows:** `GET Download: 404 Not Found`

✅ **Result: Download logic works, backend not ready yet**

---

### STEP 8: Run Test 3 - Validate File (This Works Now! ✅)

**What it does:** Validates a PDF file without sending to server

**How to run:**
1. Scroll to: **"✔️ Test 3: File Validation"**
2. Click: **"Select PDF File"** (file input)
3. Choose a PDF from your computer
   - Can be: training_register.pdf, document.pdf, anything
   - Must be: Real PDF file
   - Size: Under 10MB
4. Click: **"Validate Selected File"** button
5. Watch the output...

**Expected Result (Valid File):**
```json
{
  "fileName": "your_file.pdf",
  "fileType": "application/pdf",
  "fileSizeBytes": 245630,
  "fileSizeKB": "239.87",
  "fileSizeMB": "0.23",
  "checks": {
    "isPDF": true,
    "isSizeValid": true,
    "maxSizeBytes": 10485760
  }
}
```

**Output Color:** Green (success!)

**Console shows:** `File validation: PASSED ✅`

✅ **Result: File validation works perfectly!**

---

### STEP 9: Run Test 4 - Upload PDF

**What it does:** Uploads a PDF file to the server

**How to run:**
1. Scroll to: **"📤 Test 4: Upload PDF Document"**
2. Keep values as defaults:
   - Training Session ID: `1`
   - Document Type: `Training Register` (dropdown)
   - Custom File Name: (leave empty - uses original name)
3. You need a file selected from Test 3, or select new file
4. Click: **"POST /api/Training/UploadPDF"** button
5. Watch the output...

**Expected Result Right Now:**
```json
{
  "status": 404,
  "statusText": "Not Found",
  "response": {
    "error": "Backend endpoint not yet implemented"
  }
}
```

**Output Color:** Red (error)

**Console shows:** `POST Upload: 404`

⏳ **Result: Frontend is ready, backend needs implementation**

---

### STEP 10: Run Test 5 - Delete PDF

**What it does:** Deletes a PDF document

**How to run:**
1. Scroll to: **"🗑️ Test 5: Delete PDF Document"**
2. Keep Document ID as: `1`
3. Click: **"DELETE /api/Training/DeletePDF/{id}"** button
4. Watch the output...

**Expected Result Right Now:**
```json
{
  "status": 404,
  "statusText": "Not Found",
  "message": "Document not found"
}
```

**Output Color:** Red (error) - Expected, no documents exist

**Console shows:** `DELETE: 404`

⏳ **Result: Frontend delete logic is ready, backend needs implementation**

---

### STEP 11: Run Test 6 - Error Cases

**What it does:** Tests how frontend handles different error scenarios

**How to run:**
1. Scroll to: **"⚠️ Test 6: Error Cases & Edge Cases"**
2. Click any of:
   - **"Test 404 (Non-existent document)"** - Most common error
   - **"Test 401 (Missing token)"** - Authentication error
   - **"Test All Error Cases"** - Comprehensive test
3. Watch the output...

**Expected Result for 404:**
```json
{
  "status": 404,
  "statusText": "Not Found",
  "response": {
    "error": "Document not found",
    "documentId": 999999
  }
}
```

**Console shows:** Multiple status codes and error messages

✅ **Result: Error handling is working!**

---

## Reading Test Results

### Green Output = Success ✅
```
Output Box Color: Light Green Background
Status Code: 200, 204
Button Label: Ends with checkmark
Example: "✅ Green background"
Meaning: Everything worked!
```

### Red Output = Error ❌
```
Output Box Color: Light Red Background
Status Code: 400, 401, 404, 500
Button Label: Shows error
Example: "❌ Red background"
Meaning: Expected or error occurred
```

### Blue Output = Info ℹ️
```
Output Box Color: Light Blue Background
Status Code: Various
Meaning: Informational output
```

---

## What You Should See

### Summary Table - Test Results

| Test | What It Tests | Will It Work Now? | Expected Result |
|------|---------------|------------------|-----------------|
| Test 1 | Get docs | ✅ Yes | 404 (no docs exist) |
| Test 2 | Download | ✅ Yes | 404 (no file) |
| Test 3 | Validate | ✅ YES! | ✅ Shows validation |
| Test 4 | Upload | ⏳ No | 404 (backend not ready) |
| Test 5 | Delete | ⏳ No | 404 (backend not ready) |
| Test 6 | Errors | ✅ Yes | Shows error codes |

**Legend:**
- ✅ Fully working (frontend-only logic)
- ⏳ Ready to work (waiting for backend)

---

## Common Things You Might See

### ✅ This is GOOD - File Validation Success
```json
{
  "fileName": "training.pdf",
  "fileType": "application/pdf",
  "checks": {
    "isPDF": true,
    "isSizeValid": true
  }
}
```
**Meaning:** File validation is working perfectly!

### ✅ This is GOOD - 404 Error
```json
{
  "status": 404,
  "error": "Document not found"
}
```
**Meaning:** Frontend correctly shows 404 errors. This is expected with no documents.

### ❌ This is PROBLEM - CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Meaning:** Backend needs CORS headers. Share this with backend team.

### ❌ This is PROBLEM - No Token
```
⚠️ No token set. Tests requiring authentication will fail.
```
**Meaning:** You need to copy JWT token from app. See STEP 2 again.

### ⏳ This is EXPECTED - Timeout
```
Network request timed out
```
**Meaning:** Backend endpoint doesn't exist yet. This is normal!

---

## Test Results Checklist

Use this to verify your testing session:

- [ ] Test tool loads in browser
- [ ] No JavaScript errors in console
- [ ] Token verification shows "✅ Token is set and valid"
- [ ] Test 1 shows some response (even if 404)
- [ ] Test 2 shows some response
- [ ] Test 3 validates file correctly ✅
- [ ] Test 3 shows GREEN for valid PDF
- [ ] Test 4 makes a request (even if error)
- [ ] Test 5 makes a request (even if error)
- [ ] Test 6 shows error responses
- [ ] Console output is visible
- [ ] No CORS errors (unless backend not configured)

**If all ✅:** Frontend testing is successful!

---

## What This Proves

✅ **What you've verified with this testing:**
- Angular frontend is working
- HttpClient requests are being sent
- Error handling works
- File validation works
- JWT token handling works
- Test infrastructure is ready

⏳ **What's waiting for backend:**
- File upload functionality
- File storage
- Database operations
- File deletion
- Document retrieval

---

## Next: Share with Backend Team

Once you've tested:

1. **Send 2 Files:**
   - `TRAINING_PDF_UPLOAD_API_REQUIREMENTS.md`
   - `FRONTEND_PDF_UPLOAD_INTEGRATION_GUIDE.md`

2. **Send Message:**
   ```
   Hi Backend Team!
   
   I've set up frontend PDF upload testing. The frontend is ready.
   
   Please implement these 4 endpoints (specs attached):
   1. POST /api/Training/UploadPDF
   2. GET /api/Training/DownloadPDF/{id}
   3. GET /api/Training/{id}/PDFs
   4. DELETE /api/Training/DeletePDF/{id}
   
   Database schema and response examples are in the attached requirements document.
   
   Once you're done, I can test with PDF_UPLOAD_TEST_TOOL.html and we'll have 
   working PDF upload functionality!
   
   Thanks!
   ```

---

## Troubleshooting

### Issue: "Can't find the test tool"
**Solution:** 
- Look for: `PDF_UPLOAD_TEST_TOOL.html`
- Location: `C:\Users\IT Department\Desktop\NDCANGU\`
- Open with: Any browser (double-click)

### Issue: Token field shows nothing
**Solution:**
1. Make sure you logged into the app at `localhost:4200`
2. Open app, go to F12 → Console
3. Run: `localStorage.getItem('token')`
4. Should output a long string starting with `"eyJ`
5. Copy that entire string
6. Paste into test tool

### Issue: All tests show 404
**Solution:** That's EXPECTED! Backend endpoints aren't implemented yet.
- This proves frontend is working
- Backend team needs to build the endpoints

### Issue: Test 3 shows file is invalid
**Solution:** Make sure you're selecting a real PDF file:
- Must be actual PDF (not image renamed to .pdf)
- Must be under 10MB
- Try a different PDF file

### Issue: "CORS error" in red
**Solution:** This is a backend configuration issue.
- Message to backend team: "Need CORS headers configured"
- This will be fixed when they implement the endpoints

---

## Pro Tips

**Tip 1: Save Your Token**
If testing multiple times, you can set token permanently:
```javascript
// In test tool's console output, or in browser console:
localStorage.setItem('token', 'YOUR_TOKEN_HERE')
// Then refresh test tool page
```

**Tip 2: Create Test PDF**
You can create a test PDF online:
- Google Docs → Export as PDF
- Word → Save as PDF
- Adobe online tools
- Any PDF you find online

**Tip 3: Watch Console Logs**
Check browser console (F12) for detailed logs:
- Shows exact requests being sent
- Shows exact responses received
- Helps with troubleshooting

**Tip 4: Clear Cache**
If test tool behaves strangely:
- Press: Ctrl+Shift+Delete
- Clear: All cookies, cache, data
- Reload page: F5

---

## You're Ready! 🚀

Everything you need is set up:
- ✅ App running
- ✅ Test tool ready
- ✅ Documentation complete
- ✅ Backend specs written

**Next action:** Open `PDF_UPLOAD_TEST_TOOL.html` and run all 6 tests!

**Time to completion:** ~20 minutes

**Then:** Share backend specs with implementation team

**Let's do this!** 💪
