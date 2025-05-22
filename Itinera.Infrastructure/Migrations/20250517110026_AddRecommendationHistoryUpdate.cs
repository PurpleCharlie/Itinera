using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Itinera.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRecommendationHistoryUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Days",
                table: "RecommendationHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Style",
                table: "RecommendationHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Days",
                table: "RecommendationHistories");

            migrationBuilder.DropColumn(
                name: "Style",
                table: "RecommendationHistories");
        }
    }
}
