const XLSX = require('xlsx');
const fs = require('fs');

// Read the markdown file
const markdownContent = fs.readFileSync('./BACKEND_REQUIREMENTS_CREDIT_NOTES.md', 'utf8');

// Parse markdown sections
const sections = [];
let currentSection = { title: '', content: [] };

const lines = markdownContent.split('\n');

lines.forEach(line => {
  if (line.startsWith('# ')) {
    if (currentSection.title) {
      sections.push({ ...currentSection });
    }
    currentSection = { title: line.replace('# ', ''), content: [] };
  } else if (line.startsWith('## ')) {
    if (currentSection.content.length > 0) {
      sections.push({ ...currentSection });
    }
    currentSection = { title: line.replace('## ', ''), content: [] };
  } else if (line.trim()) {
    currentSection.content.push(line);
  }
});

if (currentSection.title) {
  sections.push(currentSection);
}

// Create workbook
const wb = XLSX.utils.book_new();

// Overview Sheet
const overviewData = [
  ['Backend Requirements - Credit Notes System'],
  [''],
  ['Document Version', '1.0'],
  ['Last Updated', 'January 16, 2026'],
  [''],
  ['Summary'],
  ['This document outlines the backend API requirements for the Credit Notes System and Credited Sales View functionality.'],
  ['The frontend has been implemented and is ready for API integration.']
];

const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');

// Database Schema Sheet
const dbSchemaData = [
  ['Database Schema Requirements'],
  [''],
  ['Table Name', 'CreditNotes'],
  [''],
  ['Column Name', 'Data Type', 'Constraints'],
  ['Id', 'INT', 'PRIMARY KEY IDENTITY(1,1)'],
  ['CreditNoteNumber', 'NVARCHAR(50)', 'UNIQUE NOT NULL'],
  ['InvoiceId', 'INT', 'NOT NULL, FK to Sales'],
  ['InvoiceNumber', 'NVARCHAR(50)', 'NOT NULL'],
  ['CustomerId', 'INT', 'NULL'],
  ['CustomerName', 'NVARCHAR(200)', 'NOT NULL'],
  ['OriginalAmount', 'DECIMAL(18,2)', 'NOT NULL'],
  ['CreditAmount', 'DECIMAL(18,2)', 'NOT NULL'],
  ['Reason', 'NVARCHAR(MAX)', 'NOT NULL'],
  ['Status', 'NVARCHAR(20)', "NOT NULL DEFAULT 'pending'"],
  ['ReverseStock', 'BIT', 'NOT NULL DEFAULT 0'],
  ['ReverseSale', 'BIT', 'NOT NULL DEFAULT 1'],
  ['Notes', 'NVARCHAR(MAX)', 'NULL'],
  ['DocumentFileName', 'NVARCHAR(255)', 'NULL'],
  ['DocumentFileUrl', 'NVARCHAR(500)', 'NULL'],
  ['DocumentUploadedDate', 'DATETIME', 'NULL'],
  ['CreatedDate', 'DATETIME', 'NOT NULL DEFAULT GETDATE()'],
  ['ApprovedDate', 'DATETIME', 'NULL'],
  ['ApprovedBy', 'NVARCHAR(100)', 'NULL'],
  ['LastUpdated', 'DATETIME', 'NOT NULL DEFAULT GETDATE()']
];

const wsDbSchema = XLSX.utils.aoa_to_sheet(dbSchemaData);
XLSX.utils.book_append_sheet(wb, wsDbSchema, 'Database Schema');

// API Endpoints Sheet
const apiEndpointsData = [
  ['API Endpoints'],
  [''],
  ['Method', 'Endpoint', 'Description', 'Status'],
  ['GET', '/api/CreditNotes', 'Get all credit notes with filtering', 'Phase 1 - Critical'],
  ['GET', '/api/CreditNotes/{id}', 'Get specific credit note by ID', 'Phase 1 - Critical'],
  ['POST', '/api/CreditNotes', 'Create new credit note', 'Phase 1 - Critical'],
  ['PATCH', '/api/CreditNotes/{id}', 'Update existing credit note', 'Phase 2 - High Priority'],
  ['DELETE', '/api/CreditNotes/{id}', 'Delete credit note (pending only)', 'Phase 3 - Medium Priority'],
  ['POST', '/api/CreditNotes/{id}/upload', 'Upload PDF document', 'Phase 3 - Medium Priority'],
  ['GET', '/api/CreditNotes/{id}/download', 'Download credit note document', 'Phase 3 - Medium Priority'],
  ['GET', '/api/Sales', 'Get sales (with credit note filter)', 'Phase 1 - Critical'],
  ['GET', '/api/Sales/Credited', 'Get all credited sales', 'Phase 2 - High Priority']
];

const wsApiEndpoints = XLSX.utils.aoa_to_sheet(apiEndpointsData);
XLSX.utils.book_append_sheet(wb, wsApiEndpoints, 'API Endpoints');

// Implementation Phases Sheet
const phasesData = [
  ['Implementation Phases'],
  [''],
  ['Phase', 'Priority', 'Timeline', 'Tasks'],
  ['Phase 1', 'Critical', 'Week 1', 'Create CreditNotes table, Implement GET/POST endpoints, Update Sales API'],
  ['Phase 2', 'High', 'Week 2', 'Implement PATCH endpoint, GET /Sales/Credited, Stock/Sale reversal logic'],
  ['Phase 3', 'Medium', 'Week 3', 'File upload/download, Filtering, DELETE endpoint'],
  ['Phase 4', 'Low', 'Week 4', 'Audit logging, Pagination, Performance optimization, Security']
];

const wsPhases = XLSX.utils.aoa_to_sheet(phasesData);
XLSX.utils.book_append_sheet(wb, wsPhases, 'Implementation Phases');

// Testing Checklist Sheet
const testingData = [
  ['Testing Checklist'],
  [''],
  ['Category', 'Test Case', 'Status'],
  ['Credit Notes API', 'Create credit note with valid invoice ID', 'Pending'],
  ['Credit Notes API', 'Create credit note with invalid invoice ID (should fail)', 'Pending'],
  ['Credit Notes API', 'Create credit note with amount > original (should fail)', 'Pending'],
  ['Credit Notes API', 'Retrieve all credit notes', 'Pending'],
  ['Credit Notes API', 'Retrieve single credit note by ID', 'Pending'],
  ['Credit Notes API', 'Filter credit notes by status', 'Pending'],
  ['Credit Notes API', 'Update credit note status to approved', 'Pending'],
  ['Credit Notes API', 'Cannot update completed credit note', 'Pending'],
  ['Credit Notes API', 'Delete pending credit note', 'Pending'],
  ['Credit Notes API', 'Cannot delete approved credit note', 'Pending'],
  ['Credit Notes API', 'Upload PDF document (valid)', 'Pending'],
  ['Credit Notes API', 'Upload non-PDF file (should fail)', 'Pending'],
  ['Credit Notes API', 'Upload file > 5MB (should fail)', 'Pending'],
  ['Credit Notes API', 'Download credit note document', 'Pending'],
  ['Stock Reversal', 'Approve credit note with reverseStock = true', 'Pending'],
  ['Stock Reversal', 'Verify inventory quantities increased', 'Pending'],
  ['Stock Reversal', 'Verify stock movement logged', 'Pending'],
  ['Stock Reversal', 'Multiple items reversed correctly', 'Pending'],
  ['Sale Reversal', 'Approve credit note with reverseSale = true', 'Pending'],
  ['Sale Reversal', 'Verify sale marked as credited', 'Pending'],
  ['Sale Reversal', 'Partial credit applied correctly', 'Pending'],
  ['Sale Reversal', 'Full credit marks sale as reversed', 'Pending'],
  ['Integration', 'Frontend displays credit notes from API', 'Pending'],
  ['Integration', 'Create credit note end-to-end flow', 'Pending'],
  ['Integration', 'Invoice search returns correct results', 'Pending'],
  ['Integration', 'Auto-fill works when invoice selected', 'Pending'],
  ['Integration', 'PDF upload/download works', 'Pending'],
  ['Integration', 'Credited sales view displays correctly', 'Pending'],
  ['Integration', 'Filtering and searching works', 'Pending']
];

const wsTesting = XLSX.utils.aoa_to_sheet(testingData);
XLSX.utils.book_append_sheet(wb, wsTesting, 'Testing Checklist');

// Frontend Integration Sheet
const frontendData = [
  ['Frontend Integration Points'],
  [''],
  ['Component', 'File Path', 'Purpose'],
  ['Credit Notes Component', 'src/app/dashboard/sales/credit-notes/credit-notes.component.ts', 'Credit notes management'],
  ['Credit Notes Template', 'src/app/dashboard/sales/credit-notes/credit-notes.component.html', 'Credit notes UI'],
  ['Credit Notes Styles', 'src/app/dashboard/sales/credit-notes/credit-notes.component.scss', 'Credit notes styling'],
  ['List Sales Component', 'src/app/dashboard/sales/list-sales/list-sales.component.ts', 'Sales list with credited view'],
  ['List Sales Template', 'src/app/dashboard/sales/list-sales/list-sales.component.html', 'Sales list UI'],
  ['Sales API Service', 'src/app/dashboard/sales/services/sales-api.service.ts', 'API integration service'],
  [''],
  ['Mock Data Lines to Replace'],
  ['credit-notes.component.ts', 'Line 113', 'getMockCreditNotes() -> API call to /CreditNotes'],
  ['credit-notes.component.ts', 'Line 92', 'getMockSales() -> API call to /Sales'],
  ['list-sales.component.ts', 'Line 211', 'Mock filter -> API call to /Sales/Credited']
];

const wsFrontend = XLSX.utils.aoa_to_sheet(frontendData);
XLSX.utils.book_append_sheet(wb, wsFrontend, 'Frontend Integration');

// Save the file
XLSX.writeFile(wb, 'BACKEND_REQUIREMENTS_CREDIT_NOTES.xlsx');

console.log('✅ Excel file created successfully: BACKEND_REQUIREMENTS_CREDIT_NOTES.xlsx');
console.log('📊 Sheets included:');
console.log('   - Overview');
console.log('   - Database Schema');
console.log('   - API Endpoints');
console.log('   - Implementation Phases');
console.log('   - Testing Checklist');
console.log('   - Frontend Integration');
