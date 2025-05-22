using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Itinera.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentCity",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InterestsRaw",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TravelStyle",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentCity",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "InterestsRaw",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TravelStyle",
                table: "Users");
        }
    }
}
