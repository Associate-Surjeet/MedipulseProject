/* ============================================================================
   MediPulse — Seed script for MedipulseMain database
   ----------------------------------------------------------------------------
   Target server  : LTIN702291\SQLEXPRESS
   Target database: MedipulseMain
   Source of truth: EF Core models / DbContexts under MediPulseMicro/<Service>
   Idempotent     : Each table block runs only if the table is empty
                    (uses IF NOT EXISTS (SELECT 1 FROM <table>))
   FK-safe order  : User → Supplier → Facility → StorageZone → Item
                    → InventoryPosition → PurchaseOrder → Receipt
                    → SensorDevice → TelemetryRecord
                    → TransferOrder → TransferOrderItem
                    → ConsumptionRecord → ExceptionEvent → RecallAction
                    → Forecast → ReplenishmentPlan → Notification
   ----------------------------------------------------------------------------
   USAGE
     1. Open SSMS / Azure Data Studio and connect to MedipulseMain
     2. Run this entire script
     3. (Optional) Run 00_MedipulseAudit_Seed.sql against MedipulseAudit
   ----------------------------------------------------------------------------
   IMPORTANT — User.Password column
     The Password column stores a BCrypt hash. The hash below is a PLACEHOLDER.
     To make /api/auth/login work for these seed users, do one of:
       (a) Call POST /api/auth/register once with a known password, then
           UPDATE [User] SET Password = '<that-row's-hash>'
           WHERE Password = '$2a$11$PLACEHOLDER..............................................';
       (b) Run this tiny C# one-liner to generate a BCrypt hash:
             dotnet tool install -g bcrypt.net.tool  (if available)
           or in any project that already references BCrypt.Net-Next:
             BCrypt.Net.BCrypt.HashPassword("Password@123", 11)
     Username for testing once a real hash is in place: admin@medipulse.com
   ============================================================================ */

USE MedipulseMain;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* ─────────────────────────────────────────────────────────────────────────────
   1) User   (AuthService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.[User])
BEGIN
    SET IDENTITY_INSERT dbo.[User] ON;

    INSERT INTO dbo.[User] (UserID, Name, Role, Email, Phone, Password) VALUES
      (1, N'System Administrator', N'Admin',                N'admin@medipulse.com',           N'+91-9000000001', N'$2a$11$PLACEHOLDER..............................................'),
      (2, N'Priya Sharma',         N'ComplianceOfficer',    N'priya.sharma@medipulse.com',    N'+91-9000000002', N'$2a$11$PLACEHOLDER..............................................'),
      (3, N'Rajesh Kumar',         N'InventoryManager',     N'rajesh.kumar@medipulse.com',    N'+91-9000000003', N'$2a$11$PLACEHOLDER..............................................'),
      (4, N'Anita Verma',          N'FacilityManager',      N'anita.verma@medipulse.com',     N'+91-9000000004', N'$2a$11$PLACEHOLDER..............................................'),
      (5, N'Suresh Patel',         N'ProcurementManager',   N'suresh.patel@medipulse.com',    N'+91-9000000005', N'$2a$11$PLACEHOLDER..............................................'),
      (6, N'Meera Iyer',           N'LogisticsCoordinator', N'meera.iyer@medipulse.com',      N'+91-9000000006', N'$2a$11$PLACEHOLDER..............................................');

    SET IDENTITY_INSERT dbo.[User] OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   2) Supplier   (ProcurementService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Supplier)
BEGIN
    SET IDENTITY_INSERT dbo.Supplier ON;

    INSERT INTO dbo.Supplier (SupplierID, Name, SupplierType, Status) VALUES
      (1, N'SunPharma Manufacturers',  N'Manufacturer', N'Active'),
      (2, N'MediDistribute Pvt Ltd',   N'Distributor',  N'Active'),
      (3, N'ColdChain 3PL Logistics',  N'3PL',          N'Active'),
      (4, N'Biocon Biologics',         N'Manufacturer', N'OnHold');

    SET IDENTITY_INSERT dbo.Supplier OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   3) Facility   (FacilityService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Facility)
BEGIN
    SET IDENTITY_INSERT dbo.Facility ON;

    INSERT INTO dbo.Facility (FacilityID, Name, Type, Region) VALUES
      (1, N'Apollo Central Warehouse',    N'Warehouse', N'South'),
      (2, N'Apollo Hospital Mumbai',      N'Hospital',  N'West'),
      (3, N'Apollo Pharmacy Bangalore',   N'Pharmacy',  N'South'),
      (4, N'Apollo Hospital Delhi',       N'Hospital',  N'North');

    SET IDENTITY_INSERT dbo.Facility OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   4) StorageZone   (FacilityService)   — FK: FacilityID
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.StorageZone)
BEGIN
    SET IDENTITY_INSERT dbo.StorageZone ON;

    INSERT INTO dbo.StorageZone (ZoneID, FacilityID, Name, TemperatureProfile, Capacity) VALUES
      (1, 1, N'Ambient Storage A1',         N'Ambient',      10000.00),
      (2, 1, N'Cold Storage C1',            N'Refrigerated',  5000.00),
      (3, 1, N'Freezer F1',                 N'Freezer',       2000.00),
      (4, 2, N'Hospital Pharmacy Storage',  N'Refrigerated',  1500.00),
      (5, 3, N'Pharmacy Counter Storage',   N'Ambient',        500.00),
      (6, 4, N'ICU Cold Storage',           N'Refrigerated',   800.00);

    SET IDENTITY_INSERT dbo.StorageZone OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   5) Item   (InventoryService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Items)
BEGIN
    SET IDENTITY_INSERT dbo.Items ON;

    INSERT INTO dbo.Items (ItemId, ItemCode, Name, Category, Unit, StorageRequirement, SafetyStock) VALUES
      (1, N'MED-001', N'Paracetamol 500mg',        N'Pharma',     N'Box',   N'Ambient',      200),
      (2, N'MED-002', N'Amoxicillin 250mg',        N'Pharma',     N'Box',   N'Ambient',      150),
      (3, N'MED-003', N'Insulin Glargine 100IU',   N'Pharma',     N'Vial',  N'Refrigerated', 100),
      (4, N'VAC-001', N'COVID-19 Vaccine',         N'Pharma',     N'Vial',  N'Freezer',      500),
      (5, N'VAC-002', N'Hepatitis B Vaccine',      N'Pharma',     N'Vial',  N'Refrigerated', 300),
      (6, N'DEV-001', N'Digital Thermometer',      N'Device',     N'Piece', N'Ambient',       50),
      (7, N'CON-001', N'Sterile Surgical Gloves M',N'Consumable', N'Box',   N'Ambient',      100),
      (8, N'CON-002', N'Disposable Syringes 5ml',  N'Consumable', N'Box',   N'Ambient',      150);

    SET IDENTITY_INSERT dbo.Items OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   6) InventoryPosition   (InventoryService)   — FK: ItemId
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.InventoryPositions)
BEGIN
    SET IDENTITY_INSERT dbo.InventoryPositions ON;

    INSERT INTO dbo.InventoryPositions
      (PositionId, ItemId, LotId, ExpiryDate, Quantity, FacilityId, StorageZoneId, SafetyStock) VALUES
      ( 1, 1, N'PCM-2025-A01', '2027-06-30', 350, 1, 1, 200),
      ( 2, 1, N'PCM-2025-A02', '2027-12-31', 180, 2, 4, 100),
      ( 3, 2, N'AMX-2026-B01', '2026-09-15',  80, 2, 4, 150),   -- below safety stock
      ( 4, 3, N'INS-2026-X01', '2026-12-31', 120, 1, 2, 100),
      ( 5, 4, N'COV-2026-V01', '2026-08-15', 600, 1, 3, 500),
      ( 6, 5, N'HEP-2026-V02', '2026-11-30', 350, 4, 6, 200),
      ( 7, 6, N'THM-2025-D01', '2030-01-01',  75, 3, 5,  50),
      ( 8, 7, N'GLV-2026-C01', '2028-06-30', 200, 1, 1, 100),
      ( 9, 8, N'SYR-2026-C02', '2029-12-31', 140, 2, 4, 150),   -- below safety stock
      (10, 2, N'AMX-2026-B02', '2026-07-01',  50, 1, 1, 100);   -- expiring soon

    SET IDENTITY_INSERT dbo.InventoryPositions OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   7) PurchaseOrder   (ProcurementService)   — FK: SupplierID
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.PurchaseOrder)
BEGIN
    SET IDENTITY_INSERT dbo.PurchaseOrder ON;

    INSERT INTO dbo.PurchaseOrder (POID, SupplierID, OrderDate, ExpectedDeliveryDate, Status, Notes) VALUES
      (1, 1, '2026-03-15T09:00:00', '2026-04-15T17:00:00', N'FullyReceived', N'Bulk paracetamol order for Q1'),
      (2, 2, '2026-04-20T10:30:00', '2026-05-20T17:00:00', N'Shipped',       N'Insulin & antibiotics replenishment'),
      (3, 1, '2026-05-10T11:00:00', '2026-06-10T17:00:00', N'Approved',      N'Vaccine stockpiling Q2'),
      (4, 3, '2026-05-25T14:15:00', '2026-06-25T17:00:00', N'Submitted',     N'Cold-chain 3PL transport batch');

    SET IDENTITY_INSERT dbo.PurchaseOrder OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   8) Receipt   (ProcurementService)   — FK: POID
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Receipt)
BEGIN
    SET IDENTITY_INSERT dbo.Receipt ON;

    INSERT INTO dbo.Receipt (ReceiptID, POID, SupplierLot, ReceivedDate, ReceivedBy, QualityStatus, QuantityReceived) VALUES
      (1, 1, N'PCM-2025-A01', '2026-04-14T10:00:00', N'Rajesh Kumar', N'Accepted', 350),
      (2, 1, N'PCM-2025-A02', '2026-04-15T11:30:00', N'Rajesh Kumar', N'Accepted', 200),
      (3, 2, N'INS-2026-X01', '2026-05-18T09:45:00', N'Anita Verma',  N'Accepted', 120),
      (4, 2, N'AMX-2026-B01', '2026-05-19T15:20:00', N'Anita Verma',  N'OnHold',   100);

    SET IDENTITY_INSERT dbo.Receipt OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   9) SensorDevice   (TelemetryService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.SensorDevice)
BEGIN
    SET IDENTITY_INSERT dbo.SensorDevice ON;

    INSERT INTO dbo.SensorDevice (SensorID, DeviceType, AssignedTo, AssignedEntityId, Status) VALUES
      (1, N'Temp',     N'Zone',     2,    N'Active'),   -- Cold Storage C1
      (2, N'Temp',     N'Zone',     3,    N'Active'),   -- Freezer F1
      (3, N'Humidity', N'Zone',     2,    N'Active'),
      (4, N'Temp',     N'Zone',     6,    N'Active'),   -- ICU Cold Storage
      (5, N'GPS',      N'Shipment', 1,    N'Active'),   -- TransferOrder 1
      (6, N'Temp',     N'Shipment', 1,    N'Inactive');

    SET IDENTITY_INSERT dbo.SensorDevice OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   10) TelemetryRecord   (TelemetryService)   — FK: SensorID
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.TelemetryRecord)
BEGIN
    SET IDENTITY_INSERT dbo.TelemetryRecord ON;

    INSERT INTO dbo.TelemetryRecord (TelemetryID, SensorID, Timestamp, Temperature, Humidity, Location, IsExcursion) VALUES
      ( 1, 1, '2026-05-31T06:00:00',   4.50, NULL,  NULL,                0),
      ( 2, 1, '2026-05-31T07:00:00',   4.20, NULL,  NULL,                0),
      ( 3, 1, '2026-05-31T08:30:00',   8.50, NULL,  NULL,                1),   -- excursion
      ( 4, 2, '2026-05-31T06:00:00', -20.10, NULL,  NULL,                0),
      ( 5, 2, '2026-05-31T07:00:00', -19.50, NULL,  NULL,                0),
      ( 6, 3, '2026-05-31T07:00:00',   NULL, 55.00, NULL,                0),
      ( 7, 3, '2026-05-31T08:00:00',   NULL, 85.00, NULL,                1),   -- excursion
      ( 8, 4, '2026-05-31T07:15:00',   5.20, NULL,  NULL,                0),
      ( 9, 5, '2026-05-31T07:30:00',   NULL, NULL,  N'13.0827,80.2707',  0),
      (10, 5, '2026-05-31T08:00:00',   NULL, NULL,  N'13.0900,80.2750',  0);

    SET IDENTITY_INSERT dbo.TelemetryRecord OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   11) TransferOrder   (LogisticsService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.TransferOrder)
BEGIN
    SET IDENTITY_INSERT dbo.TransferOrder ON;

    INSERT INTO dbo.TransferOrder
      (TransferOrderId, FromFacilityId, FromFacilityName, ToFacilityId, ToFacilityName, RequestedBy, RequestedDate, Status) VALUES
      (1, 1, N'Apollo Central Warehouse', 2, N'Apollo Hospital Mumbai',     N'Meera Iyer',  '2026-05-25T10:00:00', N'InTransit'),
      (2, 1, N'Apollo Central Warehouse', 4, N'Apollo Hospital Delhi',      N'Meera Iyer',  '2026-05-28T11:30:00', N'Approved'),
      (3, 2, N'Apollo Hospital Mumbai',   3, N'Apollo Pharmacy Bangalore',  N'Anita Verma', '2026-05-30T14:00:00', N'Submitted');

    SET IDENTITY_INSERT dbo.TransferOrder OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   12) TransferOrderItem   (LogisticsService)   — FK: TransferOrderId
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.TransferOrderItem)
BEGIN
    SET IDENTITY_INSERT dbo.TransferOrderItem ON;

    INSERT INTO dbo.TransferOrderItem (TransferOrderItemId, TransferOrderId, ItemId, ItemName, Quantity) VALUES
      (1, 1, 1, N'Paracetamol 500mg',         100),
      (2, 1, 7, N'Sterile Surgical Gloves M',  50),
      (3, 2, 3, N'Insulin Glargine 100IU',     30),
      (4, 2, 5, N'Hepatitis B Vaccine',       100),
      (5, 3, 6, N'Digital Thermometer',        10);

    SET IDENTITY_INSERT dbo.TransferOrderItem OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   13) ConsumptionRecord   (LogisticsService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.ConsumptionRecord)
BEGIN
    SET IDENTITY_INSERT dbo.ConsumptionRecord ON;

    INSERT INTO dbo.ConsumptionRecord
      (ConsumptionId, FacilityId, WardId, ItemId, ItemName, QuantityConsumed, ConsumedDate, ConsumedBy) VALUES
      (1, 2, 101,  1, N'Paracetamol 500mg',          20, '2026-05-26T10:15:00', N'Dr. Mehta'),
      (2, 2, 102,  2, N'Amoxicillin 250mg',          15, '2026-05-27T11:20:00', N'Dr. Patel'),
      (3, 4, 201,  3, N'Insulin Glargine 100IU',     10, '2026-05-28T09:00:00', N'Dr. Singh'),
      (4, 2, NULL, 7, N'Sterile Surgical Gloves M',   8, '2026-05-29T14:30:00', N'Nurse Anita'),
      (5, 3, NULL, 8, N'Disposable Syringes 5ml',    12, '2026-05-30T16:45:00', N'Pharmacy Tech'),
      (6, 2, 101,  1, N'Paracetamol 500mg',          25, '2026-05-30T18:00:00', N'Dr. Mehta'),
      (7, 4, 202,  5, N'Hepatitis B Vaccine',         5, '2026-05-31T08:30:00', N'Nurse Lakshmi');

    SET IDENTITY_INSERT dbo.ConsumptionRecord OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   14) ExceptionEvent   (InventoryService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.ExceptionEvent)
BEGIN
    SET IDENTITY_INSERT dbo.ExceptionEvent ON;

    INSERT INTO dbo.ExceptionEvent
      (ExceptionId, Type, ReferenceType, ReferenceId, ItemId, ItemName, FacilityId, LotId, Severity, Status, DetectedDate) VALUES
      (1, N'Stockout',    N'InventoryPosition',  3, 2, N'Amoxicillin 250mg',      2, N'AMX-2026-B01', N'High',   N'Open',       '2026-05-30T09:00:00'),
      (2, N'ExpiryAlert', N'InventoryPosition', 10, 2, N'Amoxicillin 250mg',      1, N'AMX-2026-B02', N'Medium', N'InProgress', '2026-05-28T12:00:00'),
      (3, N'Excursion',   N'Telemetry',          3, 3, N'Insulin Glargine 100IU', 1, N'INS-2026-X01', N'High',   N'Open',       '2026-05-31T08:35:00'),
      (4, N'Recall',      N'InventoryPosition',  5, 4, N'COVID-19 Vaccine',       1, N'COV-2026-V01', N'High',   N'InProgress', '2026-05-29T15:00:00');

    SET IDENTITY_INSERT dbo.ExceptionEvent OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   15) RecallAction   (InventoryService)   — FK: ExceptionId
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.RecallAction)
BEGIN
    SET IDENTITY_INSERT dbo.RecallAction ON;

    INSERT INTO dbo.RecallAction
      (RecallActionId, ExceptionId, OwnerId, ActionDescription, DueDate, Status) VALUES
      (1, 1, N'3', N'Initiate emergency purchase order for Amoxicillin from SunPharma',     '2026-06-03T17:00:00', N'InProgress'),
      (2, 2, N'2', N'Quarantine expiring lot AMX-2026-B02 and dispatch to nearest pharmacy','2026-06-05T17:00:00', N'Pending'),
      (3, 3, N'4', N'Validate cold-chain integrity; relocate insulin lot to backup freezer','2026-06-01T17:00:00', N'InProgress'),
      (4, 4, N'2', N'Quarantine recalled COVID-19 lot and notify health ministry',          '2026-06-02T17:00:00', N'Pending');

    SET IDENTITY_INSERT dbo.RecallAction OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   16) Forecast   (InventoryService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Forecast)
BEGIN
    SET IDENTITY_INSERT dbo.Forecast ON;

    INSERT INTO dbo.Forecast (ForecastId, ItemId, FacilityId, Period, ForecastQuantity, GeneratedDate) VALUES
      (1, 1, 2, N'2026-06', 320, '2026-05-31T00:00:00'),
      (2, 2, 2, N'2026-06', 180, '2026-05-31T00:00:00'),
      (3, 3, 4, N'2026-06', 140, '2026-05-31T00:00:00'),
      (4, 4, 1, N'2026-06', 550, '2026-05-31T00:00:00'),
      (5, 7, 2, N'2026-06', 110, '2026-05-31T00:00:00'),
      (6, 5, 4, N'2026-06', 220, '2026-05-31T00:00:00'),
      (7, 8, 3, N'2026-06',  90, '2026-05-31T00:00:00');

    SET IDENTITY_INSERT dbo.Forecast OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   17) ReplenishmentPlan   (InventoryService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.ReplenishmentPlan)
BEGIN
    SET IDENTITY_INSERT dbo.ReplenishmentPlan ON;

    INSERT INTO dbo.ReplenishmentPlan
      (PlanId, ItemId, FacilityId, SuggestedOrderQty, Priority, Status, GeneratedDate) VALUES
      (1, 2, 2, 200, N'High',   N'Pending', '2026-05-30T09:00:00'),
      (2, 8, 2,  50, N'Medium', N'Pending', '2026-05-30T09:00:00'),
      (3, 3, 4,  80, N'Medium', N'Ordered', '2026-05-29T09:00:00'),
      (4, 4, 1, 200, N'High',   N'Pending', '2026-05-31T09:00:00'),
      (5, 5, 4, 150, N'Low',    N'Pending', '2026-05-31T09:00:00');

    SET IDENTITY_INSERT dbo.ReplenishmentPlan OFF;
END
GO

/* ─────────────────────────────────────────────────────────────────────────────
   18) Notification   (NotificationService)
   ───────────────────────────────────────────────────────────────────────────── */
IF NOT EXISTS (SELECT 1 FROM dbo.Notification)
BEGIN
    SET IDENTITY_INSERT dbo.Notification ON;

    INSERT INTO dbo.Notification (NotificationId, UserId, Category, Title, Message, IsRead, CreatedAt) VALUES
      (1, N'3', N'Exception',     N'Stockout Alert',            N'Amoxicillin 250mg is below safety stock at Apollo Hospital Mumbai', 0, '2026-05-30T09:05:00'),
      (2, N'2', N'Expiry',        N'Lot Expiring Soon',         N'Lot AMX-2026-B02 expires on 2026-07-01 at Apollo Central Warehouse',0, '2026-05-28T12:10:00'),
      (3, N'4', N'Exception',     N'Temperature Excursion',     N'Sensor 1 reported 8.50°C in Cold Storage C1 — outside safe range',  0, '2026-05-31T08:36:00'),
      (4, N'5', N'Receipt',       N'Receipt Quality Hold',      N'Receipt #4 from MediDistribute requires quality review',            1, '2026-05-19T15:30:00'),
      (5, N'3', N'Replenishment', N'Replenishment Plan Created',N'5 new replenishment plans are pending approval',                    0, '2026-05-31T09:10:00'),
      (6, N'2', N'Exception',     N'Recall Issued',             N'COVID-19 Vaccine lot COV-2026-V01 has been recalled',               0, '2026-05-29T15:05:00'),
      (7, N'6', N'Exception',     N'Transfer In Transit',       N'Transfer Order #1 is now in transit to Apollo Hospital Mumbai',     1, '2026-05-25T10:30:00');

    SET IDENTITY_INSERT dbo.Notification OFF;
END
GO

COMMIT TRANSACTION;
GO

/* ============================================================================
   Verification queries — run after the seed to confirm row counts
   ============================================================================ */
SELECT 'User'                AS TableName, COUNT(*) AS Rows FROM dbo.[User]
UNION ALL SELECT 'Supplier',            COUNT(*) FROM dbo.Supplier
UNION ALL SELECT 'Facility',            COUNT(*) FROM dbo.Facility
UNION ALL SELECT 'StorageZone',         COUNT(*) FROM dbo.StorageZone
UNION ALL SELECT 'Items',               COUNT(*) FROM dbo.Items
UNION ALL SELECT 'InventoryPositions',  COUNT(*) FROM dbo.InventoryPositions
UNION ALL SELECT 'PurchaseOrder',       COUNT(*) FROM dbo.PurchaseOrder
UNION ALL SELECT 'Receipt',             COUNT(*) FROM dbo.Receipt
UNION ALL SELECT 'SensorDevice',        COUNT(*) FROM dbo.SensorDevice
UNION ALL SELECT 'TelemetryRecord',     COUNT(*) FROM dbo.TelemetryRecord
UNION ALL SELECT 'TransferOrder',       COUNT(*) FROM dbo.TransferOrder
UNION ALL SELECT 'TransferOrderItem',   COUNT(*) FROM dbo.TransferOrderItem
UNION ALL SELECT 'ConsumptionRecord',   COUNT(*) FROM dbo.ConsumptionRecord
UNION ALL SELECT 'ExceptionEvent',      COUNT(*) FROM dbo.ExceptionEvent
UNION ALL SELECT 'RecallAction',        COUNT(*) FROM dbo.RecallAction
UNION ALL SELECT 'Forecast',            COUNT(*) FROM dbo.Forecast
UNION ALL SELECT 'ReplenishmentPlan',   COUNT(*) FROM dbo.ReplenishmentPlan
UNION ALL SELECT 'Notification',        COUNT(*) FROM dbo.Notification
ORDER BY TableName;
GO
