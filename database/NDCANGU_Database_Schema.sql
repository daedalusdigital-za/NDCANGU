-- =====================================================
-- NDCANGU Database Schema Creation Script
-- For Azure SQL Database / SQL Server
-- Generated from API_ENDPOINTS_NEEDED.md specifications
-- Version: 2.0
-- Date: October 2024
-- =====================================================

-- Drop existing tables if they exist (in reverse dependency order)
IF OBJECT_ID('DeliveryRecords', 'U') IS NOT NULL DROP TABLE DeliveryRecords;
IF OBJECT_ID('SaleItems', 'U') IS NOT NULL DROP TABLE SaleItems;
IF OBJECT_ID('Sales', 'U') IS NOT NULL DROP TABLE Sales;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('InventoryItems', 'U') IS NOT NULL DROP TABLE InventoryItems;
IF OBJECT_ID('TrainingRegisters', 'U') IS NOT NULL DROP TABLE TrainingRegisters;
IF OBJECT_ID('TrainingSessions', 'U') IS NOT NULL DROP TABLE TrainingSessions;
IF OBJECT_ID('Trainers', 'U') IS NOT NULL DROP TABLE Trainers;
IF OBJECT_ID('FileUploads', 'U') IS NOT NULL DROP TABLE FileUploads;
IF OBJECT_ID('HealthFacilities', 'U') IS NOT NULL DROP TABLE HealthFacilities;
IF OBJECT_ID('Districts', 'U') IS NOT NULL DROP TABLE Districts;
IF OBJECT_ID('Provinces', 'U') IS NOT NULL DROP TABLE Provinces;

-- =====================================================
-- 1. LOCATION/GEOGRAPHIC TABLES
-- =====================================================

-- Provinces Table
CREATE TABLE Provinces (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Code NVARCHAR(10) NOT NULL UNIQUE,
    Population BIGINT,
    HealthFacilities INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Districts Table
CREATE TABLE Districts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    ProvinceId INT NOT NULL,
    Code NVARCHAR(20),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES Provinces(Id) ON DELETE CASCADE
);

-- Health Facilities (Hospitals and Clinics)
CREATE TABLE HealthFacilities (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    ProvinceId INT NOT NULL,
    DistrictId INT,
    Type NVARCHAR(20) NOT NULL CHECK (Type IN ('Hospital', 'Clinic', 'CHC', 'Specialized')),
    Level NVARCHAR(20) CHECK (Level IN ('Primary', 'Secondary', 'Tertiary')),
    Address NVARCHAR(500),
    ContactNumber NVARCHAR(20),
    Email NVARCHAR(100),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive', 'Under Construction')),
    Capacity INT,
    Services NVARCHAR(MAX), -- JSON array of services
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES Provinces(Id),
    FOREIGN KEY (DistrictId) REFERENCES Districts(Id)
);

-- =====================================================
-- 2. TRAINING MODULE TABLES
-- =====================================================

-- Trainers Table
CREATE TABLE Trainers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20) NOT NULL,
    ProvinceId INT NOT NULL,
    Qualification NVARCHAR(200),
    Experience INT DEFAULT 0 CHECK (Experience >= 0),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive', 'On Leave')),
    Location NVARCHAR(100),
    Bio NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES Provinces(Id)
);

-- Training Sessions Table
CREATE TABLE TrainingSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrainingName NVARCHAR(200) NOT NULL,
    TrainingType NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    ProvinceId INT NOT NULL,
    HospitalId INT NOT NULL,
    Venue NVARCHAR(200) NOT NULL,
    TrainerId INT NOT NULL,
    NumberOfParticipants INT NOT NULL CHECK (NumberOfParticipants BETWEEN 1 AND 100),
    TargetAudience NVARCHAR(200) NOT NULL,
    Objectives NVARCHAR(MAX),
    Materials NVARCHAR(MAX),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Planned' CHECK (Status IN ('Planned', 'Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES Provinces(Id),
    FOREIGN KEY (HospitalId) REFERENCES HealthFacilities(Id),
    FOREIGN KEY (TrainerId) REFERENCES Trainers(Id),
    CONSTRAINT CK_TrainingSession_EndDate CHECK (EndDate >= StartDate)
);

-- Training Registers Table
CREATE TABLE TrainingRegisters (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SessionTitle NVARCHAR(200) NOT NULL,
    TrainerName NVARCHAR(100) NOT NULL,
    TrainerId INT,
    Date DATE NOT NULL,
    Venue NVARCHAR(200) NOT NULL,
    Participants INT NOT NULL CHECK (Participants >= 0),
    Duration NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    Topic NVARCHAR(200) NOT NULL,
    AttendanceRate DECIMAL(5,2) CHECK (AttendanceRate BETWEEN 0 AND 100),
    CertificatesIssued INT DEFAULT 0 CHECK (CertificatesIssued >= 0),
    RegisterFile NVARCHAR(500), -- File path/URL
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (TrainerId) REFERENCES Trainers(Id)
);

-- =====================================================
-- 3. INVENTORY MANAGEMENT TABLES
-- =====================================================

-- Inventory Items Table
CREATE TABLE InventoryItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ItemNumber NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    UOM NVARCHAR(20) NOT NULL, -- Unit of Measure
    Category NVARCHAR(50) NOT NULL CHECK (Category IN (
        'Hemoglobin Testing', 'Glucose Testing', 'HBA1C Testing', 
        'Multiparameter Testing', 'Quality Control', 'Equipment Accessories', 
        'Disposables', 'Medical Equipment'
    )),
    QtyOnHand DECIMAL(18,2) NOT NULL DEFAULT 0,
    QtyOnPO DECIMAL(18,2) DEFAULT 0, -- Quantity on Purchase Order
    QtyOnSO DECIMAL(18,2) DEFAULT 0, -- Quantity on Sales Order
    StockAvailable AS (QtyOnHand + QtyOnPO - QtyOnSO) PERSISTED,
    UnitCostForQOH DECIMAL(18,2) NOT NULL,
    TotalCostForQOH AS (QtyOnHand * UnitCostForQOH) PERSISTED,
    ReorderLevel DECIMAL(18,2) DEFAULT 0,
    MaxStockLevel DECIMAL(18,2),
    Supplier NVARCHAR(200),
    LastRestocked DATETIME2,
    ExpiryDate DATE,
    Status NVARCHAR(20) NOT NULL DEFAULT 'In Stock' CHECK (Status IN ('In Stock', 'Low Stock', 'Out of Stock', 'Discontinued')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =====================================================
-- 4. SALES MANAGEMENT TABLES
-- =====================================================

-- Products Table (Catalog)
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Category NVARCHAR(50) NOT NULL CHECK (Category IN (
        'Hemoglobin Testing', 'Glucose Testing', 'HBA1C Testing', 
        'Multiparameter Testing', 'Quality Control', 'Equipment Accessories', 
        'Disposables', 'Medical Equipment'
    )),
    Price DECIMAL(18,2) NOT NULL CHECK (Price >= 0),
    Stock INT NOT NULL DEFAULT 0 CHECK (Stock >= 0),
    Supplier NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'In Stock' CHECK (Status IN ('In Stock', 'Low Stock', 'Out of Stock', 'Discontinued')),
    LastRestocked DATETIME2,
    SKU NVARCHAR(100) UNIQUE,
    Barcode NVARCHAR(100),
    Weight DECIMAL(10,3), -- in kg
    Length DECIMAL(10,2), -- in cm
    Width DECIMAL(10,2), -- in cm
    Height DECIMAL(10,2), -- in cm
    MinimumOrderQuantity INT DEFAULT 1,
    LeadTime INT DEFAULT 0, -- in days
    Warranty NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Sales Table
CREATE TABLE Sales (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SaleNumber NVARCHAR(50) NOT NULL UNIQUE,
    SaleDate DATE NOT NULL,
    ProvinceId INT NOT NULL,
    HospitalId INT NOT NULL,
    CustomerContactName NVARCHAR(100),
    CustomerContactEmail NVARCHAR(100),
    CustomerContactPhone NVARCHAR(20),
    Subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    TaxAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Total DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaymentMethod NVARCHAR(30) CHECK (PaymentMethod IN ('Cash', 'Credit Card', 'Bank Transfer', 'Government Contract')),
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (PaymentStatus IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    DeliveryStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (DeliveryStatus IN ('Pending', 'In Transit', 'Delivered', 'Cancelled')),
    DeliveryDate DATE,
    Notes NVARCHAR(MAX),
    SalesPerson NVARCHAR(100),
    Discount DECIMAL(18,2) DEFAULT 0 CHECK (Discount >= 0),
    InvoiceNumber NVARCHAR(50),
    CreatedBy NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ProvinceId) REFERENCES Provinces(Id),
    FOREIGN KEY (HospitalId) REFERENCES HealthFacilities(Id),
    CONSTRAINT CK_Sale_Total CHECK (Total = Subtotal + TaxAmount - Discount)
);

-- Sale Items Table
CREATE TABLE SaleItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SaleId INT NOT NULL,
    ProductId INT NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    Quantity DECIMAL(18,2) NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(18,2) NOT NULL CHECK (UnitPrice >= 0),
    TotalPrice AS (Quantity * UnitPrice) PERSISTED,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SaleId) REFERENCES Sales(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- =====================================================
-- 5. DELIVERY TRACKING TABLES
-- =====================================================

-- Delivery Records Table
CREATE TABLE DeliveryRecords (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DeliveryNumber NVARCHAR(50) NOT NULL UNIQUE,
    SaleId INT NOT NULL,
    InstitutionName NVARCHAR(200) NOT NULL,
    ProvinceId INT NOT NULL,
    ItemDescription NVARCHAR(500) NOT NULL,
    Quantity DECIMAL(18,2) NOT NULL CHECK (Quantity > 0),
    DeliveryDate DATE NOT NULL,
    InvoiceNumber NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'In Transit', 'Delivered', 'Failed', 'Returned')),
    DriverName NVARCHAR(100),
    VehicleNumber NVARCHAR(50),
    RecipientName NVARCHAR(100),
    RecipientSignature NVARCHAR(MAX), -- Digital signature data
    ReceivedDate DATETIME2,
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (SaleId) REFERENCES Sales(Id),
    FOREIGN KEY (ProvinceId) REFERENCES Provinces(Id)
);

-- =====================================================
-- 6. FILE MANAGEMENT TABLES
-- =====================================================

-- File Uploads Table
CREATE TABLE FileUploads (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FileName NVARCHAR(255) NOT NULL,
    FileType NVARCHAR(20) NOT NULL,
    FileSize BIGINT NOT NULL CHECK (FileSize > 0),
    FilePath NVARCHAR(500) NOT NULL,
    UploadedBy NVARCHAR(100) NOT NULL,
    UploadDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    Category NVARCHAR(50) CHECK (Category IN ('Training Register', 'Report', 'Document', 'Image')),
    AssociatedId INT,
    AssociatedType NVARCHAR(50),
    IsPublic BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- Province indexes
CREATE INDEX IX_Provinces_Code ON Provinces(Code);
CREATE INDEX IX_Provinces_Name ON Provinces(Name);

-- Districts indexes
CREATE INDEX IX_Districts_ProvinceId ON Districts(ProvinceId);
CREATE INDEX IX_Districts_Name ON Districts(Name);

-- Health Facilities indexes
CREATE INDEX IX_HealthFacilities_ProvinceId ON HealthFacilities(ProvinceId);
CREATE INDEX IX_HealthFacilities_Type ON HealthFacilities(Type);
CREATE INDEX IX_HealthFacilities_Status ON HealthFacilities(Status);
CREATE INDEX IX_HealthFacilities_Code ON HealthFacilities(Code);

-- Trainers indexes
CREATE INDEX IX_Trainers_ProvinceId ON Trainers(ProvinceId);
CREATE INDEX IX_Trainers_Status ON Trainers(Status);
CREATE INDEX IX_Trainers_Email ON Trainers(Email);

-- Training Sessions indexes
CREATE INDEX IX_TrainingSessions_TrainerId ON TrainingSessions(TrainerId);
CREATE INDEX IX_TrainingSessions_ProvinceId ON TrainingSessions(ProvinceId);
CREATE INDEX IX_TrainingSessions_Status ON TrainingSessions(Status);
CREATE INDEX IX_TrainingSessions_StartDate ON TrainingSessions(StartDate);
CREATE INDEX IX_TrainingSessions_EndDate ON TrainingSessions(EndDate);

-- Training Registers indexes
CREATE INDEX IX_TrainingRegisters_TrainerId ON TrainingRegisters(TrainerId);
CREATE INDEX IX_TrainingRegisters_Date ON TrainingRegisters(Date);
CREATE INDEX IX_TrainingRegisters_Status ON TrainingRegisters(Status);

-- Inventory indexes
CREATE INDEX IX_InventoryItems_ItemNumber ON InventoryItems(ItemNumber);
CREATE INDEX IX_InventoryItems_Category ON InventoryItems(Category);
CREATE INDEX IX_InventoryItems_Status ON InventoryItems(Status);
CREATE INDEX IX_InventoryItems_Location ON InventoryItems(Location);

-- Products indexes
CREATE INDEX IX_Products_Category ON Products(Category);
CREATE INDEX IX_Products_Status ON Products(Status);
CREATE INDEX IX_Products_SKU ON Products(SKU);

-- Sales indexes
CREATE INDEX IX_Sales_SaleNumber ON Sales(SaleNumber);
CREATE INDEX IX_Sales_SaleDate ON Sales(SaleDate);
CREATE INDEX IX_Sales_ProvinceId ON Sales(ProvinceId);
CREATE INDEX IX_Sales_PaymentStatus ON Sales(PaymentStatus);
CREATE INDEX IX_Sales_DeliveryStatus ON Sales(DeliveryStatus);
CREATE INDEX IX_Sales_CreatedBy ON Sales(CreatedBy);

-- Sale Items indexes
CREATE INDEX IX_SaleItems_SaleId ON SaleItems(SaleId);
CREATE INDEX IX_SaleItems_ProductId ON SaleItems(ProductId);

-- Delivery Records indexes
CREATE INDEX IX_DeliveryRecords_SaleId ON DeliveryRecords(SaleId);
CREATE INDEX IX_DeliveryRecords_ProvinceId ON DeliveryRecords(ProvinceId);
CREATE INDEX IX_DeliveryRecords_DeliveryDate ON DeliveryRecords(DeliveryDate);
CREATE INDEX IX_DeliveryRecords_Status ON DeliveryRecords(Status);
CREATE INDEX IX_DeliveryRecords_InvoiceNumber ON DeliveryRecords(InvoiceNumber);

-- File Uploads indexes
CREATE INDEX IX_FileUploads_Category ON FileUploads(Category);
CREATE INDEX IX_FileUploads_UploadedBy ON FileUploads(UploadedBy);
CREATE INDEX IX_FileUploads_AssociatedType ON FileUploads(AssociatedType);
CREATE INDEX IX_FileUploads_UploadDate ON FileUploads(UploadDate);

-- =====================================================
-- 8. INSERT INITIAL DATA
-- =====================================================

-- Insert South African Provinces
INSERT INTO Provinces (Name, Code, Population) VALUES
('Gauteng', 'GP', 15176116),
('KwaZulu-Natal', 'KZN', 11289086),
('Eastern Cape', 'EC', 6712276),
('Limpopo', 'LP', 5982584),
('Western Cape', 'WC', 6844272),
('Mpumalanga', 'MP', 4592187),
('North West', 'NW', 4027160),
('Free State', 'FS', 2887465),
('Northern Cape', 'NC', 1292786);

-- Insert Districts for Gauteng
INSERT INTO Districts (Name, ProvinceId) VALUES
('Sedibeng', 1),
('Ekurhuleni', 1),
('City of Johannesburg', 1),
('City of Tshwane', 1),
('West Rand', 1);

-- Insert Districts for KwaZulu-Natal
INSERT INTO Districts (Name, ProvinceId) VALUES
('eThekwini', 2),
('uMgungundlovu', 2),
('uThukela', 2),
('Ugu', 2),
('Amajuba', 2);

-- Insert Districts for Western Cape
INSERT INTO Districts (Name, ProvinceId) VALUES
('City of Cape Town', 6),
('Cape Winelands', 6),
('Overberg', 6),
('West Coast', 6),
('Central Karoo', 6);

-- Insert some sample Health Facilities
INSERT INTO HealthFacilities (Name, Code, ProvinceId, Type, Level, Status) VALUES
('Chris Hani Baragwanath Hospital', 'CHBH', 1, 'Hospital', 'Tertiary', 'Active'),
('Charlotte Maxeke Hospital', 'CMH', 1, 'Hospital', 'Tertiary', 'Active'),
('Steve Biko Academic Hospital', 'SBAH', 1, 'Hospital', 'Tertiary', 'Active'),
('Groote Schuur Hospital', 'GSH', 6, 'Hospital', 'Tertiary', 'Active'),
('Tygerberg Hospital', 'TBH', 6, 'Hospital', 'Tertiary', 'Active'),
('Inkosi Albert Luthuli Hospital', 'IALCH', 2, 'Hospital', 'Tertiary', 'Active'),
('King Edward VIII Hospital', 'KEH', 2, 'Hospital', 'Secondary', 'Active');

-- Insert Equipment Categories for reference
INSERT INTO InventoryItems (ItemNumber, Description, Location, UOM, Category, QtyOnHand, UnitCostForQOH) VALUES
('NDOH35002', 'HEMOGLOBIN METER - BIO AID HB METER', 'KZN 1', 'Each', 'Hemoglobin Testing', 8406.00, 455.04),
('NDOH35003', 'HEMOGLOBIN TEST STRIPS', 'KZN 1', 'BOX', 'Hemoglobin Testing', 24442.00, 160.25),
('NDOH35004', 'GLUCOSE METER- BIO HERMES', 'KZN 1', 'Each', 'Glucose Testing', 7092.00, 157.01),
('NDOH35017', 'GLUCOSE TEST STRIPS', 'KZN 1', '50Pack', 'Glucose Testing', 2321.00, 51.57),
('NDOH35006', 'DUAL GLUCOSE & HBA1C METER- BIOHERMES', 'KZN 1', 'Each', 'HBA1C Testing', 1483.00, 2527.98),
('NDOH35034', 'HBA1C TEST STRIPS', 'KZN 1', '50Pack', 'HBA1C Testing', 1974.00, 2028.26);

-- =====================================================
-- 9. CREATE VIEWS FOR DASHBOARD STATISTICS
-- =====================================================

-- Training Statistics View
CREATE VIEW vw_TrainingStatistics AS
SELECT 
    COUNT(*) as TotalTrainingSessions,
    COUNT(DISTINCT TrainerId) as TotalTrainers,
    SUM(NumberOfParticipants) as TotalParticipants,
    CAST(
        (COUNT(CASE WHEN Status = 'Completed' THEN 1 END) * 100.0 / COUNT(*)) 
        AS DECIMAL(5,2)
    ) as CompletionRate
FROM TrainingSessions;

-- Province Training Statistics View
CREATE VIEW vw_ProvinceTrainingStats AS
SELECT 
    p.Name as Province,
    COUNT(ts.Id) as Sessions,
    SUM(ts.NumberOfParticipants) as Participants,
    COUNT(DISTINCT ts.TrainerId) as Trainers
FROM Provinces p
LEFT JOIN TrainingSessions ts ON p.Id = ts.ProvinceId
GROUP BY p.Id, p.Name;

-- Inventory Statistics View
CREATE VIEW vw_InventoryStatistics AS
SELECT 
    Category,
    COUNT(*) as TotalItems,
    SUM(QtyOnHand) as TotalQuantity,
    SUM(TotalCostForQOH) as TotalValue,
    COUNT(CASE WHEN Status = 'Low Stock' OR Status = 'Out of Stock' THEN 1 END) as LowStockItems
FROM InventoryItems
GROUP BY Category;

-- Sales Statistics View
CREATE VIEW vw_SalesStatistics AS
SELECT 
    p.Name as Province,
    COUNT(s.Id) as TotalSales,
    SUM(s.Total) as TotalRevenue,
    AVG(s.Total) as AverageOrderValue,
    COUNT(CASE WHEN s.PaymentStatus = 'Pending' THEN 1 END) as PendingOrders
FROM Provinces p
LEFT JOIN Sales s ON p.Id = s.ProvinceId
GROUP BY p.Id, p.Name;

-- =====================================================
-- 10. STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================

-- Procedure to update inventory stock
CREATE PROCEDURE sp_UpdateInventoryStock
    @ItemId INT,
    @QtyChange DECIMAL(18,2),
    @ChangeType NVARCHAR(10) -- 'ADD' or 'SUBTRACT'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF @ChangeType = 'ADD'
            UPDATE InventoryItems 
            SET QtyOnHand = QtyOnHand + @QtyChange,
                UpdatedAt = GETDATE()
            WHERE Id = @ItemId;
        ELSE IF @ChangeType = 'SUBTRACT'
            UPDATE InventoryItems 
            SET QtyOnHand = QtyOnHand - @QtyChange,
                UpdatedAt = GETDATE()
            WHERE Id = @ItemId AND QtyOnHand >= @QtyChange;
        
        -- Update status based on stock level
        UPDATE InventoryItems
        SET Status = CASE 
            WHEN QtyOnHand <= 0 THEN 'Out of Stock'
            WHEN QtyOnHand <= ReorderLevel THEN 'Low Stock'
            ELSE 'In Stock'
        END
        WHERE Id = @ItemId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

-- Procedure to calculate sale totals
CREATE PROCEDURE sp_CalculateSaleTotals
    @SaleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Subtotal DECIMAL(18,2);
    DECLARE @TaxRate DECIMAL(5,4) = 0.15; -- 15% VAT
    DECLARE @TaxAmount DECIMAL(18,2);
    DECLARE @Discount DECIMAL(18,2);
    DECLARE @Total DECIMAL(18,2);
    
    -- Calculate subtotal from sale items
    SELECT @Subtotal = SUM(TotalPrice)
    FROM SaleItems
    WHERE SaleId = @SaleId;
    
    -- Get current discount
    SELECT @Discount = ISNULL(Discount, 0)
    FROM Sales
    WHERE Id = @SaleId;
    
    -- Calculate tax and total
    SET @TaxAmount = (@Subtotal - @Discount) * @TaxRate;
    SET @Total = @Subtotal + @TaxAmount - @Discount;
    
    -- Update sale record
    UPDATE Sales
    SET Subtotal = @Subtotal,
        TaxAmount = @TaxAmount,
        Total = @Total,
        UpdatedAt = GETDATE()
    WHERE Id = @SaleId;
END;

-- =====================================================
-- 11. TRIGGERS FOR AUDIT TRAIL
-- =====================================================

-- Trigger to update timestamps
CREATE TRIGGER tr_UpdateTimestamp_Trainers
ON Trainers
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Trainers
    SET UpdatedAt = GETDATE()
    FROM Trainers t
    INNER JOIN inserted i ON t.Id = i.Id;
END;

CREATE TRIGGER tr_UpdateTimestamp_TrainingSessions
ON TrainingSessions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE TrainingSessions
    SET UpdatedAt = GETDATE()
    FROM TrainingSessions ts
    INNER JOIN inserted i ON ts.Id = i.Id;
END;

CREATE TRIGGER tr_UpdateTimestamp_InventoryItems
ON InventoryItems
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE InventoryItems
    SET UpdatedAt = GETDATE()
    FROM InventoryItems ii
    INNER JOIN inserted i ON ii.Id = i.Id;
END;

-- =====================================================
-- SCRIPT COMPLETION MESSAGE
-- =====================================================

PRINT 'NDCANGU Database Schema Created Successfully!';
PRINT '';
PRINT 'Created Tables:';
PRINT '✓ Provinces (9 South African provinces)';
PRINT '✓ Districts';
PRINT '✓ HealthFacilities (Hospitals and Clinics)';
PRINT '✓ Trainers';
PRINT '✓ TrainingSessions';
PRINT '✓ TrainingRegisters';
PRINT '✓ InventoryItems';
PRINT '✓ Products';
PRINT '✓ Sales';
PRINT '✓ SaleItems';
PRINT '✓ DeliveryRecords';
PRINT '✓ FileUploads';
PRINT '';
PRINT 'Created Views:';
PRINT '✓ vw_TrainingStatistics';
PRINT '✓ vw_ProvinceTrainingStats';
PRINT '✓ vw_InventoryStatistics';
PRINT '✓ vw_SalesStatistics';
PRINT '';
PRINT 'Created Stored Procedures:';
PRINT '✓ sp_UpdateInventoryStock';
PRINT '✓ sp_CalculateSaleTotals';
PRINT '';
PRINT 'Database is ready for NDCANGU application!';