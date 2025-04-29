using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VulnerabilityManager.Migrations
{
    /// <inheritdoc />
    public partial class FixContramedidaValidation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataImplementacao",
                table: "Contramedidas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataImplementacao",
                table: "Contramedidas",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
