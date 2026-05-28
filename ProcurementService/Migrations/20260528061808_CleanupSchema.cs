using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProcurementService.Migrations
{
    /// <inheritdoc />
    public partial class CleanupSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Receipt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Receipt",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }
    }
}
