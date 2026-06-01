/* ============================================================================
   MediPulse — Seed script for MedipulseAudit database
   ----------------------------------------------------------------------------
   Target server  : LTIN702291\SQLEXPRESS
   Target database: MedipulseAudit   (separate from MedipulseMain by design)
   Owned by       : AuditService
   Single table   : dbo.AuditLog
   Idempotent     : runs only if AuditLog is empty
   ----------------------------------------------------------------------------
   USAGE
     Open SSMS / Azure Data Studio, connect to MedipulseAudit, and run.
   ============================================================================ */

USE MedipulseAudit;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF NOT EXISTS (SELECT 1 FROM dbo.AuditLog)
BEGIN
    SET IDENTITY_INSERT dbo.AuditLog ON;

    INSERT INTO dbo.AuditLog
      (AuditLogId, UserId, UserName, UserRole, HttpMethod, Endpoint, EntityType, EntityId, StatusCode, ServiceName, Timestamp, Details) VALUES
      ( 1, N'1', N'System Administrator', N'Admin',                N'POST', N'/api/auth/login',                  NULL,                NULL,  200, N'AuthService',         '2026-05-30T08:00:00', N'Admin login from 10.0.0.5'),
      ( 2, N'5', N'Suresh Patel',         N'ProcurementManager',   N'POST', N'/api/purchase-orders',             N'PurchaseOrder',    N'3',  201, N'ProcurementService',  '2026-05-10T11:05:00', N'PO #3 created for SunPharma'),
      ( 3, N'3', N'Rajesh Kumar',         N'InventoryManager',     N'PUT',  N'/api/inventory/positions/3',       N'InventoryPosition',N'3',  200, N'InventoryService',    '2026-05-30T09:10:00', N'Adjusted quantity from 95 to 80'),
      ( 4, N'4', N'Anita Verma',          N'FacilityManager',      N'POST', N'/api/receipts',                    N'Receipt',          N'4',  201, N'ProcurementService',  '2026-05-19T15:20:00', N'GRN created against PO #2 — Quality OnHold'),
      ( 5, N'6', N'Meera Iyer',           N'LogisticsCoordinator', N'POST', N'/api/transfer-orders',             N'TransferOrder',    N'1',  201, N'LogisticsService',    '2026-05-25T10:00:00', N'Transfer order created Warehouse→Mumbai'),
      ( 6, N'6', N'Meera Iyer',           N'LogisticsCoordinator', N'PATCH',N'/api/transfer-orders/1/status',    N'TransferOrder',    N'1',  200, N'LogisticsService',    '2026-05-25T10:15:00', N'Status changed Approved → InTransit'),
      ( 7, N'2', N'Priya Sharma',         N'ComplianceOfficer',    N'GET',  N'/api/audit',                       NULL,                NULL,  200, N'AuditService',        '2026-05-31T07:55:00', N'Compliance review query'),
      ( 8, N'3', N'Rajesh Kumar',         N'InventoryManager',     N'POST', N'/api/exceptions',                  N'ExceptionEvent',   N'1',  201, N'InventoryService',    '2026-05-30T09:00:00', N'Stockout detected for Amoxicillin at Mumbai'),
      ( 9, N'4', N'Anita Verma',          N'FacilityManager',      N'POST', N'/api/recall-actions',              N'RecallAction',     N'3',  201, N'InventoryService',    '2026-05-31T08:40:00', N'Insulin excursion → relocate to backup freezer'),
      (10, N'1', N'System Administrator', N'Admin',                N'POST', N'/api/users',                       N'User',             N'6',  201, N'AuthService',         '2026-05-15T10:00:00', N'Created logistics coordinator account'),
      (11, N'5', N'Suresh Patel',         N'ProcurementManager',   N'PATCH',N'/api/purchase-orders/2/status',    N'PurchaseOrder',    N'2',  200, N'ProcurementService',  '2026-05-18T16:00:00', N'Status changed Approved → Shipped'),
      (12, N'2', N'Priya Sharma',         N'ComplianceOfficer',    N'GET',  N'/api/audit?serviceName=TelemetryService', NULL,         NULL,  200, N'AuditService',        '2026-05-31T08:50:00', N'Excursion incident audit trail review');

    SET IDENTITY_INSERT dbo.AuditLog OFF;
END
GO

COMMIT TRANSACTION;
GO

SELECT 'AuditLog' AS TableName, COUNT(*) AS Rows FROM dbo.AuditLog;
GO
