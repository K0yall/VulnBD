using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VulnerabilityManager.Migrations
{
    /// <inheritdoc />
    public partial class FixModelDefinitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GeneratedDate",
                table: "Relatorios",
                newName: "DataGeracao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DataGeracao",
                table: "Relatorios",
                newName: "GeneratedDate");
        }
    }
}
