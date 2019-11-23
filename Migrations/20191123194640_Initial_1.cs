using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace my_new_app.Migrations
{
    public partial class Initial_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskGroups",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskGroups", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "UserTasks",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(nullable: true),
                    deadline = table.Column<DateTime>(nullable: false),
                    userid = table.Column<int>(nullable: true),
                    status = table.Column<string>(nullable: true),
                    TaskGroupid = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTasks", x => x.id);
                    table.ForeignKey(
                        name: "FK_UserTasks_TaskGroups_TaskGroupid",
                        column: x => x.TaskGroupid,
                        principalTable: "TaskGroups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserTasks_Users_userid",
                        column: x => x.userid,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserTasks_TaskGroupid",
                table: "UserTasks",
                column: "TaskGroupid");

            migrationBuilder.CreateIndex(
                name: "IX_UserTasks_userid",
                table: "UserTasks",
                column: "userid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTasks");

            migrationBuilder.DropTable(
                name: "TaskGroups");
        }
    }
}
