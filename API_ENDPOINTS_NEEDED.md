# Required API Endpoints for NDCANGU Application

## 🎯 Summary
This document outlines all the API endpoints needed to replace hardcoded data in the NDCANGU Angular application, including detailed field requirements for each endpoint.

## 📊 Current API Status

### ✅ **Already Implemented APIs**
- **Authentication**: Login, Register, Phone Verification
- **User Management**: CRUD operations for users
- **Patient Management**: CRUD operations for patients  
- **Medical History**: Add and retrieve patient medical history
- **Document Upload**: External document upload service

### ❌ **Missing APIs (Currently Hardcoded)**

## 🎓 Training Module APIs

### Training Sessions
```http
GET    /api/Training/GetAll
GET    /api/Training/GetById?id={id}
POST   /api/Training/Add
PATCH  /api/Training/Update
DELETE /api/Training/Delete?id={id}
GET    /api/Training/GetByProvince?province={province}
GET    /api/Training/GetByDateRange?startDate={date}&endDate={date}
```

**Training Session Fields:**
- `id` (number) - Unique identifier
- `trainingName` (string, required) - Training session name
- `trainingType` (string, required) - Type of training
- `description` (string) - Training description
- `startDate` (date, required) - Start date
- `endDate` (date, required) - End date
- `startTime` (time, required) - Start time
- `endTime` (time, required) - End time
- `province` (string, required) - Province location
- `hospital` (string, required) - Hospital/venue
- `venue` (string, required) - Specific venue details
- `trainer` (string, required) - Assigned trainer
- `numberOfParticipants` (number, required, 1-100) - Expected participants
- `targetAudience` (string, required) - Target audience
- `objectives` (text) - Training objectives
- `materials` (text) - Required materials
- `status` (enum, required) - Planned|Scheduled|In Progress|Completed|Cancelled
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Update timestamp

### Trainers
```http
GET    /api/Trainer/GetAll
GET    /api/Trainer/GetById?id={id}
POST   /api/Trainer/Add
PATCH  /api/Trainer/Update
DELETE /api/Trainer/Delete?id={id}
GET    /api/Trainer/GetByProvince?province={province}
GET    /api/Trainer/GetStats?id={id}
```

**Trainer Fields:**
- `id` (number) - Unique identifier
- `name` (string, required) - Full name
- `email` (string, required) - Email address
- `phone` (string, required) - Phone number (+27 format)
- `province` (string, required) - Assigned province
- `qualification` (string) - Professional qualifications
- `experience` (number, min: 0) - Years of experience
- `status` (enum, required) - Active|Inactive|On Leave
- `location` (string) - Current location/city
- `bio` (text) - Biography or additional notes
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Update timestamp

### Training Reports & Registers
```http
GET    /api/TrainingReport/GetAll
POST   /api/TrainingReport/Generate
GET    /api/TrainingReport/Download?id={id}
GET    /api/TrainingRegister/GetAll
GET    /api/TrainingRegister/GetByTrainer?trainerId={id}
POST   /api/TrainingRegister/Upload
```

**Training Register Fields:**
- `id` (number) - Unique identifier
- `sessionTitle` (string, required) - Session title
- `trainer` (string, required) - Trainer name
- `date` (date, required) - Session date
- `venue` (string, required) - Venue location
- `participants` (number, required) - Number of participants
- `duration` (string, required) - Session duration
- `status` (enum, required) - Scheduled|In Progress|Completed|Cancelled
- `topic` (string, required) - Training topic
- `attendanceRate` (number, 0-100) - Attendance percentage
- `certificatesIssued` (number) - Certificates issued count
- `registerFile` (string) - File path/URL for register PDF

## 📈 Dashboard Data APIs

### Statistics
```http
GET    /api/Dashboard/GetTrainingStats
GET    /api/Dashboard/GetProvinceStats  
GET    /api/Dashboard/GetNationalTotals
GET    /api/Dashboard/GetOccupationStats
```

**Dashboard Statistics Fields:**
- `totalTrainingSessions` (number) - Total training sessions
- `totalTrainers` (number) - Total registered trainers
- `totalParticipants` (number) - Total participants trained
- `completionRate` (number, 0-100) - Overall completion percentage
- `provinceBreakdown` (array) - Training stats by province
  - `province` (string) - Province name
  - `sessions` (number) - Sessions in province
  - `participants` (number) - Participants in province
  - `trainers` (number) - Active trainers in province
- `monthlyStats` (array) - Monthly statistics
  - `month` (string) - Month/year
  - `sessions` (number) - Sessions conducted
  - `participants` (number) - Participants trained
  - `revenue` (number) - Generated revenue

### Equipment Distribution
```http
GET    /api/Dashboard/GetHGTMeterDistribution
GET    /api/Dashboard/GetHGTStripDistribution
GET    /api/Dashboard/GetEquipmentStats
```

**Equipment Distribution Fields:**
- `equipmentType` (string) - Type of equipment
- `totalOrdered` (number) - Total units ordered
- `totalDelivered` (number) - Total units delivered
- `deliveryRate` (number, 0-100) - Delivery percentage
- `provinceDistribution` (array) - Distribution by province
  - `province` (string) - Province name
  - `ordered` (number) - Units ordered
  - `delivered` (number) - Units delivered
  - `percentage` (number) - Percentage of total
- `itemBreakdown` (array) - Breakdown by item type
  - `itemType` (string) - Item description
  - `quantity` (number) - Quantity distributed
  - `value` (number) - Monetary value

## 🏥 Location/Hospital APIs

### Geographic Data
```http
GET    /api/Location/GetProvinces
GET    /api/Location/GetDistricts?province={province}
GET    /api/Location/GetHospitals
GET    /api/Location/GetHospitalsByProvince?province={province}
GET    /api/Location/GetClinics
GET    /api/Location/GetClinicsByProvince?province={province}
```

**Province Fields:**
- `name` (string, required) - Full province name
- `code` (string, required) - Province abbreviation (GP, WC, KZN, etc.)
- `population` (number) - Province population
- `healthFacilities` (number) - Number of health facilities

**Hospital/Clinic Fields:**
- `id` (number) - Unique identifier
- `name` (string, required) - Facility name
- `code` (string, required) - Facility code
- `province` (string, required) - Province name
- `district` (string) - District name
- `type` (enum, required) - Hospital|Clinic|CHC|Specialized
- `level` (enum) - Primary|Secondary|Tertiary
- `address` (string) - Physical address
- `contactNumber` (string) - Contact phone
- `email` (string) - Contact email
- `status` (enum, required) - Active|Inactive|Under Construction
- `capacity` (number) - Bed capacity
- `services` (array) - Available services list

## 📦 Inventory Management APIs

### Inventory Items
```http
GET    /api/Inventory/GetAll
GET    /api/Inventory/GetById?id={id}
POST   /api/Inventory/Add
PATCH  /api/Inventory/Update
DELETE /api/Inventory/Delete?id={id}
PATCH  /api/Inventory/UpdateStock
GET    /api/Inventory/GetLowStock
GET    /api/Inventory/GetByCategory?category={category}
```

**Inventory Item Fields:**
- `id` (number) - Unique identifier
- `itemNumber` (string, required) - NDOH item number (e.g., NDOH35002)
- `description` (string, required) - Item description
- `location` (string, required) - Storage location
- `uom` (string, required) - Unit of measure (Each, BOX, 50Pack)
- `category` (enum, required) - Hemoglobin Testing|Glucose Testing|HBA1C Testing|Multiparameter Testing|Quality Control|Equipment Accessories|Disposables|Medical Equipment
- `qtyOnHand` (number, required) - Quantity on hand
- `qtyOnPO` (number) - Quantity on purchase order
- `qtyOnSO` (number) - Quantity on sales order
- `stockAvailable` (number, calculated) - Available stock (qtyOnHand + qtyOnPO - qtyOnSO)
- `unitCostForQOH` (decimal, required) - Unit cost for quantity on hand
- `totalCostForQOH` (decimal, calculated) - Total cost (qtyOnHand * unitCostForQOH)
- `reorderLevel` (number) - Minimum stock level
- `maxStockLevel` (number) - Maximum stock level
- `supplier` (string) - Primary supplier
- `lastRestocked` (datetime) - Last restock date
- `expiryDate` (date) - Expiry date if applicable
- `status` (enum, required) - In Stock|Low Stock|Out of Stock|Discontinued
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Update timestamp

## 💰 Sales Management APIs

### Sales Records
```http
GET    /api/Sales/GetAll
GET    /api/Sales/GetById?id={id}
POST   /api/Sales/Add
PATCH  /api/Sales/Update
DELETE /api/Sales/Delete?id={id}
GET    /api/Sales/GetByDateRange?startDate={date}&endDate={date}
GET    /api/Sales/GetByProvince?province={province}
GET    /api/Sales/GetStats
```

**Sales Record Fields:**
- `id` (number) - Unique identifier
- `saleNumber` (string, required) - Unique sale number
- `saleDate` (date, required) - Sale date
- `province` (string, required) - Customer province
- `hospital` (string, required) - Customer hospital/facility
- `customerContact` (object, required) - Customer contact details
  - `name` (string) - Contact person name
  - `email` (string) - Contact email
  - `phone` (string) - Contact phone
- `items` (array, required) - Sale items
  - `productId` (number) - Product/inventory item ID
  - `productName` (string) - Product name
  - `quantity` (number) - Quantity sold
  - `unitPrice` (decimal) - Unit price
  - `totalPrice` (decimal) - Line total
- `subtotal` (decimal, calculated) - Sale subtotal
- `taxAmount` (decimal, calculated) - Tax amount
- `total` (decimal, calculated) - Sale total
- `paymentMethod` (enum) - Cash|Credit Card|Bank Transfer|Government Contract
- `paymentStatus` (enum, required) - Pending|Paid|Overdue|Cancelled
- `deliveryStatus` (enum, required) - Pending|In Transit|Delivered|Cancelled
- `deliveryDate` (date) - Expected/actual delivery date
- `notes` (text) - Additional notes
- `salesPerson` (string) - Sales representative
- `discount` (decimal) - Discount amount
- `invoiceNumber` (string) - Invoice reference
- `createdBy` (string, required) - User who created the sale
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Update timestamp

### Product Catalog
```http
GET    /api/Product/GetAll
GET    /api/Product/GetById?id={id}
POST   /api/Product/Add
PATCH  /api/Product/Update
DELETE /api/Product/Delete?id={id}
GET    /api/Product/GetByCategory?category={category}
```

**Product Fields:**
- `id` (number) - Unique identifier
- `name` (string, required) - Product name
- `category` (enum, required) - Hemoglobin Testing|Glucose Testing|HBA1C Testing|Multiparameter Testing|Quality Control|Equipment Accessories|Disposables|Medical Equipment
- `price` (decimal, required) - Current selling price
- `stock` (number, required) - Current stock level
- `supplier` (string, required) - Primary supplier
- `description` (text, required) - Product description
- `status` (enum, required) - In Stock|Low Stock|Out of Stock|Discontinued
- `lastRestocked` (datetime) - Last restock date
- `sku` (string) - Stock keeping unit
- `barcode` (string) - Product barcode
- `weight` (decimal) - Product weight (kg)
- `dimensions` (object) - Product dimensions
  - `length` (decimal) - Length (cm)
  - `width` (decimal) - Width (cm)
  - `height` (decimal) - Height (cm)
- `minimumOrderQuantity` (number) - Minimum order quantity
- `leadTime` (number) - Lead time in days
- `warranty` (string) - Warranty information
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Update timestamp

### Sales Dashboard Statistics
```http
GET    /api/Sales/GetDashboardStats
GET    /api/Sales/GetProvincialData
GET    /api/Sales/GetTopProducts
GET    /api/Sales/GetRecentSales
```

**Sales Dashboard Fields:**
- `totalSales` (number) - Total number of sales
- `monthlyRevenue` (decimal) - Current month revenue
- `totalProducts` (number) - Total products in catalog
- `averageOrderValue` (decimal) - Average order value
- `pendingOrders` (number) - Number of pending orders
- `provincialData` (array) - Sales data by province
  - `province` (string) - Province name
  - `totalOrdered` (number) - Total items ordered
  - `totalDelivered` (number) - Total items delivered
  - `revenue` (decimal) - Province revenue
  - `orderCount` (number) - Number of orders
- `topProducts` (array) - Best-selling products
  - `productId` (number) - Product ID
  - `productName` (string) - Product name
  - `quantitySold` (number) - Total quantity sold
  - `revenue` (decimal) - Product revenue
- `recentSales` (array) - Recent sales records (limited)
  - `id` (number) - Sale ID
  - `saleNumber` (string) - Sale number
  - `customerName` (string) - Customer name
  - `total` (decimal) - Sale total
  - `status` (string) - Sale status
  - `date` (datetime) - Sale date

## � Additional Supporting APIs

### File Upload & Management
```http
POST   /api/File/Upload
GET    /api/File/Download?id={id}
DELETE /api/File/Delete?id={id}
GET    /api/File/GetByType?type={type}
```

**File Fields:**
- `id` (number) - Unique identifier
- `fileName` (string, required) - Original file name
- `fileType` (string, required) - File type/extension
- `fileSize` (number, required) - File size in bytes
- `filePath` (string, required) - Server file path
- `uploadedBy` (string, required) - User who uploaded
- `uploadDate` (datetime, required) - Upload timestamp
- `category` (enum) - Training Register|Report|Document|Image
- `associatedId` (number) - Associated record ID
- `associatedType` (string) - Associated record type
- `isPublic` (boolean) - Public access flag

### Delivery Tracking
```http
GET    /api/Delivery/GetAll
GET    /api/Delivery/GetById?id={id}
POST   /api/Delivery/Add
PATCH  /api/Delivery/UpdateStatus
GET    /api/Delivery/GetByProvince?province={province}
GET    /api/Delivery/GetStatistics
```

**Delivery Record Fields:**
- `id` (number) - Unique identifier
- `deliveryNumber` (string, required) - Unique delivery number
- `saleId` (number, required) - Associated sale ID
- `institutionName` (string, required) - Delivery institution
- `province` (string, required) - Delivery province
- `itemDescription` (string, required) - Item description
- `quantity` (number, required) - Delivered quantity
- `deliveryDate` (date, required) - Delivery date
- `invoiceNumber` (string, required) - Invoice reference
- `status` (enum, required) - Pending|In Transit|Delivered|Failed|Returned
- `driverName` (string) - Delivery driver name
- `vehicleNumber` (string) - Delivery vehicle
- `recipient` (object) - Delivery recipient details
  - `name` (string) - Recipient name
  - `signature` (string) - Digital signature
  - `receivedDate` (datetime) - Received timestamp
- `notes` (text) - Delivery notes
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Update timestamp

## 🔧 Implementation Priority

### Phase 1 (High Priority) - Core Functionality
1. **Training Module APIs** - Most critical for core functionality
   - Training Sessions (CRUD with all fields)
   - Trainers (CRUD with all fields)
   - Training Registers (Upload and tracking)
2. **Location/Hospital APIs** - Referenced across multiple modules
   - Provinces, Districts, Hospitals, Clinics
3. **Dashboard Statistics APIs** - Essential for accurate reporting
   - Training stats, Province stats, Equipment distribution

### Phase 2 (Medium Priority) - Business Operations
1. **Inventory Management APIs** - Product management functionality
   - Complete inventory CRUD with stock tracking
   - Low stock alerts and reorder management
2. **Sales Management APIs** - Transaction processing
   - Sales CRUD operations
   - Product catalog management
3. **File Management APIs** - Document handling
   - Upload, download, categorization

### Phase 3 (Lower Priority) - Analytics & Enhancement
1. **Advanced Dashboard APIs** - Enhanced analytics
   - Provincial breakdowns, trend analysis
2. **Delivery Tracking APIs** - Logistics management
   - Delivery status tracking and reporting
3. **Advanced Sales Reports** - Detailed analytics
   - Performance metrics, forecasting

## 📋 Data Validation Rules

### Common Validation Patterns
- **Phone Numbers**: Must match pattern `^\+?[0-9]{10,15}$`
- **Email Addresses**: Must be valid email format
- **Dates**: ISO 8601 format (YYYY-MM-DD)
- **Provinces**: Must be one of the 9 South African provinces
- **Status Fields**: Must match defined enum values
- **Monetary Values**: Decimal with 2 decimal places, non-negative
- **Quantities**: Integer values, non-negative
- **Percentages**: Number between 0-100

### Required Field Validation
- All fields marked as `required` must be provided
- String fields with `minLength` must meet minimum character requirements
- Number fields with `min/max` must be within specified ranges
- Enum fields must match one of the predefined values

### Business Logic Validation
- **Training Sessions**: End date must be after start date
- **Inventory**: Stock available calculation must be accurate
- **Sales**: Total must equal sum of line items plus tax
- **Delivery**: Delivery date must be after sale date
- **Trainers**: Email must be unique across all trainers

## 📋 Current Hardcoded Data Locations

### Files with Hardcoded Data:
- `/src/app/dashboard/dashboard.component.ts` - Dashboard statistics, province data
- `/src/app/dashboard/sales/product-management/product-management.component.ts` - Inventory items (18 NDOH items)
- `/src/app/dashboard/training/add-training/add-training.component.ts` - Trainers list, hospitals, provinces
- `/src/app/dashboard/training/trainers/trainers.component.ts` - 6 trainer profiles (ZIBA, LINDANI, etc.)
- `/src/app/dashboard/training/training-reports/training-reports.component.ts` - Training session data, registers
- `/src/app/services/global/global.service.ts` - 9 provinces, districts, 150+ institutions/clinics
- `/src/app/services/delivery-data.service.ts` - 80+ delivery records with equipment distribution
- `/src/app/dashboard/sales/sales-dashboard/sales-dashboard.component.ts` - Provincial sales data
- `/src/app/dashboard/reports.component.ts` - Hospital lists by province, test types
- `/src/app/dashboard/calendar/calendar.component.ts` - Training calendar events

## 🎯 Benefits of API Implementation

1. **Dynamic Data**: Real-time updates instead of static arrays
2. **Scalability**: Easy to add new data without code changes
3. **Consistency**: Single source of truth for all data
4. **Maintenance**: Easier to update and manage data
5. **Multi-user**: Support for concurrent users and data sharing
6. **Reporting**: Accurate analytics based on live data
7. **Data Integrity**: Proper validation and business rules
8. **Security**: Role-based access control and data protection
9. **Audit Trail**: Track changes and user actions
10. **Performance**: Optimized queries and caching

## 🔄 Migration Strategy

### Phase 1: Infrastructure Setup (Weeks 1-2)
1. **Database Design**: Create tables based on field specifications
2. **API Framework**: Set up backend API framework
3. **Authentication**: Extend existing auth system
4. **Base Service Classes**: Create Angular service classes

### Phase 2: Core APIs Development (Weeks 3-8)
1. **Location APIs**: Provinces, districts, hospitals, clinics
2. **Training APIs**: Sessions, trainers, registers
3. **Dashboard APIs**: Statistics and equipment distribution
4. **Error Handling**: Comprehensive error handling and logging

### Phase 3: Business APIs Development (Weeks 9-16)
1. **Inventory APIs**: Complete inventory management
2. **Sales APIs**: Sales transactions and product catalog
3. **File Management**: Upload, download, categorization
4. **Data Migration**: Import existing hardcoded data

### Phase 4: Testing & Optimization (Weeks 17-20)
1. **Integration Testing**: End-to-end API testing
2. **Performance Testing**: Load testing and optimization
3. **User Acceptance Testing**: Business user validation
4. **Documentation**: API documentation and user guides

### Frontend Integration Strategy
1. **Create API Service Classes**: Dedicated service for each module
2. **Add Error Handling**: Proper fallback mechanisms for API failures  
3. **Mock Data Fallback**: Keep mock data for development/demo purposes
4. **Gradual Migration**: Replace hardcoded data module by module
5. **Component Updates**: Update components to use API services
6. **State Management**: Implement proper state management for API data
7. **Caching Strategy**: Implement caching for frequently accessed data
8. **Loading States**: Add loading indicators and skeleton screens

## 📊 Estimated Implementation Timeline

| Phase | Duration | Deliverables | Dependencies |
|-------|----------|--------------|--------------|
| **Phase 1** | 2 weeks | Database schema, API framework, auth | None |
| **Phase 2** | 6 weeks | Core APIs (Training, Location, Dashboard) | Phase 1 |
| **Phase 3** | 8 weeks | Business APIs (Inventory, Sales, Files) | Phase 2 |
| **Phase 4** | 4 weeks | Testing, optimization, documentation | Phase 3 |
| **Total** | **20 weeks** | Complete API ecosystem | - |

## 🔗 API Response Standards

### Success Response Format
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Pagination Response Format
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

**📝 Document Status**: Ready for Backend Development Team  
**📅 Last Updated**: December 2024  
**👥 Stakeholders**: Development Team, Product Owner, QA Team  
**🔄 Version**: 2.0 with detailed field specifications