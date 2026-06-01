# MediPulse — Database Seed Scripts

Pure T-SQL seed scripts that populate the **already-created** EF Core tables with
realistic, FK-consistent data. **No application code is touched.**

## Files

| File                                       | Database         | Purpose                                                              |
|--------------------------------------------|------------------|----------------------------------------------------------------------|
| `00_MedipulseAudit_Seed.sql`               | `MedipulseAudit` | Seeds `AuditLog` (12 rows)                                           |
| `01_MedipulseMain_Seed.sql`                | `MedipulseMain`  | Seeds all 18 operational tables across the 7 main services (FK-safe) |
| `02_LogisticsService_CreateTables.sql`     | `MedipulseMain`  | **Creates** the 3 missing Logistics tables (see note below)          |

All scripts are **idempotent** — table blocks are wrapped in `IF NOT EXISTS` /
`IF OBJECT_ID(...) IS NULL` guards, so re-running them is a no-op.

### ⚠️ LogisticsService missing-tables fix

The only migration in `LogisticsService/Migrations` (`CleanupSchema`) is a
`DROP COLUMN`-only migration that assumes the three Logistics tables already
exist. Against a fresh DB, `dotnet ef database update` succeeds but no tables
are created. `02_LogisticsService_CreateTables.sql` creates exactly the schema
described by `LogisticsDbContextModelSnapshot.cs` (TransferOrder,
TransferOrderItem, ConsumptionRecord — including FK + index). **Run this once
after `dotnet ef database update` and before the seed scripts.**

## How to run

### Option A — SQL Server Management Studio / Azure Data Studio
1. Connect to `LTIN702291\SQLEXPRESS`
2. Open `02_LogisticsService_CreateTables.sql`, ensure DB is `MedipulseMain`, **Execute**
3. Open `01_MedipulseMain_Seed.sql`, ensure DB is `MedipulseMain`, **Execute**
4. Open `00_MedipulseAudit_Seed.sql`, ensure DB is `MedipulseAudit`, **Execute**

### Option B — sqlcmd (from a Developer PowerShell)
```powershell
sqlcmd -S "LTIN702291\SQLEXPRESS" -d MedipulseMain  -E -i .\02_LogisticsService_CreateTables.sql
sqlcmd -S "LTIN702291\SQLEXPRESS" -d MedipulseMain  -E -i .\01_MedipulseMain_Seed.sql
sqlcmd -S "LTIN702291\SQLEXPRESS" -d MedipulseAudit -E -i .\00_MedipulseAudit_Seed.sql
```

Each script ends with a row-count verification `SELECT` you can inspect.

## What gets seeded

### `MedipulseMain` (in FK-safe order)

| # | Table                | Rows | Notes                                                          |
|---|----------------------|------|----------------------------------------------------------------|
| 1 | `User`               | 6    | Admin, Compliance, Inventory, Facility, Procurement, Logistics |
| 2 | `Supplier`           | 4    | Manufacturer / Distributor / 3PL / OnHold                      |
| 3 | `Facility`           | 4    | Warehouse + 2 Hospitals + Pharmacy                             |
| 4 | `StorageZone`        | 6    | Ambient / Refrigerated / Freezer mix                           |
| 5 | `Items`              | 8    | Pharma + Device + Consumable                                   |
| 6 | `InventoryPositions` | 10   | Includes intentional low-stock & expiring lots                 |
| 7 | `PurchaseOrder`      | 4    | Spans the full status lifecycle                                |
| 8 | `Receipt`            | 4    | One `OnHold` to exercise quality-hold flow                     |
| 9 | `SensorDevice`       | 6    | Temp / Humidity / GPS, Zone & Shipment assignments             |
|10 | `TelemetryRecord`    | 10   | Includes 2 excursions (temp + humidity)                        |
|11 | `TransferOrder`      | 3    | `InTransit` / `Approved` / `Submitted`                         |
|12 | `TransferOrderItem`  | 5    | Line items for the transfers above                             |
|13 | `ConsumptionRecord`  | 7    | Drives the read-only `ConsumptionSummary` in Inventory         |
|14 | `ExceptionEvent`     | 4    | Stockout, ExpiryAlert, Excursion, Recall (one of each)         |
|15 | `RecallAction`       | 4    | Each linked to an exception above                              |
|16 | `Forecast`           | 7    | Period `2026-06` for the seeded items                          |
|17 | `ReplenishmentPlan`  | 5    | High / Medium / Low priority mix                               |
|18 | `Notification`       | 7    | One per category, mix of read/unread                           |

### `MedipulseAudit`
- `AuditLog` — 12 rows covering Auth, Procurement, Inventory, Logistics, Audit
  itself, with realistic HTTP method / endpoint / entity / status combos.

## Cross-service ID consistency

These IDs are referenced across services. They are stable across both scripts:

| Concept     | IDs used   |
|-------------|------------|
| User        | 1–6 (audit `UserId` references these)                |
| Facility    | 1–4 (used by Inventory, Logistics, Telemetry)        |
| StorageZone | 1–6 (used by Inventory positions, Telemetry sensors) |
| Item        | 1–8 (used by Inventory, Logistics line items, Forecast, Replenishment) |
| Supplier    | 1–4                                                  |

## ⚠️ Login note — `User.Password`

The `Password` column stores a **BCrypt** hash. The seed inserts a deterministic
**placeholder hash** (`$2a$11$PLACEHOLDER...`), which **will not validate** against
any plaintext password. This is intentional — we don't ship usable credentials in
a SQL file.

To make `/api/auth/login` work for the seeded users, pick one:

### Easiest — register one user via the API, copy the hash
1. Start `AuthService`.
2. `POST http://localhost:<auth-port>/api/auth/register` with any password (e.g. `Password@123`).
3. Query the new row's `Password` value:
   ```sql
   SELECT TOP 1 Password FROM dbo.[User] ORDER BY UserID DESC;
   ```
4. Push that hash onto all placeholder rows:
   ```sql
   UPDATE dbo.[User]
   SET    Password = '<paste hash here>'
   WHERE  Password = '$2a$11$PLACEHOLDER..............................................';
   ```
   Now all six seed users share that password.

### Alternative — generate a BCrypt hash in C#
In any project that already references `BCrypt.Net-Next`:
```csharp
Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("Password@123", 11));
```
Then run the same `UPDATE` above with the generated hash.

## Re-seeding from scratch

If you want a clean reseed, truncate in **reverse FK order**, then re-run the scripts:

```sql
USE MedipulseMain;
DELETE FROM dbo.Notification;
DELETE FROM dbo.ReplenishmentPlan;
DELETE FROM dbo.Forecast;
DELETE FROM dbo.RecallAction;
DELETE FROM dbo.ExceptionEvent;
DELETE FROM dbo.ConsumptionRecord;
DELETE FROM dbo.TransferOrderItem;
DELETE FROM dbo.TransferOrder;
DELETE FROM dbo.TelemetryRecord;
DELETE FROM dbo.SensorDevice;
DELETE FROM dbo.Receipt;
DELETE FROM dbo.PurchaseOrder;
DELETE FROM dbo.InventoryPositions;
DELETE FROM dbo.Items;
DELETE FROM dbo.StorageZone;
DELETE FROM dbo.Facility;
DELETE FROM dbo.Supplier;
DELETE FROM dbo.[User];

-- and for the audit DB
USE MedipulseAudit;
DELETE FROM dbo.AuditLog;
```

(Use `DELETE` rather than `TRUNCATE` because some tables have FK references and
because the seed re-asserts identity values explicitly via `SET IDENTITY_INSERT`.)
