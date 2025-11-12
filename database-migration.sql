-- Database Migration Script to Add Missing Columns
-- Add CreatedBy and UpdatedBy columns to Trainer table

USE [YourDatabaseName] -- Replace with your actual database name
GO

-- Add CreatedBy column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Trainers]') AND name = 'CreatedBy')
BEGIN
    ALTER TABLE [dbo].[Trainers] 
    ADD [CreatedBy] NVARCHAR(100) NULL
END

-- Add UpdatedBy column if it doesn't exist  
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Trainers]') AND name = 'UpdatedBy')
BEGIN
    ALTER TABLE [dbo].[Trainers] 
    ADD [UpdatedBy] NVARCHAR(100) NULL
END

-- Optionally set default values for existing records
UPDATE [dbo].[Trainers] 
SET [CreatedBy] = 'System', [UpdatedBy] = 'System' 
WHERE [CreatedBy] IS NULL OR [UpdatedBy] IS NULL

-- Add default constraints (optional)
IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_Trainers_CreatedBy')
BEGIN
    ALTER TABLE [dbo].[Trainers] 
    ADD CONSTRAINT DF_Trainers_CreatedBy DEFAULT 'System' FOR [CreatedBy]
END

IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_Trainers_UpdatedBy')
BEGIN
    ALTER TABLE [dbo].[Trainers] 
    ADD CONSTRAINT DF_Trainers_UpdatedBy DEFAULT 'System' FOR [UpdatedBy]
END

PRINT 'Migration completed successfully'
GO