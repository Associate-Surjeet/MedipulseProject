using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelemetryService.Migrations
{
    /// <inheritdoc />
    public partial class CleanupSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExcursionNote",
                table: "TelemetryRecord");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExcursionNote",
                table: "TelemetryRecord",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }
    }
}
