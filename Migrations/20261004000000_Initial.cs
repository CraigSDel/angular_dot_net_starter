using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace my_new_app.Migrations;

public partial class Initial : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable("Users", table => new
        {
            UserId = table.Column<int>(nullable: false).Annotation("Sqlite:Autoincrement", true),
            FirstName = table.Column<string>(maxLength: 100, nullable: false),
            LastName = table.Column<string>(maxLength: 100, nullable: false)
        }, constraints: table => table.PrimaryKey("PK_Users", x => x.UserId));

        migrationBuilder.CreateTable("TaskGroups", table => new
        {
            TaskGroupId = table.Column<int>(nullable: false).Annotation("Sqlite:Autoincrement", true),
            Name = table.Column<string>(maxLength: 200, nullable: false)
        }, constraints: table => table.PrimaryKey("PK_TaskGroups", x => x.TaskGroupId));

        migrationBuilder.CreateTable("UserTasks", table => new
        {
            UserTaskId = table.Column<int>(nullable: false).Annotation("Sqlite:Autoincrement", true),
            Name = table.Column<string>(maxLength: 200, nullable: false),
            Deadline = table.Column<DateTime>(nullable: false),
            Status = table.Column<string>(maxLength: 50, nullable: false),
            UserId = table.Column<int>(nullable: false),
            TaskGroupId = table.Column<int>(nullable: true)
        }, constraints: table =>
        {
            table.PrimaryKey("PK_UserTasks", x => x.UserTaskId);
            table.ForeignKey("FK_UserTasks_Users_UserId", x => x.UserId, "Users", "UserId", onDelete: ReferentialAction.Restrict);
            table.ForeignKey("FK_UserTasks_TaskGroups_TaskGroupId", x => x.TaskGroupId, "TaskGroups", "TaskGroupId", onDelete: ReferentialAction.SetNull);
        });

        migrationBuilder.CreateIndex("IX_UserTasks_UserId", "UserTasks", "UserId");
        migrationBuilder.CreateIndex("IX_UserTasks_TaskGroupId", "UserTasks", "TaskGroupId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable("UserTasks");
        migrationBuilder.DropTable("TaskGroups");
        migrationBuilder.DropTable("Users");
    }
}
