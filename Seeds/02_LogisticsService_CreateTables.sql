/* ============================================================================
   MediPulse — LogisticsService: create missing tables
   ----------------------------------------------------------------------------
   Target server  : LTIN702291\SQLEXPRESS
   Target database: MedipulseMain
   ----------------------------------------------------------------------------
   WHY THIS SCRIPT EXISTS
     The only migration in LogisticsService/Migrations (CleanupSchema) does
     nothing but ALTER TABLE ... DROP COLUMN on tables it assumes already
     exist. There is no InitialCreate migration. Against a fresh database the
     three Logistics tables (TransferOrder, TransferOrderItem,
     ConsumptionRecord) are never created — `dotnet ef database update`
     succeeds but the schema is empty.

   WHAT THIS SCRIPT DOES
     Creates exactly the three tables the LogisticsDbContextModelSnapshot
     describes, including the FK + index. All guarded by
     IF OBJECT_ID(...) IS NULL, so re-running is a no-op.

   RELATIONSHIPS  (mirror of EF model)
     TransferOrder (1) ──< TransferOrderItem (many)   [cascade delete,
                                                       FK_TransferOrderItem_TransferOrder]
     ConsumptionRecord  — standalone

   USAGE
     Run this BEFORE 01_MedipulseMain_Seed.sql. Order:
       1. dotnet ef database update      (each service)
       2. 02_LogisticsService_CreateTables.sql   <-- this file
       3. 01_MedipulseMain_Seed.sql
       4. 00_MedipulseAudit_Seed.sql
   ============================================================================ */

USE MedipulseMain;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* ─────────────────────────────────────────────────────────────────────────────
   1) TransferOrder
   ───────────────────────────────────────────────────────────────────────────── */
IF OBJECT_ID(N'dbo.TransferOrder', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.TransferOrder
    (
        TransferOrderId   INT             IDENTITY(1,1) NOT NULL,
        FromFacilityId    INT             NOT NULL,
        FromFacilityName  NVARCHAR(100)   NOT NULL,
        ToFacilityId      INT             NOT NULL,
        ToFacilityName    NVARCHAR(100)   NOT NULL,
        RequestedBy       NVARCHAR(100)   NOT NULL,
        RequestedDate     DATETIME2       NOT NULL,
        Status            NVARCHAR(50)    NOT NULL CONSTRAINT DF_TransferOrder_Status DEFAULT (N'Draft'),
        CONSTRAINT PK_TransferOrder PRIMARY KEY CLUSTERED (TransferOrderId)
    );
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   2) TransferOrderItem   (FK → TransferOrder, cascade delete)
   ───────────────────────────────────────────────────────────────────────────── */
IF OBJECT_ID(N'dbo.TransferOrderItem', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.TransferOrderItem
    (
        TransferOrderItemId  INT            IDENTITY(1,1) NOT NULL,
        TransferOrderId      INT            NOT NULL,
        ItemId               INT            NOT NULL,
        ItemName             NVARCHAR(150)  NOT NULL,
        Quantity             INT            NOT NULL,
        CONSTRAINT PK_TransferOrderItem PRIMARY KEY CLUSTERED (TransferOrderItemId),
        CONSTRAINT FK_TransferOrderItem_TransferOrder
            FOREIGN KEY (TransferOrderId)
            REFERENCES dbo.TransferOrder (TransferOrderId)
            ON DELETE CASCADE
    );

    CREATE INDEX IX_TransferOrderItem_TransferOrderId
        ON dbo.TransferOrderItem (TransferOrderId);
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   3) ConsumptionRecord
   ───────────────────────────────────────────────────────────────────────────── */
IF OBJECT_ID(N'dbo.ConsumptionRecord', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ConsumptionRecord
    (
        ConsumptionId     INT             IDENTITY(1,1) NOT NULL,
        FacilityId        INT             NOT NULL,
        WardId            INT             NULL,
        ItemId            INT             NOT NULL,
        ItemName          NVARCHAR(150)   NOT NULL,
        QuantityConsumed  INT             NOT NULL,
        ConsumedDate      DATETIME2       NOT NULL,
        ConsumedBy        NVARCHAR(100)   NOT NULL,
        CONSTRAINT PK_ConsumptionRecord PRIMARY KEY CLUSTERED (ConsumptionId)
    );
END
GO

COMMIT TRANSACTION;
GO

/* ─────────────────────────────────────────────────────────────────────────────
   Verification
   ───────────────────────────────────────────────────────────────────────────── */
SELECT t.name AS TableName,
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id) AS ColumnCount
FROM   sys.tables t
WHERE  t.name IN (N'TransferOrder', N'TransferOrderItem', N'ConsumptionRecord')
ORDER BY t.name;
GO
