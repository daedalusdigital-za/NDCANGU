# NDCANGU API Requirements Guide

## 📋 **Document Overview**

This document serves as a comprehensive guide for backend developers to understand the API requirements for the NDCANGU (Non-Communicable Diseases) Healthcare Management System. It outlines the data structures, endpoints, business logic, and technical specifications needed to support the Angular frontend application.

---

## 🎯 **Application Context**

### **Domain**: Healthcare Training & Management
### **Primary Purpose**: 
- Manage healthcare training programs across South African provinces
- Track medical equipment distribution and inventory
- Monitor patient records and medical histories
- Generate comprehensive healthcare reports

### **Key Users**:
- Healthcare Administrators
- Medical Trainers
- Healthcare Professionals
- System Administrators

---

## 🏗️ **System Architecture Requirements**

### **Technical Stack Recommendations**
- **API Framework**: .NET Core/ASP.NET Core, Node.js, or Python (Django/FastAPI)
- **Database**: SQL Server, PostgreSQL, or MySQL
- **Authentication**: JWT Token-based authentication
- **File Storage**: Azure Blob Storage or AWS S3 for documents
- **Caching**: Redis for performance optimization

### **API Standards**
- **Protocol**: RESTful API over HTTPS
- **Response Format**: JSON
- **Authentication**: Bearer Token (JWT)
- **Error Handling**: Standardized error responses
- **Versioning**: URL-based versioning (/api/v1/)

---

## 🔐 **Authentication & Authorization**

### **Authentication Requirements**

#### **Endpoints Needed**
```http
POST /api/Auth/Login
POST /api/Auth/Register  
POST /api/Auth/VeifyRegistration
POST /api/Auth/RefreshToken
POST /api/Auth/Logout
POST /api/Auth/ForgotPassword
POST /api/Auth/ResetPassword
```

#### **Login Request/Response**
```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword"
}

// Response
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+27123456789",
    "role": ["Administrator"],
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "Login successful"
}
```

#### **User Registration**
```json
// Request
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "phoneNumber": "+27123456789",
  "password": "securePassword",
  "confirmPassword": "securePassword",
  "positionName": "Nurse",
  "province": "Gauteng"
}
```

### **Authorization Levels**
- **Administrator**: Full system access
- **Trainer**: Training management and reporting
- **Healthcare Professional**: Patient management and training participation
- **Viewer**: Read-only access to reports

---

## 👥 **User Management Module**

### **Data Models**

#### **User Entity**
```json
{
  "id": "string (UUID)",
  "firstName": "string",
  "lastName": "string", 
  "email": "string (unique)",
  "phoneNumber": "string",
  "positionName": "string",
  "positionDesc": "string",
  "province": "string",
  "district": "string",
  "facility": "string",
  "isActive": "boolean",
  "roles": ["string[]"],
  "createdDate": "datetime",
  "lastLoginDate": "datetime"
}
```

### **Business Logic Requirements**
- Email uniqueness validation
- Phone number format validation (South African format)
- Password complexity requirements
- Role-based access control
- User activity tracking
- Soft delete functionality

### **API Endpoints**
```http
GET    /api/User/GetUsers              # List all users with pagination
GET    /api/User/GetUserById?id={id}   # Get specific user details
POST   /api/User/Add                   # Create new user
PATCH  /api/User/UpdateUser           # Update user information
DELETE /api/User/Delete?id={id}       # Soft delete user
GET    /api/User/GetByRole?role={role} # Get users by role
GET    /api/User/Search?query={query}  # Search users
```

---

## 🎓 **Training Management Module**

### **Core Entities**

#### **Training Session**
```json
{
  "id": "string (UUID)",
  "sessionTitle": "string",
  "description": "string",
  "trainerId": "string (FK)",
  "trainerName": "string",
  "startDate": "datetime",
  "endDate": "datetime", 
  "duration": "string",
  "venue": "string",
  "hospitalId": "string (FK)",
  "province": "string",
  "district": "string",
  "maxParticipants": "integer",
  "currentParticipants": "integer",
  "status": "enum (Planned, In Progress, Completed, Cancelled)",
  "topic": "string",
  "trainingType": "string",
  "materials": ["string[]"],
  "createdDate": "datetime",
  "updatedDate": "datetime"
}
```

#### **Trainer**
```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "province": "string",
  "qualification": "string",
  "experience": "integer",
  "specializations": ["string[]"],
  "status": "enum (Active, Inactive, On Leave)",
  "location": "string",
  "bio": "string",
  "certifications": ["string[]"],
  "averageRating": "decimal",
  "totalSessions": "integer",
  "totalParticipants": "integer"
}
```

#### **Training Participant**
```json
{
  "id": "string (UUID)",
  "trainingSessionId": "string (FK)",
  "userId": "string (FK)", 
  "participantName": "string",
  "occupation": "enum (EN, ENA, CNP, CNS, PN, OT, CG, ADMIN, DATA_CAPTURE, NURSE)",
  "facility": "string",
  "province": "string",
  "enrollmentDate": "datetime",
  "attendanceStatus": "enum (Enrolled, Attended, Completed, No Show)",
  "certificateIssued": "boolean",
  "completionDate": "datetime",
  "feedback": "string",
  "rating": "integer (1-5)"
}
```

### **Business Logic Requirements**
- Training session capacity management
- Automatic participant enrollment
- Certificate generation upon completion
- Trainer availability validation
- Venue conflict detection
- Automated email notifications
- Attendance tracking
- Performance analytics

### **API Endpoints**
```http
# Training Sessions
GET    /api/Training/GetAll
GET    /api/Training/GetById?id={id}
POST   /api/Training/Add
PATCH  /api/Training/Update
DELETE /api/Training/Delete?id={id}
GET    /api/Training/GetByProvince?province={province}
GET    /api/Training/GetByTrainer?trainerId={id}
GET    /api/Training/GetByDateRange?start={date}&end={date}
POST   /api/Training/EnrollParticipant
GET    /api/Training/GetParticipants?trainingId={id}

# Trainers
GET    /api/Trainer/GetAll
GET    /api/Trainer/GetById?id={id}
POST   /api/Trainer/Add
PATCH  /api/Trainer/Update
DELETE /api/Trainer/Delete?id={id}
GET    /api/Trainer/GetByProvince?province={province}
GET    /api/Trainer/GetStats?id={id}
GET    /api/Trainer/GetAvailability?id={id}&date={date}
```

---

## 🏥 **Patient Management Module**

### **Patient Entity**
```json
{
  "id": "string (UUID)",
  "patientNumber": "string (unique)",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "date",
  "gender": "enum (Male, Female, Other)",
  "idNumber": "string",
  "phoneNumber": "string",
  "email": "string",
  "address": {
    "street": "string",
    "city": "string", 
    "province": "string",
    "postalCode": "string"
  },
  "emergencyContact": {
    "name": "string",
    "relationship": "string", 
    "phoneNumber": "string"
  },
  "medicalAidNumber": "string",
  "facility": "string",
  "isActive": "boolean",
  "createdDate": "datetime",
  "lastVisitDate": "datetime"
}
```

### **Medical History Entity**
```json
{
  "id": "string (UUID)",
  "patientId": "string (FK)",
  "visitDate": "datetime",
  "facilityName": "string",
  "healthcareProvider": "string",
  "symptoms": ["string[]"],
  "diagnosis": "string",
  "treatment": "string",
  "medications": ["string[]"],
  "vitalSigns": {
    "bloodPressure": "string",
    "heartRate": "integer",
    "temperature": "decimal",
    "weight": "decimal",
    "height": "decimal"
  },
  "testResults": ["string[]"],
  "notes": "string",
  "followUpRequired": "boolean",
  "followUpDate": "datetime"
}
```

### **API Endpoints**
```http
# Patients
GET    /api/Patient/GetAll
GET    /api/Patient/GetById?id={id}
POST   /api/Patient/Add
PATCH  /api/Patient/Update
DELETE /api/Patient/Delete?id={id}
GET    /api/Patient/Search?query={query}
GET    /api/Patient/GetByFacility?facility={facility}

# Medical History
GET    /api/MedicalHistory/GetByPatientId?id={id}
POST   /api/MedicalHistory/Add
PATCH  /api/MedicalHistory/Update
DELETE /api/MedicalHistory/Delete?id={id}
```

---

## 📦 **Inventory Management Module**

### **Inventory Item Entity**
```json
{
  "id": "string (UUID)",
  "itemNumber": "string (unique)",
  "description": "string",
  "category": "string",
  "subCategory": "string",
  "manufacturer": "string",
  "modelNumber": "string",
  "serialNumber": "string",
  "location": "string",
  "facility": "string",
  "uom": "string (Unit of Measure)",
  "qtyOnHand": "integer",
  "qtyOnPO": "integer (Purchase Orders)",
  "qtyOnSO": "integer (Sales Orders)",
  "stockAvailable": "integer",
  "unitCostForQOH": "decimal",
  "totalCostForQOH": "decimal (calculated)",
  "reorderLevel": "integer",
  "maxStockLevel": "integer",
  "lastStockUpdate": "datetime",
  "expiryDate": "datetime",
  "supplier": "string",
  "isActive": "boolean"
}
```

### **Stock Movement Entity**
```json
{
  "id": "string (UUID)",
  "itemId": "string (FK)",
  "movementType": "enum (In, Out, Transfer, Adjustment)",
  "quantity": "integer",
  "fromLocation": "string",
  "toLocation": "string", 
  "reason": "string",
  "reference": "string",
  "movementDate": "datetime",
  "createdBy": "string (User ID)",
  "approvedBy": "string (User ID)",
  "notes": "string"
}
```

### **Business Logic Requirements**
- Automatic stock level calculations
- Low stock alerts
- Expiry date tracking
- Stock movement audit trail
- Multi-location inventory tracking
- Barcode/QR code support
- Automated reorder notifications

### **API Endpoints**
```http
GET    /api/Inventory/GetAll
GET    /api/Inventory/GetById?id={id}
POST   /api/Inventory/Add
PATCH  /api/Inventory/Update
DELETE /api/Inventory/Delete?id={id}
PATCH  /api/Inventory/UpdateStock
GET    /api/Inventory/GetLowStock
GET    /api/Inventory/GetByCategory?category={category}
GET    /api/Inventory/GetByLocation?location={location}
GET    /api/Inventory/GetExpiringItems?days={days}
POST   /api/Inventory/RecordMovement
GET    /api/Inventory/GetMovementHistory?itemId={id}
```

---

## 📊 **Dashboard & Analytics Module**

### **Training Statistics**
```json
{
  "totalTrainings": "integer",
  "completedTrainings": "integer", 
  "activeTrainings": "integer",
  "totalParticipants": "integer",
  "averageAttendance": "decimal",
  "certificationRate": "decimal",
  "topTrainers": [
    {
      "trainerId": "string",
      "trainerName": "string",
      "sessionsCount": "integer",
      "participantsCount": "integer"
    }
  ],
  "trainingsByProvince": [
    {
      "province": "string",
      "trainingCount": "integer",
      "participantCount": "integer"
    }
  ],
  "occupationBreakdown": [
    {
      "occupation": "string",
      "count": "integer",
      "percentage": "decimal"
    }
  ]
}
```

### **Equipment Distribution Data**
```json
{
  "hgtMeterDistribution": [
    {
      "province": "string",
      "quantity": "integer",
      "percentage": "decimal"
    }
  ],
  "hgtStripDistribution": [
    {
      "province": "string", 
      "quantity": "integer",
      "percentage": "decimal"
    }
  ],
  "totalEquipmentValue": "decimal",
  "equipmentUtilization": "decimal"
}
```

### **API Endpoints**
```http
GET    /api/Dashboard/GetTrainingStats
GET    /api/Dashboard/GetProvinceStats
GET    /api/Dashboard/GetNationalTotals
GET    /api/Dashboard/GetOccupationStats
GET    /api/Dashboard/GetHGTMeterDistribution
GET    /api/Dashboard/GetHGTStripDistribution
GET    /api/Dashboard/GetEquipmentStats
GET    /api/Dashboard/GetPerformanceMetrics
```

---

## 🏥 **Location Management Module**

### **Location Hierarchy**
```json
{
  "provinces": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "districts": [
        {
          "id": "string",
          "name": "string", 
          "code": "string",
          "hospitals": [
            {
              "id": "string",
              "name": "string",
              "code": "string",
              "type": "enum (Hospital, Clinic, CHC)",
              "address": "string",
              "contactDetails": {
                "phone": "string",
                "email": "string"
              },
              "capacity": "integer",
              "services": ["string[]"]
            }
          ]
        }
      ]
    }
  ]
}
```

### **API Endpoints**
```http
GET    /api/Location/GetProvinces
GET    /api/Location/GetDistricts?province={province}
GET    /api/Location/GetHospitals
GET    /api/Location/GetHospitalsByProvince?province={province}
GET    /api/Location/GetClinics
GET    /api/Location/GetClinicsByProvince?province={province}
GET    /api/Location/GetFacilitiesByDistrict?district={district}
```

---

## 💰 **Sales Management Module**

### **Sales Record Entity**
```json
{
  "id": "string (UUID)",
  "orderNumber": "string (unique)",
  "customerName": "string",
  "facility": "string",
  "province": "string",
  "district": "string",
  "orderDate": "datetime",
  "deliveryDate": "datetime",
  "status": "enum (Pending, Processing, Shipped, Delivered, Cancelled)",
  "items": [
    {
      "itemId": "string",
      "itemName": "string",
      "quantity": "integer",
      "unitPrice": "decimal",
      "totalPrice": "decimal"
    }
  ],
  "subtotal": "decimal",
  "tax": "decimal",
  "shipping": "decimal",
  "totalAmount": "decimal",
  "paymentStatus": "enum (Pending, Paid, Refunded)",
  "notes": "string",
  "salesRepresentative": "string"
}
```

### **API Endpoints**
```http
GET    /api/Sales/GetAll
GET    /api/Sales/GetById?id={id}
POST   /api/Sales/Add
PATCH  /api/Sales/Update
DELETE /api/Sales/Delete?id={id}
GET    /api/Sales/GetByDateRange?start={date}&end={date}
GET    /api/Sales/GetByProvince?province={province}
GET    /api/Sales/GetStats
GET    /api/Sales/GetTopProducts
```

---

## 📁 **Document Management Module**

### **Document Entity**
```json
{
  "id": "string (UUID)",
  "fileName": "string",
  "originalFileName": "string",
  "filePath": "string",
  "fileSize": "integer",
  "mimeType": "string",
  "category": "enum (Training, Medical, Report, Certificate)",
  "relatedEntityId": "string",
  "relatedEntityType": "string",
  "uploadedBy": "string (User ID)",
  "uploadDate": "datetime",
  "isPublic": "boolean",
  "downloadCount": "integer",
  "description": "string",
  "tags": ["string[]"]
}
```

### **API Endpoints**
```http
POST   /api/Document/Upload
GET    /api/Document/Download?id={id}
GET    /api/Document/GetByCategory?category={category}
GET    /api/Document/GetByEntity?entityId={id}&entityType={type}
DELETE /api/Document/Delete?id={id}
GET    /api/Document/Search?query={query}
```

---

## 🔧 **Technical Specifications**

### **Performance Requirements**
- **Response Time**: < 500ms for simple queries, < 2s for complex reports
- **Throughput**: Support 100+ concurrent users
- **Availability**: 99.9% uptime
- **Data Retention**: 7 years for medical records, 5 years for training records

### **Security Requirements**
- **Encryption**: TLS 1.3 for data in transit, AES-256 for data at rest
- **Authentication**: Multi-factor authentication for admin users
- **Authorization**: Role-based access control (RBAC)
- **Audit Logging**: Complete audit trail for all data modifications
- **Data Privacy**: POPIA (South Africa) compliance

### **Error Handling Standards**
```json
// Standard Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": "Technical error details",
    "timestamp": "2025-10-06T10:30:00Z",
    "traceId": "correlation-id-here"
  }
}
```

### **Pagination Standards**
```json
// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalRecords": 100,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 📊 **Database Design Considerations**

### **Key Relationships**
- User → Training Sessions (Many-to-Many through Participants)
- Trainer → Training Sessions (One-to-Many)
- Patient → Medical History (One-to-Many)
- Province → Districts → Facilities (Hierarchical)
- Inventory Items → Stock Movements (One-to-Many)

### **Indexing Strategy**
- Primary keys (UUID)
- Foreign key relationships
- Search fields (email, phone, patient number)
- Date fields for range queries
- Province/location fields for geographic filtering

### **Data Validation Rules**
- Email format validation
- South African phone number format (+27...)
- ID number validation (13 digits)
- Date range validations
- Mandatory field enforcement
- Business rule validations

---

## 🚀 **Implementation Phases**

### **Phase 1: Core Foundation (4-6 weeks)**
1. Authentication & Authorization
2. User Management
3. Location Management
4. Basic Dashboard APIs

### **Phase 2: Training Management (6-8 weeks)**
1. Trainer Management
2. Training Session CRUD
3. Participant Management
4. Training Reports

### **Phase 3: Healthcare Management (4-6 weeks)**
1. Patient Management
2. Medical History
3. Inventory Management

### **Phase 4: Advanced Features (4-6 weeks)**
1. Sales Management
2. Document Management
3. Advanced Analytics
4. Performance Optimization

---

## 📝 **Development Guidelines**

### **Code Standards**
- Follow RESTful API conventions
- Use consistent naming patterns
- Implement comprehensive logging
- Include unit and integration tests
- Document all endpoints with OpenAPI/Swagger

### **Testing Requirements**
- Unit tests (80%+ coverage)
- Integration tests for API endpoints
- Performance tests for critical operations
- Security tests for authentication/authorization

### **Documentation Requirements**
- API documentation (Swagger/OpenAPI)
- Database schema documentation
- Deployment guides
- User manuals
- Troubleshooting guides

---

## 📞 **Support & Maintenance**

### **Monitoring Requirements**
- Application performance monitoring
- Database performance monitoring
- Error tracking and alerting
- Usage analytics
- Security monitoring

### **Backup Strategy**
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup storage
- Regular backup restoration testing

---

This comprehensive guide provides the foundation for developing a robust API that will support the NDCANGU healthcare management system. Regular reviews and updates to this document should be conducted as requirements evolve.