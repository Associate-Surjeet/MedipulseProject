using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LogisticsService.Migrations
{
    /// <inheritdoc />
    public partial class CleanupSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── TransferOrder: drop zone-related and extra columns ─────────────
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrder','FromZoneId') IS NOT NULL ALTER TABLE [TransferOrder] DROP COLUMN [FromZoneId]");
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrder','FromZoneName') IS NOT NULL ALTER TABLE [TransferOrder] DROP COLUMN [FromZoneName]");
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrder','ToZoneId') IS NOT NULL ALTER TABLE [TransferOrder] DROP COLUMN [ToZoneId]");
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrder','ToZoneName') IS NOT NULL ALTER TABLE [TransferOrder] DROP COLUMN [ToZoneName]");
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrder','ExpectedDate') IS NOT NULL ALTER TABLE [TransferOrder] DROP COLUMN [ExpectedDate]");
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrder','Notes') IS NOT NULL ALTER TABLE [TransferOrder] DROP COLUMN [Notes]");

            // ── TransferOrderItem: drop Unit ──────────────────────────────────
            migrationBuilder.Sql("IF COL_LENGTH('TransferOrderItem','Unit') IS NOT NULL ALTER TABLE [TransferOrderItem] DROP COLUMN [Unit]");

            // ── ConsumptionRecord: drop zone/facility name and extra columns ───
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','FacilityName') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [FacilityName]");
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','WardName') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [WardName]");
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','ZoneId') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [ZoneId]");
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','ZoneName') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [ZoneName]");
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','Unit') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [Unit]");
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','Purpose') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [Purpose]");
            migrationBuilder.Sql("IF COL_LENGTH('ConsumptionRecord','Notes') IS NOT NULL ALTER TABLE [ConsumptionRecord] DROP COLUMN [Notes]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Restore removed TransferOrder columns
            migrationBuilder.AddColumn<int>(
                name: "FromZoneId",
                table: "TransferOrder",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FromZoneName",
                table: "TransferOrder",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ToZoneId",
                table: "TransferOrder",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ToZoneName",
                table: "TransferOrder",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpectedDate",
                table: "TransferOrder",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "TransferOrder",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            // Restore removed TransferOrderItem columns
            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "TransferOrderItem",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            // Restore removed ConsumptionRecord columns
            migrationBuilder.AddColumn<string>(
                name: "FacilityName",
                table: "ConsumptionRecord",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WardName",
                table: "ConsumptionRecord",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "ConsumptionRecord",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoneName",
                table: "ConsumptionRecord",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "ConsumptionRecord",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Purpose",
                table: "ConsumptionRecord",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "ConsumptionRecord",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }
    }
}
