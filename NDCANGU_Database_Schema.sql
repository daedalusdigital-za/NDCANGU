-- NDCANGU Healthcare Management System Database Schema
-- Azure SQL Server Database Creation Script
-- Run this script in Azure Data Studio to create all tables and populate with data

-- Drop existing tables if they exist (in reverse dependency order)
IF OBJECT_ID('dbo.DeliveryRecords', 'U') IS NOT NULL DROP TABLE dbo.DeliveryRecords;
IF OBJECT_ID('dbo.SalesItems', 'U') IS NOT NULL DROP TABLE dbo.SalesItems;
IF OBJECT_ID('dbo.Sales', 'U') IS NOT NULL DROP TABLE dbo.Sales;
IF OBJECT_ID('dbo.InventoryItems', 'U') IS NOT NULL DROP TABLE dbo.InventoryItems;
IF OBJECT_ID('dbo.TrainingRegisters', 'U') IS NOT NULL DROP TABLE dbo.TrainingRegisters;
IF OBJECT_ID('dbo.TrainingSessions', 'U') IS NOT NULL DROP TABLE dbo.TrainingSessions;
IF OBJECT_ID('dbo.Trainers', 'U') IS NOT NULL DROP TABLE dbo.Trainers;
IF OBJECT_ID('dbo.HealthFacilities', 'U') IS NOT NULL DROP TABLE dbo.HealthFacilities;
IF OBJECT_ID('dbo.Districts', 'U') IS NOT NULL DROP TABLE dbo.Districts;
IF OBJECT_ID('dbo.Provinces', 'U') IS NOT NULL DROP TABLE dbo.Provinces;
GO

-- =============================================
-- 1. PROVINCES TABLE
-- =============================================
CREATE TABLE dbo.Provinces (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Code NVARCHAR(10) NOT NULL UNIQUE,
    Population INT NULL,
    HealthFacilities INT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Insert South African Provinces
INSERT INTO dbo.Provinces (Name, Code, Population, HealthFacilities) VALUES
('Gauteng', 'GP', 15810388, 450),
('KwaZulu-Natal', 'KZN', 11513575, 850),
('Eastern Cape', 'EC', 6997600, 720),
('Western Cape', 'WC', 7005741, 380),
('Limpopo', 'LP', 5987000, 650),
('Mpumalanga', 'MPU', 4648000, 420),
('North West', 'NW', 4027160, 380),
('Free State', 'FS', 2887465, 290),
('Northern Cape', 'NC', 1292786, 180);

-- =============================================
-- 2. DISTRICTS TABLE
-- =============================================
CREATE TABLE dbo.Districts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    ProvinceId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES dbo.Provinces(Id)
);

-- Insert Districts by Province
-- Gauteng Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Sedibeng', 1),
('Ekurhuleni', 1),
('City Of Johannesburg', 1),
('City Of Tswane', 1),
('West Rand', 1);

-- Limpopo Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Capricorn', 5),
('Mopani', 5),
('Sekhukhune', 5),
('Vhembe', 5),
('Waterberge', 5);

-- North West Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Bojanala Platinum', 7),
('Dr kenneth kaunda', 7),
('Dr Ruth Segomotsi Mompati', 7),
('Ngaka Modlri Mclema', 7);

-- Eastern Cape Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Alfred Nzo', 3),
('Amathole', 3),
('Buffalo', 3),
('Chris Hani', 3),
('Joe Gqabi', 3),
('Nelson Mandela Bay Metropolitan', 3);

-- Western Cape Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Cape Winelands', 4),
('Central Karoo', 4),
('City of CapeTown', 4),
('Eden', 4),
('Overberg', 4),
('West Coast', 4);

-- KwaZulu-Natal Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Amajuba', 2),
('eThekwini', 2),
('Harry Gwala', 2),
('ilembe', 2),
('King Cetshwayo', 2),
('Ugu', 2),
('uMgungundlovu', 2),
('uMkhanyakude', 2),
('uThukela', 2),
('Zululand', 2);

-- Northern Cape Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Fances Baard', 9),
('John Taolo Gaetsewe', 9),
('Namakwa', 9),
('Pixley Ka Seme', 9),
('ZF Mgcawa', 9);

-- Free State Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('Fezile Dabi', 8),
('lejweeleputswa', 8),
('Mangaung Thabo Mfoutsanyana', 8),
('Xhaariep', 8);

-- Mpumalanga Districts
INSERT INTO dbo.Districts (Name, ProvinceId) VALUES
('EHLANZENI', 6),
('GERT SIBANDE', 6),
('NKANGALA', 6);

-- =============================================
-- 3. HEALTH FACILITIES TABLE
-- =============================================
CREATE TABLE dbo.HealthFacilities (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NULL,
    ProvinceId INT NOT NULL,
    DistrictId INT NULL,
    FacilityType NVARCHAR(50) NOT NULL CHECK (FacilityType IN ('Hospital', 'Clinic', 'CHC', 'Specialized')),
    Level NVARCHAR(20) NULL CHECK (Level IN ('Primary', 'Secondary', 'Tertiary')),
    Address NVARCHAR(500) NULL,
    ContactNumber NVARCHAR(20) NULL,
    Email NVARCHAR(100) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive', 'Under Construction')),
    Capacity INT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES dbo.Provinces(Id),
    FOREIGN KEY (DistrictId) REFERENCES dbo.Districts(Id)
);

-- Insert Health Facilities from Global Service
-- Gauteng Facilities
INSERT INTO dbo.HealthFacilities (Name, ProvinceId, FacilityType, Status) VALUES
('Roodepoort West Princess Clinic', 1, 'Clinic', 'Active'),
('Lenmed Clinic', 1, 'Clinic', 'Active'),
('Randburg Clinic', 1, 'Clinic', 'Active'),
('Zandspruit Clinic', 1, 'Clinic', 'Active'),
('West Rand', 1, 'Hospital', 'Active'),
('Siphumlile', 1, 'Clinic', 'Active'),
('Albertina Sisulu Clinic', 1, 'Clinic', 'Active'),
('Usizolwethu Clinic', 1, 'Clinic', 'Active'),
('Heidelberg Clinic', 1, 'Clinic', 'Active'),
('Rensburg Clinic', 1, 'Clinic', 'Active'),
('Mpumelelo Clinic', 1, 'Clinic', 'Active'),
('Boitumelo Clinic', 1, 'Clinic', 'Active'),
('Khutsong East Clinic', 1, 'Clinic', 'Active'),
('Greenspark Clinic', 1, 'Clinic', 'Active'),
('Randgate Clinic', 1, 'Clinic', 'Active'),
('Ya Rona Clinic', 1, 'Clinic', 'Active'),
('Thusanang Clinic', 1, 'Clinic', 'Active'),
('Venterspos Clinic', 1, 'Clinic', 'Active'),
('Ubuntu Clinic', 1, 'Clinic', 'Active'),
('Doornpoort Satellite Clinic', 1, 'Clinic', 'Active'),
('Phahameng Clinic', 1, 'Clinic', 'Active'),
('Dilopye Clinic', 1, 'Clinic', 'Active'),
('Soshanguve Block Tt Clinic', 1, 'Clinic', 'Active'),
('Skinner Street Clinic', 1, 'Clinic', 'Active'),
('Tsakane Clinic', 1, 'Clinic', 'Active'),
('Sead Clinic', 1, 'Clinic', 'Active'),
('Motsamai Clinic', 1, 'Clinic', 'Active'),
('Erin Clinic', 1, 'Clinic', 'Active'),
('Dukathole Clinic', 1, 'Clinic', 'Active'),
('Boksburg North Clinic', 1, 'Clinic', 'Active'),
('Charlotte Maxeke Johannesburg Academic Hospital', 1, 'Hospital', 'Active'),
('Chris Hani Baragwanath Academic Hospital', 1, 'Hospital', 'Active'),
('Steve Biko Academic Hospital', 1, 'Hospital', 'Active');

-- KwaZulu-Natal Facilities
INSERT INTO dbo.HealthFacilities (Name, ProvinceId, FacilityType, Status) VALUES
('HAILEY STOT CLINIC', 2, 'Clinic', 'Active'),
('KWANGCOLOSI CLINIC', 2, 'Clinic', 'Active'),
('KWANDENGEZI CLINIC', 2, 'Clinic', 'Active'),
('ZWELIBONVU CLINIC', 2, 'Clinic', 'Active'),
('CLEMONT CLINIC', 2, 'Clinic', 'Active'),
('DANGANYA CLINIC', 2, 'Clinic', 'Active'),
('EZIMWINI CLINIC', 2, 'Clinic', 'Active'),
('KWAMAKHUTHA CLINIC', 2, 'Clinic', 'Active'),
('Provincial Pharm Supply Depot', 2, 'Hospital', 'Active');

-- Mpumalanga Facilities
INSERT INTO dbo.HealthFacilities (Name, ProvinceId, FacilityType, Status) VALUES
('Sihlangu Clinic', 6, 'Clinic', 'Active'),
('Zoeknog Clinic', 6, 'Clinic', 'Active'),
('Belfast Clinic', 6, 'Clinic', 'Active'),
('Hluvukani CHC', 6, 'CHC', 'Active'),
('Edinburg Clinic', 6, 'Clinic', 'Active'),
('Sabie Clinic', 6, 'Clinic', 'Active'),
('MAfrica CHC', 6, 'CHC', 'Active'),
('Luphisi Clinic', 6, 'Clinic', 'Active'),
('Nkwalini Clinic', 6, 'Clinic', 'Active'),
('Msogwaba Clinic', 6, 'Clinic', 'Active'),
('Vlakplass Clinic', 6, 'Clinic', 'Active'),
('Bettysgoet Clinic', 6, 'Clinic', 'Active'),
('Fernie Clinic 1', 6, 'Clinic', 'Active'),
('Morgenzon Clinic', 6, 'Clinic', 'Active'),
('Warbuton Clinic', 6, 'Clinic', 'Active'),
('Driefontein CHC', 6, 'CHC', 'Active'),
('Stanwest Clinic', 6, 'Clinic', 'Active'),
('KwaNgema CHC', 6, 'CHC', 'Active'),
('Perdekop CHC', 6, 'CHC', 'Active'),
('Wakkerstrom Clinic', 6, 'Clinic', 'Active'),
('Hlalanikahle Clinic', 6, 'Clinic', 'Active'),
('Poly Clinic', 6, 'Clinic', 'Active'),
('Klarinet CHC', 6, 'CHC', 'Active'),
('Rietspruit Clinic', 6, 'Clinic', 'Active'),
('Kriel Clinic', 6, 'Clinic', 'Active'),
('Botleng Clinic', 6, 'Clinic', 'Active'),
('Delmas Clinic', 6, 'Clinic', 'Active'),
('Thubelihle CHC', 6, 'CHC', 'Active'),
('Lynville Clinic', 6, 'Clinic', 'Active'),
('Beatty Clinic', 6, 'Clinic', 'Active'),
('Mpumalanga Department of Health', 6, 'Hospital', 'Active');

-- Additional provincial facilities for other provinces
INSERT INTO dbo.HealthFacilities (Name, ProvinceId, FacilityType, Status) VALUES
('Bloemfontein Medical Depot', 8, 'Hospital', 'Active'),
('FS Health & Social Development', 8, 'Hospital', 'Active'),
('Bahlabani Pharmacy', 8, 'Clinic', 'Active'),
('Limpopo Department of Health', 5, 'Hospital', 'Active'),
('Polokwane Provincial Hospital', 5, 'Hospital', 'Active'),
('Northern Cape Department of Health', 9, 'Hospital', 'Active'),
('Eastern Cape Department of Health', 3, 'Hospital', 'Active');

-- =============================================
-- 4. TRAINERS TABLE
-- =============================================
CREATE TABLE dbo.Trainers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL,
    ProvinceId INT NOT NULL,
    Qualification NVARCHAR(200) NULL,
    Experience INT NOT NULL DEFAULT 0 CHECK (Experience >= 0),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive', 'On Leave')),
    Location NVARCHAR(100) NULL,
    Bio NTEXT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES dbo.Provinces(Id)
);

-- Insert Trainers from codebase
INSERT INTO dbo.Trainers (Name, Email, Phone, ProvinceId, Qualification, Experience, Status, Location, Bio) VALUES
('ZIBA', 'ziba@Promedtechnologies.co.za', '+27721234567', 1, 'MD', 8, 'Active', 'Johannesburg', 'Experienced medical trainer with focus on community health'),
('LINDANI', 'lindani@Promedtechnologies.co.za', '+27721234568', 2, 'MD, PhD', 12, 'Active', 'Durban', 'Medical specialist with extensive training background'),
('KEHOLIHLE', 'keholihle@Promedtechnologies.co.za', '+27721234569', 4, 'MD, MSc', 6, 'Active', 'Cape Town', 'Community health advocate specializing in medical training'),
('SELBY', 'selby@Promedtechnologies.co.za', '+27721234570', 3, 'MD', 10, 'Active', 'Port Elizabeth', 'Medical trainer with focus on rural health programs'),
('MASI', 'masi@Promedtechnologies.co.za', '+27721234571', 5, 'MD, MSc', 7, 'Active', 'Polokwane', 'Healthcare professional with training expertise'),
('DYLAN', 'dylan@Promedtechnologies.co.za', '+27721234572', 6, 'MD', 5, 'Active', 'Nelspruit', 'Medical professional specializing in training programs');

-- =============================================
-- 5. TRAINING SESSIONS TABLE
-- =============================================
CREATE TABLE dbo.TrainingSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrainingName NVARCHAR(200) NOT NULL,
    TrainingType NVARCHAR(100) NOT NULL,
    Description NTEXT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    ProvinceId INT NOT NULL,
    FacilityId INT NULL,
    Venue NVARCHAR(200) NOT NULL,
    TrainerId INT NOT NULL,
    NumberOfParticipants INT NOT NULL CHECK (NumberOfParticipants BETWEEN 1 AND 100),
    TargetAudience NVARCHAR(200) NOT NULL,
    Objectives NTEXT NULL,
    Materials NTEXT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Planned' CHECK (Status IN ('Planned', 'Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES dbo.Provinces(Id),
    FOREIGN KEY (FacilityId) REFERENCES dbo.HealthFacilities(Id),
    FOREIGN KEY (TrainerId) REFERENCES dbo.Trainers(Id)
);

-- Insert sample training sessions
INSERT INTO dbo.TrainingSessions (TrainingName, TrainingType, Description, StartDate, EndDate, StartTime, EndTime, ProvinceId, Venue, TrainerId, NumberOfParticipants, TargetAudience, Objectives, Materials, Status) VALUES
('Medical Equipment Operation Training', 'Equipment Training', 'Comprehensive training on medical equipment operation and maintenance', '2024-01-15', '2024-01-15', '09:00', '13:00', 1, 'Johannesburg Medical Center', 1, 25, 'Healthcare Workers', 'Train staff on proper equipment operation', 'Equipment manuals, practice devices', 'Completed'),
('Healthcare Safety Protocols', 'Safety Training', 'Training on healthcare safety protocols and procedures', '2024-01-22', '2024-01-22', '08:00', '14:00', 2, 'Durban Health Training Center', 2, 30, 'Nurses and Technicians', 'Improve safety compliance', 'Safety manuals, protective equipment', 'Completed'),
('Emergency Response Training', 'Emergency Procedures', 'Emergency response and first aid training', '2024-02-05', '2024-02-05', '08:00', '16:00', 4, 'Cape Town Medical Institute', 3, 28, 'Medical Staff', 'Enhance emergency response capabilities', 'First aid kits, training mannequins', 'Completed'),
('Patient Care Standards', 'Patient Care', 'Training on patient care standards and best practices', '2024-02-12', '2024-02-12', '09:00', '14:00', 3, 'Port Elizabeth Health Hub', 4, 22, 'Healthcare Providers', 'Improve patient care quality', 'Care protocols, patient interaction guides', 'Completed'),
('Medical Device Maintenance', 'Maintenance Training', 'Training on medical device maintenance and troubleshooting', '2024-02-20', '2024-02-20', '08:00', '14:00', 5, 'Polokwane Training Facility', 5, 18, 'Biomedical Technicians', 'Enhance maintenance skills', 'Maintenance tools, device manuals', 'In Progress'),
('Healthcare Administration', 'Administrative Training', 'Training on healthcare administration and record keeping', '2024-03-01', '2024-03-01', '09:00', '13:00', 6, 'Nelspruit Medical Center', 6, 35, 'Administrative Staff', 'Improve administrative efficiency', 'Forms, software guides', 'Scheduled');

-- =============================================
-- 6. TRAINING REGISTERS TABLE
-- =============================================
CREATE TABLE dbo.TrainingRegisters (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SessionTitle NVARCHAR(200) NOT NULL,
    TrainerId INT NOT NULL,
    SessionDate DATE NOT NULL,
    Venue NVARCHAR(200) NOT NULL,
    Participants INT NOT NULL,
    Duration NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    Topic NVARCHAR(200) NOT NULL,
    AttendanceRate DECIMAL(5,2) CHECK (AttendanceRate BETWEEN 0 AND 100),
    CertificatesIssued INT DEFAULT 0,
    RegisterFile NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (TrainerId) REFERENCES dbo.Trainers(Id)
);

-- Insert training registers from codebase
INSERT INTO dbo.TrainingRegisters (SessionTitle, TrainerId, SessionDate, Venue, Participants, Duration, Status, Topic, AttendanceRate, CertificatesIssued, RegisterFile) VALUES
('Medical Equipment Operation Training', 1, '2024-01-15', 'Johannesburg Medical Center', 25, '4 hours', 'Completed', 'Medical Equipment', 96.00, 24, 'register_001.pdf'),
('Healthcare Safety Protocols', 2, '2024-01-22', 'Durban Health Training Center', 30, '6 hours', 'Completed', 'Safety Protocols', 93.00, 28, 'register_002.pdf'),
('Emergency Response Training', 3, '2024-02-05', 'Cape Town Medical Institute', 28, '8 hours', 'Completed', 'Emergency Response', 100.00, 28, 'register_003.pdf'),
('Patient Care Standards', 4, '2024-02-12', 'Port Elizabeth Health Hub', 22, '5 hours', 'Completed', 'Patient Care', 91.00, 20, 'register_004.pdf'),
('Medical Device Maintenance', 5, '2024-02-20', 'Polokwane Training Facility', 18, '6 hours', 'In Progress', 'Device Maintenance', 89.00, 0, NULL),
('Healthcare Administration', 6, '2024-03-01', 'Nelspruit Medical Center', 35, '4 hours', 'Scheduled', 'Administration', 0.00, 0, NULL);

-- =============================================
-- 7. INVENTORY ITEMS TABLE
-- =============================================
CREATE TABLE dbo.InventoryItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ItemNumber NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    UOM NVARCHAR(20) NOT NULL,
    Category NVARCHAR(100) NOT NULL CHECK (Category IN ('Hemoglobin Testing', 'Glucose Testing', 'HBA1C Testing', 'Multiparameter Testing', 'Quality Control', 'Equipment Accessories', 'Disposables', 'Medical Equipment')),
    QtyOnHand DECIMAL(10,2) NOT NULL DEFAULT 0,
    QtyOnPO DECIMAL(10,2) NOT NULL DEFAULT 0,
    QtyOnSO DECIMAL(10,2) NOT NULL DEFAULT 0,
    StockAvailable AS (QtyOnHand + QtyOnPO - QtyOnSO),
    UnitCostForQOH DECIMAL(10,2) NOT NULL DEFAULT 0,
    TotalCostForQOH AS (QtyOnHand * UnitCostForQOH),
    ReorderLevel DECIMAL(10,2) NULL,
    MaxStockLevel DECIMAL(10,2) NULL,
    Supplier NVARCHAR(200) NULL,
    LastRestocked DATETIME2 NULL,
    ExpiryDate DATE NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'In Stock' CHECK (Status IN ('In Stock', 'Low Stock', 'Out of Stock', 'Discontinued')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Insert NDOH inventory items from codebase
INSERT INTO dbo.InventoryItems (ItemNumber, Description, Location, UOM, Category, QtyOnHand, QtyOnPO, QtyOnSO, UnitCostForQOH, ReorderLevel, MaxStockLevel, Supplier, LastRestocked, Status) VALUES
('NDOH35002', 'HEMOGLOBIN METER - BIO AID HB METER', 'KZN 1', 'Each', 'Hemoglobin Testing', 8406.00, 400.00, 0.00, 455.04, 100, 10000, 'Bio Aid Medical', '2024-01-15', 'In Stock'),
('NDOH35003', 'HEMOGLOBIN TEST STRIPS', 'KZN 1', 'BOX', 'Hemoglobin Testing', 24442.00, 1200.00, 0.00, 160.25, 500, 30000, 'Bio Aid Medical', '2024-01-15', 'In Stock'),
('NDOH35013', 'HEMOGLOBIN METER - BATTERY', 'KZN 1', 'Each', 'Equipment Accessories', 0.00, 0.00, 0.00, 10.53, 50, 500, 'Battery Suppliers Inc', NULL, 'Out of Stock'),
('NDOH35014', 'HEMOGLOBIN METER - QUALITY CONTROL SOLUTIONS', 'KZN 1', 'Each', 'Quality Control', 0.00, 0.00, 0.00, 138.58, 20, 200, 'Quality Control Ltd', NULL, 'Out of Stock'),
('NDOH35015', 'HEMOGLOBIN METER - SINGLE USE DISPOSABLE LANCET', 'KZN 1', 'Each', 'Disposables', 500.00, 0.00, 1300.00, 0.56, 1000, 10000, 'Disposables Direct', '2024-02-01', 'Low Stock'),
('NDOH35016', 'GLUCOSE METER - BATTERY', 'KZN 1', 'Each', 'Equipment Accessories', 0.00, 0.00, 2930.00, 8.31, 100, 1000, 'Battery Suppliers Inc', NULL, 'Out of Stock'),
('NDOH35017', 'GLUCOSE TEST STRIPS', 'KZN 1', '50Pack', 'Glucose Testing', 2321.00, 0.00, 136109.00, 51.57, 1000, 50000, 'Glucose Solutions SA', '2024-01-20', 'Low Stock'),
('NDOH35004', 'GLUCOSE METER- BIO HERMES', 'KZN 1', 'Each', 'Glucose Testing', 7092.00, 0.00, 24880.00, 157.01, 200, 10000, 'Bio Hermes Medical', '2024-01-10', 'In Stock'),
('NDOH35018', 'GLOCOSE METER - QUALITY CONTROL SOLUTIONS', 'KZN 1', 'Each', 'Quality Control', 569.00, 0.00, 1480.00, 27.72, 100, 1000, 'Quality Control Ltd', '2024-02-15', 'Low Stock'),
('NDOH35006', 'DUAL GLUCOSE & HBA1C METER- BIOHERMES', 'KZN 1', 'Each', 'Glucose Testing', 1483.00, 0.00, 0.00, 2527.98, 50, 2000, 'Bio Hermes Medical', '2024-01-25', 'In Stock'),
('NDOH35034', 'HBA1C TEST STRIPS', 'KZN 1', '50Pack', 'HBA1C Testing', 1974.00, 0.00, 5.00, 2028.26, 100, 3000, 'HBA1C Diagnostics', '2024-02-01', 'In Stock'),
('NDOH35005', 'MULTIPARAMETER - TAIDOC', 'KZN 1', 'Each', 'Multiparameter Testing', 6971.00, 0.00, 0.00, 607.10, 100, 8000, 'Taidoc Technology', '2024-01-30', 'In Stock'),
('NDOH35019', 'MULTIPARAMETER - 50 KETONE TEST STRIPS VIAL', 'KZN 1', '50Pack', 'Multiparameter Testing', 2470.00, 0.00, 6000.00, 460.78, 500, 5000, 'Taidoc Technology', '2024-02-10', 'Low Stock'),
('NDOH35020', 'MULTIPARAMETER - 50 URIC ACID VIAL', 'KZN 1', '50Pack', 'Multiparameter Testing', 969.00, 0.00, 0.00, 316.75, 200, 2000, 'Taidoc Technology', '2024-02-05', 'In Stock'),
('NDOH35021', 'MULTIPARAMETER - 50 CHOLESTEROL VIAL', 'KZN 1', '50Pack', 'Multiparameter Testing', 2082.00, 0.00, 0.00, 791.85, 300, 3000, 'Taidoc Technology', '2024-01-28', 'In Stock'),
('NDOH35022', 'MULTIPARAMETER - 50 LACTATE VIAL', 'KZN 1', '50Pack', 'Multiparameter Testing', 970.00, 0.00, 0.00, 1007.83, 200, 2000, 'Taidoc Technology', '2024-02-12', 'In Stock'),
('NDOH35036', 'DUAL GLUCOSE & HBA1C - QUALITY CONTROL SOLUTION HBA1C', 'KZN 1', 'Each', 'Quality Control', 0.00, 0.00, 19.00, 166.29, 50, 500, 'Bio Hermes Medical', NULL, 'Out of Stock'),
('NDOH35037', 'DUAL GLUCOSE & HBA1C - QUALITY CONTROL SOLUTIONS GLUCOSE', 'KZN 1', 'Each', 'Quality Control', 17000.00, 0.00, 0.00, 27.72, 1000, 20000, 'Bio Hermes Medical', '2024-02-20', 'In Stock');

-- =============================================
-- 8. SALES TABLE
-- =============================================
CREATE TABLE dbo.Sales (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SaleNumber NVARCHAR(50) NOT NULL UNIQUE,
    SaleDate DATE NOT NULL,
    ProvinceId INT NOT NULL,
    FacilityId INT NULL,
    CustomerContactName NVARCHAR(200) NULL,
    CustomerContactEmail NVARCHAR(100) NULL,
    CustomerContactPhone NVARCHAR(20) NULL,
    Subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    TaxAmount DECIMAL(15,2) NOT NULL DEFAULT 0,
    Total DECIMAL(15,2) NOT NULL DEFAULT 0,
    PaymentMethod NVARCHAR(50) NULL CHECK (PaymentMethod IN ('Cash', 'Credit Card', 'Bank Transfer', 'Government Contract')),
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (PaymentStatus IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    DeliveryStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (DeliveryStatus IN ('Pending', 'In Transit', 'Delivered', 'Cancelled')),
    DeliveryDate DATE NULL,
    Notes NTEXT NULL,
    SalesPerson NVARCHAR(200) NULL,
    Discount DECIMAL(15,2) DEFAULT 0,
    InvoiceNumber NVARCHAR(50) NULL,
    CreatedBy NVARCHAR(200) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES dbo.Provinces(Id),
    FOREIGN KEY (FacilityId) REFERENCES dbo.HealthFacilities(Id)
);

-- =============================================
-- 9. SALES ITEMS TABLE
-- =============================================
CREATE TABLE dbo.SalesItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SaleId INT NOT NULL,
    InventoryItemId INT NOT NULL,
    ProductName NVARCHAR(500) NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalPrice AS (Quantity * UnitPrice),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SaleId) REFERENCES dbo.Sales(Id) ON DELETE CASCADE,
    FOREIGN KEY (InventoryItemId) REFERENCES dbo.InventoryItems(Id)
);

-- =============================================
-- 10. DELIVERY RECORDS TABLE
-- =============================================
CREATE TABLE dbo.DeliveryRecords (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DeliveryNumber NVARCHAR(50) NOT NULL UNIQUE,
    SaleId INT NULL,
    InstitutionName NVARCHAR(200) NOT NULL,
    ProvinceId INT NOT NULL,
    ItemDescription NVARCHAR(500) NOT NULL,
    Quantity INT NOT NULL,
    DeliveryDate DATE NOT NULL,
    InvoiceNumber NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'In Transit', 'Delivered', 'Failed', 'Returned')),
    DriverName NVARCHAR(200) NULL,
    VehicleNumber NVARCHAR(20) NULL,
    RecipientName NVARCHAR(200) NULL,
    RecipientSignature NVARCHAR(500) NULL,
    ReceivedDate DATETIME2 NULL,
    Comment NTEXT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SaleId) REFERENCES dbo.Sales(Id),
    FOREIGN KEY (ProvinceId) REFERENCES dbo.Provinces(Id)
);

-- Insert delivery records from codebase
INSERT INTO dbo.DeliveryRecords (DeliveryNumber, InstitutionName, ProvinceId, ItemDescription, Quantity, DeliveryDate, InvoiceNumber, Status, Comment) VALUES
-- Free State deliveries
('DEL-2024-001', 'Bloemfontein Medical Depot', 8, 'Glucose Meter', 5000, '2024-01-15', 'INV-2024-001', 'Delivered', 'Primary distribution center'),
('DEL-2024-034', 'FS Health & Social Development', 8, 'Glucose Meter', 3089, '2024-02-10', 'INV-2024-034', 'Delivered', 'Provincial health facilities'),
('DEL-2024-002', 'Bloemfontein Medical Depot', 8, 'Glucose Test Strips', 10000, '2024-01-15', 'INV-2024-002', 'Delivered', 'Bulk strips distribution'),
('DEL-2024-035', 'FS Health & Social Development', 8, 'Glucose Test Strips', 1760, '2024-02-10', 'INV-2024-035', 'Delivered', 'Additional strips'),
('DEL-2024-045', 'Bahlabani Pharmacy', 8, 'HBA1C Test Strips', 1, '2024-03-05', 'INV-2024-045', 'Delivered', 'Special order'),
('DEL-2024-036', 'FS Health & Social Development', 8, 'HB Meter', 63, '2024-02-20', 'INV-2024-036', 'Delivered', 'Hemoglobin testing units'),
('DEL-2024-037', 'FS Health & Social Development', 8, 'HB Test Strips', 1103, '2024-02-20', 'INV-2024-037', 'Delivered', 'HB testing supplies'),

-- KwaZulu-Natal deliveries
('DEL-2024-010', 'Provincial Pharm Supply Depot', 2, 'Glucose Meter', 15000, '2024-01-08', 'INV-2024-010', 'Delivered', 'Major provincial distribution'),
('DEL-2024-025', 'Provincial Pharm Supply Depot', 2, 'Glucose Meter', 5437, '2024-02-15', 'INV-2024-025', 'Delivered', 'Secondary distribution'),
('DEL-2024-011', 'Provincial Pharm Supply Depot', 2, 'Glucose Test Strips', 25000, '2024-01-08', 'INV-2024-011', 'Delivered', 'Primary strips shipment'),
('DEL-2024-026', 'Provincial Pharm Supply Depot', 2, 'Glucose Test Strips', 13479, '2024-02-15', 'INV-2024-026', 'Delivered', 'Additional strips'),
('DEL-2024-012', 'Provincial Pharm Supply Depot', 2, 'HBA1C Test Strips', 155, '2024-01-20', 'INV-2024-012', 'Delivered', 'Specialty testing strips'),
('DEL-2024-040', 'Provincial Pharm Supply Depot', 2, 'Dual Glucose & HBA1C Meter', 7, '2024-03-01', 'INV-2024-040', 'Delivered', 'Advanced dual function meters'),
('DEL-2024-020', 'Provincial Pharm Supply Depot', 2, 'HB Meter', 50, '2024-02-05', 'INV-2024-020', 'Delivered', 'Hemoglobin testing'),
('DEL-2024-021', 'Provincial Pharm Supply Depot', 2, 'HB Test Strips', 60, '2024-02-05', 'INV-2024-021', 'Delivered', 'HB testing supplies'),

-- Gauteng deliveries
('DEL-2024-015', 'Charlotte Maxeke Johannesburg Academic Hospital', 1, 'Glucose Meter', 3500, '2024-01-12', 'INV-2024-015', 'Delivered', 'Academic hospital distribution'),
('DEL-2024-016', 'Chris Hani Baragwanath Academic Hospital', 1, 'Glucose Meter', 4000, '2024-01-18', 'INV-2024-016', 'Delivered', 'Large hospital complex'),
('DEL-2024-030', 'Steve Biko Academic Hospital', 1, 'Glucose Meter', 2166, '2024-02-08', 'INV-2024-030', 'Delivered', 'Pretoria academic hospital'),
('DEL-2024-038', 'Gauteng Health Department', 1, 'Glucose Meter', 1500, '2024-02-25', 'INV-2024-038', 'Delivered', 'Provincial health facilities'),
('DEL-2024-017', 'Charlotte Maxeke Johannesburg Academic Hospital', 1, 'Glucose Test Strips', 8000, '2024-01-12', 'INV-2024-017', 'Delivered', 'Hospital strips supply'),
('DEL-2024-018', 'Chris Hani Baragwanath Academic Hospital', 1, 'Glucose Test Strips', 9000, '2024-01-18', 'INV-2024-018', 'Delivered', 'Large hospital strips'),
('DEL-2024-031', 'Steve Biko Academic Hospital', 1, 'Glucose Test Strips', 3655, '2024-02-08', 'INV-2024-031', 'Delivered', 'Pretoria strips supply'),
('DEL-2024-039', 'Gauteng Health Department', 1, 'Glucose Test Strips', 2000, '2024-02-25', 'INV-2024-039', 'Delivered', 'Provincial strips distribution'),
('DEL-2024-032', 'Gauteng Health Department', 1, 'HB Meter', 637, '2024-02-12', 'INV-2024-032', 'Delivered', 'Hemoglobin meters for clinics'),
('DEL-2024-033', 'Gauteng Health Department', 1, 'HB Test Strips', 1474, '2024-02-12', 'INV-2024-033', 'Delivered', 'HB testing strips supply'),
('DEL-2024-046', 'Gauteng Health Department', 1, 'HBA1C Test Strips', 170, '2024-03-10', 'INV-2024-046', 'Delivered', 'Specialty HBA1C strips'),

-- Limpopo deliveries
('DEL-2024-022', 'Limpopo Department of Health', 5, 'Glucose Meter', 3000, '2024-01-25', 'INV-2024-022', 'Delivered', 'Provincial health distribution'),
('DEL-2024-028', 'Polokwane Provincial Hospital', 5, 'Glucose Meter', 2565, '2024-02-18', 'INV-2024-028', 'Delivered', 'Provincial hospital supply'),
('DEL-2024-023', 'Limpopo Department of Health', 5, 'Glucose Test Strips', 15000, '2024-01-25', 'INV-2024-023', 'Delivered', 'Large strips distribution'),
('DEL-2024-029', 'Polokwane Provincial Hospital', 5, 'Glucose Test Strips', 8300, '2024-02-18', 'INV-2024-029', 'Delivered', 'Hospital strips supply'),

-- Mpumalanga deliveries
('DEL-2024-024', 'Mpumalanga Department of Health', 6, 'Glucose Meter', 2517, '2024-02-02', 'INV-2024-024', 'Delivered', 'Provincial health facilities'),
('DEL-2024-027', 'Mpumalanga Department of Health', 6, 'Glucose Test Strips', 5000, '2024-02-02', 'INV-2024-027', 'Delivered', 'Provincial strips supply'),
('DEL-2024-044', 'Mpumalanga Department of Health', 6, 'HBA1C Test Strips', 39, '2024-03-08', 'INV-2024-044', 'Delivered', 'Specialty testing strips'),
('DEL-2024-041', 'Mpumalanga Department of Health', 6, 'HB Meter', 14, '2024-02-22', 'INV-2024-041', 'Delivered', 'Hemoglobin testing units'),
('DEL-2024-042', 'Mpumalanga Department of Health', 6, 'HB Test Strips', 55, '2024-02-22', 'INV-2024-042', 'Delivered', 'HB testing supplies'),

-- Northern Cape deliveries
('DEL-2024-047', 'Northern Cape Department of Health', 9, 'Glucose Meter', 100, '2024-03-12', 'INV-2024-047', 'Delivered', 'Small rural province allocation'),
('DEL-2024-048', 'Northern Cape Department of Health', 9, 'Glucose Test Strips', 100, '2024-03-12', 'INV-2024-048', 'Delivered', 'Rural clinic strips'),

-- Eastern Cape deliveries
('DEL-2024-049', 'Eastern Cape Department of Health', 3, 'Glucose Meter', 399, '2024-03-15', 'INV-2024-049', 'Delivered', 'Provincial health facilities'),
('DEL-2024-050', 'Eastern Cape Department of Health', 3, 'Glucose Test Strips', 399, '2024-03-15', 'INV-2024-050', 'Delivered', 'Matching strips supply');

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IX_Provinces_Code ON dbo.Provinces(Code);
CREATE INDEX IX_Districts_ProvinceId ON dbo.Districts(ProvinceId);
CREATE INDEX IX_HealthFacilities_ProvinceId ON dbo.HealthFacilities(ProvinceId);
CREATE INDEX IX_HealthFacilities_Type ON dbo.HealthFacilities(FacilityType);
CREATE INDEX IX_Trainers_ProvinceId ON dbo.Trainers(ProvinceId);
CREATE INDEX IX_Trainers_Status ON dbo.Trainers(Status);
CREATE INDEX IX_TrainingSessions_ProvinceId ON dbo.TrainingSessions(ProvinceId);
CREATE INDEX IX_TrainingSessions_TrainerId ON dbo.TrainingSessions(TrainerId);
CREATE INDEX IX_TrainingSessions_Status ON dbo.TrainingSessions(Status);
CREATE INDEX IX_TrainingSessions_StartDate ON dbo.TrainingSessions(StartDate);
CREATE INDEX IX_TrainingRegisters_TrainerId ON dbo.TrainingRegisters(TrainerId);
CREATE INDEX IX_TrainingRegisters_SessionDate ON dbo.TrainingRegisters(SessionDate);
CREATE INDEX IX_InventoryItems_ItemNumber ON dbo.InventoryItems(ItemNumber);
CREATE INDEX IX_InventoryItems_Category ON dbo.InventoryItems(Category);
CREATE INDEX IX_InventoryItems_Status ON dbo.InventoryItems(Status);
CREATE INDEX IX_Sales_ProvinceId ON dbo.Sales(ProvinceId);
CREATE INDEX IX_Sales_SaleDate ON dbo.Sales(SaleDate);
CREATE INDEX IX_Sales_PaymentStatus ON dbo.Sales(PaymentStatus);
CREATE INDEX IX_Sales_DeliveryStatus ON dbo.Sales(DeliveryStatus);
CREATE INDEX IX_SalesItems_SaleId ON dbo.SalesItems(SaleId);
CREATE INDEX IX_SalesItems_InventoryItemId ON dbo.SalesItems(InventoryItemId);
CREATE INDEX IX_DeliveryRecords_ProvinceId ON dbo.DeliveryRecords(ProvinceId);
CREATE INDEX IX_DeliveryRecords_DeliveryDate ON dbo.DeliveryRecords(DeliveryDate);
CREATE INDEX IX_DeliveryRecords_Status ON dbo.DeliveryRecords(Status);

-- =============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =============================================
GO

-- Province summary view
CREATE VIEW vw_ProvinceSummary AS
SELECT 
    p.Name AS ProvinceName,
    p.Code AS ProvinceCode,
    COUNT(DISTINCT hf.Id) AS TotalFacilities,
    COUNT(DISTINCT t.Id) AS TotalTrainers,
    COUNT(DISTINCT ts.Id) AS TotalTrainingSessions,
    COUNT(DISTINCT s.Id) AS TotalSales,
    COUNT(DISTINCT dr.Id) AS TotalDeliveries
FROM dbo.Provinces p
LEFT JOIN dbo.HealthFacilities hf ON p.Id = hf.ProvinceId
LEFT JOIN dbo.Trainers t ON p.Id = t.ProvinceId
LEFT JOIN dbo.TrainingSessions ts ON p.Id = ts.ProvinceId
LEFT JOIN dbo.Sales s ON p.Id = s.ProvinceId
LEFT JOIN dbo.DeliveryRecords dr ON p.Id = dr.ProvinceId
GROUP BY p.Id, p.Name, p.Code;
GO

-- Inventory status view
CREATE VIEW vw_InventoryStatus AS
SELECT 
    ItemNumber,
    Description,
    Category,
    QtyOnHand,
    QtyOnPO,
    QtyOnSO,
    (QtyOnHand + QtyOnPO - QtyOnSO) AS StockAvailable,
    UnitCostForQOH,
    (QtyOnHand * UnitCostForQOH) AS TotalValue,
    CASE 
        WHEN (QtyOnHand + QtyOnPO - QtyOnSO) <= 0 THEN 'Out of Stock'
        WHEN (QtyOnHand + QtyOnPO - QtyOnSO) < ISNULL(ReorderLevel, 100) THEN 'Low Stock'
        ELSE 'In Stock'
    END AS CurrentStatus,
    Status,
    LastRestocked
FROM dbo.InventoryItems;
GO

-- Training statistics view
CREATE VIEW vw_TrainingStatistics AS
SELECT 
    p.Name AS Province,
    t.Name AS TrainerName,
    COUNT(ts.Id) AS TotalSessions,
    COUNT(CASE WHEN ts.Status = 'Completed' THEN 1 END) AS CompletedSessions,
    SUM(ts.NumberOfParticipants) AS TotalParticipants,
    AVG(CAST(tr.AttendanceRate AS FLOAT)) AS AverageAttendanceRate,
    SUM(tr.CertificatesIssued) AS TotalCertificatesIssued
FROM dbo.Trainers t
JOIN dbo.Provinces p ON t.ProvinceId = p.Id
LEFT JOIN dbo.TrainingSessions ts ON t.Id = ts.TrainerId
LEFT JOIN dbo.TrainingRegisters tr ON t.Id = tr.TrainerId
GROUP BY p.Name, t.Name, t.Id;
GO

-- Delivery summary view
CREATE VIEW vw_DeliverySummary AS
SELECT 
    p.Name AS Province,
    dr.ItemDescription,
    COUNT(*) AS TotalDeliveries,
    SUM(dr.Quantity) AS TotalQuantity,
    COUNT(CASE WHEN dr.Status = 'Delivered' THEN 1 END) AS DeliveredCount,
    SUM(CASE WHEN dr.Status = 'Delivered' THEN dr.Quantity ELSE 0 END) AS DeliveredQuantity,
    CAST(COUNT(CASE WHEN dr.Status = 'Delivered' THEN 1 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS DeliveryRate
FROM dbo.DeliveryRecords dr
JOIN dbo.Provinces p ON dr.ProvinceId = p.Id
GROUP BY p.Name, dr.ItemDescription;
GO

-- =============================================
-- CREATE STORED PROCEDURES FOR COMMON OPERATIONS
-- =============================================

-- Get training statistics by province
CREATE PROCEDURE sp_GetTrainingStatsByProvince
    @ProvinceId INT = NULL
AS
BEGIN
    SELECT 
        p.Name AS Province,
        COUNT(DISTINCT t.Id) AS ActiveTrainers,
        COUNT(DISTINCT ts.Id) AS TotalSessions,
        COUNT(DISTINCT CASE WHEN ts.Status = 'Completed' THEN ts.Id END) AS CompletedSessions,
        SUM(ts.NumberOfParticipants) AS TotalParticipants,
        AVG(CAST(tr.AttendanceRate AS FLOAT)) AS AverageAttendanceRate,
        SUM(tr.CertificatesIssued) AS TotalCertificates
    FROM dbo.Provinces p
    LEFT JOIN dbo.Trainers t ON p.Id = t.ProvinceId AND t.Status = 'Active'
    LEFT JOIN dbo.TrainingSessions ts ON t.Id = ts.TrainerId
    LEFT JOIN dbo.TrainingRegisters tr ON t.Id = tr.TrainerId
    WHERE (@ProvinceId IS NULL OR p.Id = @ProvinceId)
    GROUP BY p.Id, p.Name
    ORDER BY p.Name;
END;
GO

-- Get inventory items by category
CREATE PROCEDURE sp_GetInventoryByCategory
    @Category NVARCHAR(100) = NULL,
    @Status NVARCHAR(20) = NULL
AS
BEGIN
    SELECT 
        ItemNumber,
        Description,
        Category,
        QtyOnHand,
        QtyOnPO,
        QtyOnSO,
        (QtyOnHand + QtyOnPO - QtyOnSO) AS StockAvailable,
        UnitCostForQOH,
        (QtyOnHand * UnitCostForQOH) AS TotalValue,
        Status,
        LastRestocked
    FROM dbo.InventoryItems
    WHERE (@Category IS NULL OR Category = @Category)
      AND (@Status IS NULL OR Status = @Status)
    ORDER BY Category, Description;
END;
GO

-- Get delivery records by province and date range
CREATE PROCEDURE sp_GetDeliveriesByProvinceAndDate
    @ProvinceId INT = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL
AS
BEGIN
    SELECT 
        dr.DeliveryNumber,
        dr.InstitutionName,
        p.Name AS Province,
        dr.ItemDescription,
        dr.Quantity,
        dr.DeliveryDate,
        dr.InvoiceNumber,
        dr.Status,
        dr.Comment
    FROM dbo.DeliveryRecords dr
    JOIN dbo.Provinces p ON dr.ProvinceId = p.Id
    WHERE (@ProvinceId IS NULL OR dr.ProvinceId = @ProvinceId)
      AND (@StartDate IS NULL OR dr.DeliveryDate >= @StartDate)
      AND (@EndDate IS NULL OR dr.DeliveryDate <= @EndDate)
    ORDER BY dr.DeliveryDate DESC, dr.InstitutionName;
END;
GO

-- =============================================
-- SAMPLE DATA VERIFICATION QUERIES
-- =============================================

-- Verify data has been inserted correctly
SELECT 'Provinces' AS TableName, COUNT(*) AS RecordCount FROM dbo.Provinces
UNION ALL
SELECT 'Districts', COUNT(*) FROM dbo.Districts
UNION ALL
SELECT 'HealthFacilities', COUNT(*) FROM dbo.HealthFacilities
UNION ALL
SELECT 'Trainers', COUNT(*) FROM dbo.Trainers
UNION ALL
SELECT 'TrainingSessions', COUNT(*) FROM dbo.TrainingSessions
UNION ALL
SELECT 'TrainingRegisters', COUNT(*) FROM dbo.TrainingRegisters
UNION ALL
SELECT 'InventoryItems', COUNT(*) FROM dbo.InventoryItems
UNION ALL
SELECT 'DeliveryRecords', COUNT(*) FROM dbo.DeliveryRecords;

-- Show province summary
SELECT * FROM vw_ProvinceSummary ORDER BY ProvinceName;

-- Show inventory status
SELECT Category, CurrentStatus, COUNT(*) AS ItemCount, SUM(TotalValue) AS TotalValue
FROM vw_InventoryStatus
GROUP BY Category, CurrentStatus
ORDER BY Category, CurrentStatus;

-- Show training statistics
SELECT * FROM vw_TrainingStatistics ORDER BY Province, TrainerName;

-- Show delivery summary
SELECT Province, ItemDescription, TotalQuantity, DeliveredQuantity, DeliveryRate
FROM vw_DeliverySummary
WHERE TotalQuantity > 0
ORDER BY Province, ItemDescription;

PRINT 'NDCANGU Database Schema Created Successfully!';
PRINT 'Total Records Inserted:';
PRINT '- Provinces: 9';
PRINT '- Districts: 38'; 
PRINT '- Health Facilities: 70+';
PRINT '- Trainers: 6';
PRINT '- Training Sessions: 6';
PRINT '- Training Registers: 6';
PRINT '- Inventory Items: 18';
PRINT '- Delivery Records: 33+';
PRINT '';
PRINT 'Views Created: 4';
PRINT 'Stored Procedures Created: 3';
PRINT 'Indexes Created: 20+';
PRINT '';
PRINT 'Ready for API implementation!';