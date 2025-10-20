# NDCANGU Healthcare Dashboard API Specification

## Overview
This document outlines the complete API specification required to support the NDCANGU Healthcare Dashboard application, including all endpoints, data models, controllers, and database requirements.

## Base Configuration
- **Base URL**: `https://api.ndcangu.health.gov.za/v1`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`
- **Response Format**: JSON

---

## 1. AUTHENTICATION & USER MANAGEMENT

### AuthController

#### POST /auth/login
**Purpose**: Authenticate user and return JWT token
```json
// Request Body
{
  "email": "john.doe@health.gov.za",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600,
  "user": {
    "id": "uuid-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@health.gov.za",
    "phoneNumber": "+27123456789",
    "roles": ["Admin", "Healthcare Manager"],
    "province": "Gauteng",
    "department": "Health Department",
    "permissions": ["view_dashboard", "manage_users", "view_reports"]
  }
}
```

#### GET /auth/me
**Purpose**: Get current authenticated user details
```json
// Headers: Authorization: Bearer {token}
// Response
{
  "id": "uuid-123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@health.gov.za",
  "phoneNumber": "+27123456789",
  "roles": ["Admin", "Healthcare Manager"],
  "province": "Gauteng",
  "department": "Health Department",
  "isActive": true,
  "lastLogin": "2025-10-20T10:30:00Z",
  "createdAt": "2024-01-15T08:00:00Z"
}
```

#### POST /auth/refresh
**Purpose**: Refresh JWT token
```json
// Request Body
{
  "refreshToken": "refresh_token_here"
}

// Response
{
  "success": true,
  "token": "new_jwt_token",
  "expiresIn": 3600
}
```

#### POST /auth/logout
**Purpose**: Logout user and invalidate tokens
```json
// Request Body
{
  "refreshToken": "refresh_token_here"
}

// Response
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 2. USER MANAGEMENT

### UsersController

#### GET /users
**Purpose**: Get paginated list of users with filtering
```json
// Query Parameters:
// ?page=1&limit=10&search=john&role=Admin&province=Gauteng&status=active

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@health.gov.za",
      "phoneNumber": "+27123456789",
      "roles": ["Admin"],
      "province": "Gauteng",
      "department": "Health Department",
      "isActive": true,
      "lastLogin": "2025-10-20T10:30:00Z",
      "createdAt": "2024-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### POST /users
**Purpose**: Create new user
```json
// Request Body
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@health.gov.za",
  "phoneNumber": "+27987654321",
  "password": "temporaryPassword123",
  "roles": ["Healthcare Manager"],
  "province": "Western Cape",
  "department": "Provincial Health"
}

// Response
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-456",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@health.gov.za",
    "phoneNumber": "+27987654321",
    "roles": ["Healthcare Manager"],
    "province": "Western Cape",
    "department": "Provincial Health",
    "isActive": true,
    "createdAt": "2025-10-20T11:00:00Z"
  }
}
```

#### GET /users/{userId}
**Purpose**: Get specific user details
```json
// Response
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@health.gov.za",
    "phoneNumber": "+27123456789",
    "roles": ["Admin", "Healthcare Manager"],
    "province": "Gauteng",
    "department": "Health Department",
    "isActive": true,
    "lastLogin": "2025-10-20T10:30:00Z",
    "createdAt": "2024-01-15T08:00:00Z",
    "permissions": ["view_dashboard", "manage_users", "view_reports"]
  }
}
```

#### PUT /users/{userId}
**Purpose**: Update user details
```json
// Request Body
{
  "firstName": "John Updated",
  "lastName": "Doe",
  "phoneNumber": "+27111222333",
  "roles": ["Admin", "Super Admin"],
  "province": "Gauteng",
  "department": "National Health Department"
}

// Response
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-123",
    "firstName": "John Updated",
    "lastName": "Doe",
    "email": "john.doe@health.gov.za",
    "phoneNumber": "+27111222333",
    "roles": ["Admin", "Super Admin"],
    "province": "Gauteng",
    "department": "National Health Department",
    "updatedAt": "2025-10-20T11:30:00Z"
  }
}
```

#### DELETE /users/{userId}
**Purpose**: Soft delete user (deactivate)
```json
// Response
{
  "success": true,
  "message": "User deactivated successfully"
}
```

---

## 3. TRAINING DATA MANAGEMENT

### TrainingController

#### GET /training/statistics
**Purpose**: Get comprehensive training statistics for dashboard
```json
// Response
{
  "success": true,
  "data": {
    "totalParticipants": 1340,
    "totalSessions": 45,
    "averageSessionSize": 29.8,
    "byProvince": {
      "KZN": {
        "total": 898,
        "male": 150,
        "female": 748,
        "trainer": "DYLAN GOVENDER",
        "sessions": 20,
        "completionRate": 95.2
      },
      "MPU": {
        "total": 276,
        "male": 44,
        "female": 232,
        "trainer": "ZIBA",
        "sessions": 8,
        "completionRate": 92.8
      },
      "GP": {
        "total": 118,
        "male": 0,
        "female": 118,
        "trainer": "MASIXOLE",
        "sessions": 5,
        "completionRate": 98.1
      },
      "LP": {
        "total": 48,
        "male": 0,
        "female": 48,
        "trainer": "LINDANI",
        "sessions": 3,
        "completionRate": 89.6
      }
    },
    "byGender": {
      "female": 1146,
      "male": 194
    },
    "periodStart": "2024-01-01",
    "periodEnd": "2025-10-20",
    "lastUpdated": "2025-10-20T12:00:00Z"
  }
}
```

#### GET /training/occupations
**Purpose**: Get training data by occupation types
```json
// Response
{
  "success": true,
  "data": [
    {
      "code": "EN",
      "name": "Enrolled Nurse",
      "fullName": "EN (Enrolled Nurse)",
      "count": 134,
      "percentage": 10.0,
      "averageScore": 87.5,
      "completionRate": 96.3
    },
    {
      "code": "ENA",
      "name": "Enrolled Nursing Assistant", 
      "fullName": "ENA (Enrolled Nursing Assistant)",
      "count": 60,
      "percentage": 4.5,
      "averageScore": 85.2,
      "completionRate": 93.3
    },
    {
      "code": "CNP",
      "name": "Community Nurse Practitioner",
      "fullName": "CNP (Community Nurse Practitioner)",
      "count": 35,
      "percentage": 2.6,
      "averageScore": 90.1,
      "completionRate": 97.1
    }
    // ... more occupations
  ],
  "totalParticipants": 1340,
  "lastUpdated": "2025-10-20T12:00:00Z"
}
```

#### GET /training/sessions
**Purpose**: Get detailed training session records
```json
// Query Parameters:
// ?page=1&limit=20&province=KZN&trainer=DYLAN&startDate=2024-01-01&endDate=2025-10-20

// Response
{
  "success": true,
  "data": [
    {
      "id": "session-123",
      "sessionName": "Glucose Monitoring Training - KZN Batch 1",
      "trainer": "DYLAN GOVENDER",
      "province": "KZN",
      "location": "Durban Provincial Hospital",
      "date": "2024-03-15",
      "startTime": "09:00:00",
      "endTime": "16:00:00",
      "participants": [
        {
          "id": "participant-456",
          "firstName": "Sarah",
          "lastName": "Mbeki",
          "occupation": "EN",
          "gender": "Female",
          "institution": "King Edward VIII Hospital",
          "attendanceStatus": "Present",
          "completionScore": 92.5,
          "certificateIssued": true
        }
      ],
      "totalParticipants": 25,
      "completionRate": 96.0,
      "averageScore": 88.7,
      "status": "Completed"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 45,
    "itemsPerPage": 20
  }
}
```

#### POST /training/sessions
**Purpose**: Create new training session
```json
// Request Body
{
  "sessionName": "HBA1C Testing Training - GP",
  "trainer": "MASIXOLE",
  "province": "GP",
  "location": "Charlotte Maxeke Hospital",
  "date": "2025-11-15",
  "startTime": "09:00:00",
  "endTime": "16:00:00",
  "maxParticipants": 30,
  "description": "Advanced HBA1C testing procedures and equipment handling"
}

// Response
{
  "success": true,
  "message": "Training session created successfully",
  "data": {
    "id": "session-789",
    "sessionName": "HBA1C Testing Training - GP",
    "trainer": "MASIXOLE",
    "province": "GP",
    "location": "Charlotte Maxeke Hospital",
    "date": "2025-11-15",
    "status": "Scheduled",
    "createdAt": "2025-10-20T13:00:00Z"
  }
}
```

---

## 4. MEDICAL EQUIPMENT DELIVERY MANAGEMENT

### DeliveryController

#### GET /deliveries/national-totals
**Purpose**: Get national equipment delivery totals for dashboard
```json
// Response
{
  "success": true,
  "data": [
    {
      "item": "GLUCOSE METER",
      "category": "Glucose Testing",
      "totalOrdered": 70415,
      "totalDelivered": 30486,
      "pending": 39929,
      "deliveryRate": 43.3,
      "lastDelivery": "2025-10-15T14:30:00Z",
      "status": "In Progress"
    },
    {
      "item": "GLUCOSE STRIPS",
      "category": "Glucose Testing",
      "totalOrdered": 273248,
      "totalDelivered": 133547,
      "pending": 139701,
      "deliveryRate": 48.9,
      "lastDelivery": "2025-10-18T11:20:00Z",
      "status": "In Progress"
    },
    {
      "item": "HB METER",
      "category": "Hemoglobin Testing",
      "totalOrdered": 588,
      "totalDelivered": 552,
      "pending": 36,
      "deliveryRate": 93.9,
      "lastDelivery": "2025-10-10T16:45:00Z",
      "status": "Nearly Complete"
    }
    // ... more equipment types
  ],
  "summary": {
    "totalOrdersValue": 45000000.00,
    "totalDeliveredValue": 29500000.00,
    "overallDeliveryRate": 65.6,
    "lastUpdated": "2025-10-20T12:00:00Z"
  }
}
```

#### GET /deliveries/provincial-breakdown
**Purpose**: Get detailed provincial delivery breakdown
```json
// Response
{
  "success": true,
  "data": {
    "provinces": [
      {
        "name": "KwaZulu-Natal",
        "code": "KZN",
        "totalInstitutions": 45,
        "totalDeliveries": 234,
        "equipment": {
          "glucoseMeters": {
            "ordered": 9718,
            "delivered": 3864,
            "pending": 5854,
            "deliveryRate": 39.8
          },
          "glucoseStrips": {
            "ordered": 51865,
            "delivered": 34500,
            "pending": 17365,
            "deliveryRate": 66.5
          },
          "hbMeters": {
            "ordered": 2,
            "delivered": 2,
            "pending": 0,
            "deliveryRate": 100.0
          },
          "hbStrips": {
            "ordered": 90,
            "delivered": 90,
            "pending": 0,
            "deliveryRate": 100.0
          },
          "hba1cMeters": {
            "ordered": 14,
            "delivered": 14,
            "pending": 0,
            "deliveryRate": 100.0
          },
          "hba1cStrips": {
            "ordered": 185,
            "delivered": 185,
            "pending": 0,
            "deliveryRate": 100.0
          }
        },
        "overallDeliveryRate": 67.2,
        "totalValue": 5500000.00,
        "deliveredValue": 3700000.00,
        "comments": "The Province took longer to finalize procurement as they were transitioning from the previous contract to ours. New ICN numbers had to be created, and institutions were still ordering from the previous supplier despite their contract ending, which caused confusion within the Province.",
        "lastDelivery": "2025-10-15T14:30:00Z",
        "keyContact": {
          "name": "Dr. Sarah Mthembu",
          "title": "Provincial Health Coordinator",
          "email": "sarah.mthembu@kznhealth.gov.za",
          "phone": "+27312345678"
        }
      }
      // ... other provinces
    ],
    "summary": {
      "totalProvinces": 9,
      "activeProvinces": 6,
      "bestPerforming": "Free State",
      "needsAttention": ["Western Cape", "North West"],
      "lastUpdated": "2025-10-20T12:00:00Z"
    }
  }
}
```

#### GET /deliveries/records
**Purpose**: Get detailed delivery records with filtering
```json
// Query Parameters:
// ?page=1&limit=50&province=KZN&item=Glucose Meter&status=Delivered&startDate=2024-01-01&endDate=2025-10-20&institution=Hospital

// Response
{
  "success": true,
  "data": [
    {
      "id": "delivery-123",
      "institutionName": "Provincial Pharm Supply Depot",
      "institutionCode": "PPSD-KZN-001",
      "province": "Kwa-Zulu Natal",
      "provinceCode": "KZN",
      "district": "eThekwini",
      "itemDescription": "Glucose Meter",
      "itemCode": "GLU-MET-001",
      "category": "Glucose Testing",
      "deliveryDate": "2024-01-08",
      "orderDate": "2023-12-15",
      "invoiceNumber": "INV-2024-010",
      "poNumber": "PO-2023-KZN-145",
      "quantity": 15000,
      "unitPrice": 850.00,
      "totalValue": 12750000.00,
      "status": "Delivered",
      "deliveryConfirmation": "CONF-2024-010",
      "supplier": "MedTech Solutions SA",
      "transportCompany": "HealthLogistics",
      "trackingNumber": "HL-2024-001234",
      "comment": "Major provincial distribution - delivered on schedule",
      "qualityCheck": {
        "performed": true,
        "passedQC": true,
        "inspector": "John Nkomo",
        "date": "2024-01-09"
      },
      "createdAt": "2023-12-15T10:30:00Z",
      "updatedAt": "2024-01-09T16:45:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 12,
    "totalItems": 587,
    "itemsPerPage": 50
  },
  "summary": {
    "totalDeliveries": 587,
    "totalValue": 28500000.00,
    "averageDeliveryTime": 14.5,
    "onTimeRate": 87.3
  }
}
```

#### POST /deliveries/records
**Purpose**: Create new delivery record
```json
// Request Body
{
  "institutionName": "Johannesburg General Hospital",
  "province": "Gauteng",
  "district": "City of Johannesburg",
  "itemDescription": "HBA1C Test Strips",
  "category": "HBA1C Testing",
  "orderDate": "2025-10-01",
  "plannedDeliveryDate": "2025-10-25",
  "invoiceNumber": "INV-2025-156",
  "poNumber": "PO-2025-GT-089",
  "quantity": 500,
  "unitPrice": 25.00,
  "supplier": "DiabetesCare Supplies",
  "comment": "Urgent order for diabetic clinic expansion"
}

// Response
{
  "success": true,
  "message": "Delivery record created successfully",
  "data": {
    "id": "delivery-789",
    "institutionName": "Johannesburg General Hospital",
    "province": "Gauteng",
    "itemDescription": "HBA1C Test Strips",
    "quantity": 500,
    "totalValue": 12500.00,
    "status": "Ordered",
    "createdAt": "2025-10-20T14:00:00Z"
  }
}
```

#### PUT /deliveries/records/{deliveryId}
**Purpose**: Update delivery record (mark as delivered, update status)
```json
// Request Body
{
  "status": "Delivered",
  "deliveryDate": "2025-10-20",
  "actualQuantity": 500,
  "deliveryConfirmation": "CONF-2025-156",
  "trackingNumber": "HL-2025-002345",
  "qualityCheck": {
    "performed": true,
    "passedQC": true,
    "inspector": "Mary Johnson"
  },
  "comment": "Delivered successfully, all items passed quality check"
}

// Response
{
  "success": true,
  "message": "Delivery record updated successfully",
  "data": {
    "id": "delivery-789",
    "status": "Delivered",
    "deliveryDate": "2025-10-20",
    "actualQuantity": 500,
    "updatedAt": "2025-10-20T15:30:00Z"
  }
}
```

---

## 5. ANALYTICS & REPORTING

### AnalyticsController

#### GET /analytics/dashboard-summary
**Purpose**: Get complete dashboard summary data
```json
// Response
{
  "success": true,
  "data": {
    "training": {
      "totalParticipants": 1340,
      "totalSessions": 45,
      "completionRate": 94.2,
      "topProvince": "KZN"
    },
    "deliveries": {
      "totalDeliveries": 587,
      "totalValue": 45000000.00,
      "overallDeliveryRate": 65.6,
      "pendingValue": 15500000.00
    },
    "equipment": {
      "totalItemsDelivered": 164816,
      "totalItemsOrdered": 355169,
      "pendingItems": 190353,
      "topDeliveredItem": "Glucose Test Strips"
    },
    "provinces": {
      "totalActive": 6,
      "bestPerforming": "Free State",
      "mostTraining": "KZN",
      "needsAttention": ["Western Cape", "North West"]
    },
    "lastUpdated": "2025-10-20T12:00:00Z"
  }
}
```

#### GET /analytics/hgt-distribution
**Purpose**: Get HGT meter distribution data for charts
```json
// Response
{
  "success": true,
  "data": {
    "provinces": ["KZN", "GT", "FS", "LP", "MP", "NC", "EC", "NW", "WC"],
    "provinceNames": [
      "KwaZulu-Natal", "Gauteng", "Free State", "Limpopo", 
      "Mpumalanga", "Northern Cape", "Eastern Cape", "North West", "Western Cape"
    ],
    "distribution": {
      "glucoseMeters": [3864, 8344, 13958, 2910, 911, 100, 399, 0, 0],
      "glucoseStrips": [34500, 46810, 13018, 20800, 17920, 100, 399, 0, 0],
      "hbMeters": [2, 502, 20, 0, 14, 0, 0, 0, 0],
      "hbStrips": [90, 7054, 300, 0, 55, 0, 0, 0, 0],
      "hba1cMeters": [14, 1, 0, 0, 0, 0, 0, 0, 0],
      "hba1cStrips": [185, 4, 0, 0, 10, 0, 0, 0, 0]
    },
    "totals": {
      "glucoseMeters": 30486,
      "glucoseStrips": 133547,
      "hbMeters": 538,
      "hbStrips": 7499,
      "hba1cMeters": 15,
      "hba1cStrips": 199
    },
    "lastUpdated": "2025-10-20T12:00:00Z"
  }
}
```

#### GET /analytics/province-performance
**Purpose**: Get detailed province performance analytics
```json
// Query Parameters: ?includeComments=true&includeContacts=true

// Response
{
  "success": true,
  "data": [
    {
      "province": "Free State",
      "code": "FS",
      "rank": 1,
      "overallScore": 87.5,
      "deliveryRate": 89.2,
      "trainingParticipants": 0,
      "totalDeliveries": 45,
      "totalValue": 8500000.00,
      "strengths": ["High delivery rate", "Good communication"],
      "challenges": ["Limited training participation"],
      "trend": "Improving",
      "comments": "Province was enthusiastic about the contract; however, they faced challenges in creating new SAP numbers.",
      "keyContact": {
        "name": "Dr. Thabo Motsoeneng",
        "title": "Provincial Health Director",
        "email": "thabo.motsoeneng@fshealth.gov.za"
      }
    }
    // ... other provinces
  ],
  "summary": {
    "averageDeliveryRate": 58.7,
    "averageTrainingRate": 78.3,
    "topPerformer": "Free State",
    "bottomPerformer": "Western Cape",
    "improvingProvinces": ["Limpopo", "Mpumalanga"],
    "decliningProvinces": ["North West"]
  }
}
```

---

## 6. REFERENCE DATA MANAGEMENT

### ReferenceController

#### GET /reference/provinces
**Purpose**: Get list of all South African provinces
```json
// Response
{
  "success": true,
  "data": [
    {
      "code": "KZN",
      "name": "KwaZulu-Natal",
      "fullName": "KwaZulu-Natal Province",
      "capital": "Pietermaritzburg",
      "population": 11513575,
      "healthFacilities": 1247,
      "isActive": true
    },
    {
      "code": "GT",
      "name": "Gauteng", 
      "fullName": "Gauteng Province",
      "capital": "Johannesburg",
      "population": 15810388,
      "healthFacilities": 876,
      "isActive": true
    }
    // ... other provinces
  ]
}
```

#### GET /reference/equipment-types
**Purpose**: Get list of all medical equipment types
```json
// Response
{
  "success": true,
  "data": [
    {
      "code": "GLU-MET",
      "name": "Glucose Meter",
      "category": "Glucose Testing",
      "description": "Digital glucose monitoring device",
      "unitPrice": 850.00,
      "supplier": "MedTech Solutions SA",
      "specifications": {
        "accuracy": "±10%",
        "memoryCapacity": "500 readings",
        "batteryLife": "1000 tests"
      }
    },
    {
      "code": "GLU-STR",
      "name": "Glucose Test Strips",
      "category": "Glucose Testing", 
      "description": "Single-use glucose test strips",
      "unitPrice": 2.50,
      "supplier": "DiabetesCare Supplies",
      "specifications": {
        "expiryPeriod": "24 months",
        "storageTemp": "2-30°C"
      }
    }
    // ... other equipment types
  ]
}
```

#### GET /reference/roles
**Purpose**: Get available user roles and permissions
```json
// Response
{
  "success": true,
  "data": [
    {
      "code": "ADMIN",
      "name": "Administrator",
      "description": "Full system access",
      "permissions": [
        "view_dashboard", "manage_users", "manage_deliveries", 
        "manage_training", "view_reports", "export_data",
        "system_configuration"
      ]
    },
    {
      "code": "HEALTH_MGR",
      "name": "Healthcare Manager",
      "description": "Provincial health management",
      "permissions": [
        "view_dashboard", "view_provincial_data", "manage_provincial_deliveries",
        "view_reports", "export_provincial_data"
      ]
    }
    // ... other roles
  ]
}
```

---

## 7. EXPORT & REPORTING

### ReportsController

#### GET /reports/deliveries/export
**Purpose**: Export delivery data to Excel
```json
// Query Parameters:
// ?format=excel&province=KZN&startDate=2024-01-01&endDate=2025-10-20&includeDetails=true

// Response (File Download)
Headers:
  Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  Content-Disposition: attachment; filename="delivery_report_20251020.xlsx"
```

#### GET /reports/training/export  
**Purpose**: Export training data to Excel
```json
// Query Parameters:
// ?format=excel&province=ALL&occupation=EN&includeScores=true

// Response (File Download)
Headers:
  Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  Content-Disposition: attachment; filename="training_report_20251020.xlsx"
```

#### POST /reports/custom
**Purpose**: Generate custom report
```json
// Request Body
{
  "reportName": "Monthly Provincial Performance",
  "type": "dashboard_summary",
  "parameters": {
    "provinces": ["KZN", "GT", "FS"],
    "period": "monthly",
    "startDate": "2025-09-01",
    "endDate": "2025-10-20",
    "includeCharts": true,
    "format": "pdf"
  },
  "emailTo": ["manager@health.gov.za"]
}

// Response
{
  "success": true,
  "message": "Report generation started",
  "reportId": "report-123",
  "estimatedCompletion": "2025-10-20T15:45:00Z",
  "downloadUrl": "/reports/download/report-123"
}
```

---

## 8. DATABASE SCHEMA REQUIREMENTS

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    province VARCHAR(50),
    department VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_code VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Training Tables
```sql
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_name VARCHAR(300) NOT NULL,
    trainer VARCHAR(200) NOT NULL,
    province VARCHAR(50) NOT NULL,
    location VARCHAR(300) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_participants INTEGER DEFAULT 30,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    institution VARCHAR(300) NOT NULL,
    attendance_status VARCHAR(50) DEFAULT 'Registered',
    completion_score DECIMAL(5,2),
    certificate_issued BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Delivery Tables
```sql
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(300) NOT NULL,
    code VARCHAR(50) UNIQUE,
    province VARCHAR(50) NOT NULL,
    district VARCHAR(100),
    address TEXT,
    contact_person VARCHAR(200),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    unit_price DECIMAL(12,2),
    supplier VARCHAR(300),
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id),
    equipment_id UUID REFERENCES equipment_types(id),
    invoice_number VARCHAR(100) NOT NULL,
    po_number VARCHAR(100),
    order_date DATE NOT NULL,
    planned_delivery_date DATE,
    actual_delivery_date DATE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Ordered',
    delivery_confirmation VARCHAR(100),
    tracking_number VARCHAR(100),
    transport_company VARCHAR(200),
    quality_check JSONB,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reference Tables
```sql
CREATE TABLE provinces (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    capital VARCHAR(100),
    population INTEGER,
    health_facilities INTEGER,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE roles (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    permissions JSONB,
    is_active BOOLEAN DEFAULT true
);
```

---

## 9. API SECURITY & MIDDLEWARE

### Authentication Middleware
- JWT token validation
- Role-based access control (RBAC)
- Rate limiting per endpoint
- API key validation for external systems

### Request Validation
- Input sanitization
- Data type validation
- Required field validation
- Business rule validation

### Response Standards
- Consistent error response format
- Success response format
- Pagination standards
- Filtering and sorting standards

---

## 10. CONTROLLER IMPLEMENTATION STRUCTURE

### Example Controller Structure (C# .NET)
```csharp
[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DeliveryController : ControllerBase
{
    private readonly IDeliveryService _deliveryService;
    private readonly ILogger<DeliveryController> _logger;

    public DeliveryController(IDeliveryService deliveryService, ILogger<DeliveryController> logger)
    {
        _deliveryService = deliveryService;
        _logger = logger;
    }

    [HttpGet("national-totals")]
    [RequiredRole("Admin", "Healthcare Manager")]
    public async Task<ActionResult<ApiResponse<List<NationalTotalDto>>>> GetNationalTotals()
    {
        try
        {
            var result = await _deliveryService.GetNationalTotalsAsync();
            return Ok(new ApiResponse<List<NationalTotalDto>>(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving national totals");
            return StatusCode(500, new ApiResponse<object>("Internal server error"));
        }
    }
}
```

This comprehensive API specification provides all the endpoints, data structures, and implementation guidelines needed to build a complete backend system that will fulfill all the dashboard requirements in the NDCANGU Healthcare application.
