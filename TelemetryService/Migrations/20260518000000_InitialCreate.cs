using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelemetryService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // TelemetryService owns SensorDevice and TelemetryRecord.
            // All FK constraints are enforced within this single database.

            migrationBuilder.CreateTable(
                name: "SensorDevice",
                columns: table => new
                {
                    SensorID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeviceType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AssignedTo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AssignedEntityId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false,
                        defaultValue: "Active")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorDevice", x => x.SensorID);
                });

            migrationBuilder.CreateTable(
                name: "TelemetryRecord",
                columns: table => new
                {
                    TelemetryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SensorID = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Temperature = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Humidity = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsExcursion = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ExcursionNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TelemetryRecord", x => x.TelemetryID);
                    table.ForeignKey(
                        name: "FK_TelemetryRecord_SensorDevice",
                        column: x => x.SensorID,
                        principalTable: "SensorDevice",
                        principalColumn: "SensorID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TelemetryRecord_SensorID",
                table: "TelemetryRecord",
                column: "SensorID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "TelemetryRecord");
            migrationBuilder.DropTable(name: "SensorDevice");
        }
    }
}
