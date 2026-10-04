using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.SpaServices.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using my_new_app.Controllers;
using my_new_app.Model;
using my_new_app.Service;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=blog.db";

builder.Services.AddDbContext<UserDataContext>(options => options.UseSqlite(connectionString));
builder.Services.AddScoped<IUserService, UserServiceImpl>();
builder.Services.AddScoped<IUserTaskService, UserTaskServiceImpl>();
builder.Services.AddScoped<ITaskGroupService, TaskGroupServiceImpl>();
builder.Services.AddControllers(options => options.Filters.Add<ApiExceptionFilter>());
builder.Services.AddHealthChecks();
builder.Services.AddSpaStaticFiles(options => options.RootPath = "ClientApp/dist");

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<UserDataContext>();
    var database = context.Database;
    if (app.Environment.IsEnvironment("Testing"))
    {
        database.EnsureCreated();
    }
    else
    {
        if (database.GetMigrations().Any())
        {
            BaselineLegacySqliteDatabase(context);
            database.Migrate();
        }
        else
        {
            database.EnsureCreated();
        }
    }
}
if (app.Environment.IsDevelopment()) app.UseDeveloperExceptionPage();
else { app.UseExceptionHandler("/Error"); app.UseHsts(); }
if (!app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing")) app.UseHttpsRedirection();
app.UseStaticFiles();
if (!app.Environment.IsDevelopment()) app.UseSpaStaticFiles();
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapHealthChecks("/health");
    endpoints.MapControllers();
});
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (app.Environment.IsDevelopment())
    {
        var spaUrl = Environment.GetEnvironmentVariable("SPA_URL") ?? "http://127.0.0.1:4200";
        spa.UseProxyToSpaDevelopmentServer(spaUrl);
    }
});
app.Run();

static void BaselineLegacySqliteDatabase(UserDataContext context)
{
    const string legacyMigration = "20191231074358_Initial";
    const string productVersion = "10.0.12";
    var currentMigration = context.Database.GetMigrations().LastOrDefault();
    if (currentMigration is null || context.Database.ProviderName != "Microsoft.EntityFrameworkCore.Sqlite") return;

    var appliedMigrations = context.Database.GetAppliedMigrations().ToHashSet(StringComparer.OrdinalIgnoreCase);
    if (!appliedMigrations.Contains(legacyMigration) || appliedMigrations.Contains(currentMigration)) return;

    var connection = context.Database.GetDbConnection();
    var shouldBaseline = false;
    if (connection.State != System.Data.ConnectionState.Open) connection.Open();
    using (var command = connection.CreateCommand())
    {
        command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name IN ('Users', 'UserTasks', 'TaskGroups')";
        shouldBaseline = Convert.ToInt32(command.ExecuteScalar()) == 3;
    }

    if (shouldBaseline)
    {
        context.Database.ExecuteSqlInterpolated($"INSERT INTO \"__EFMigrationsHistory\" (\"MigrationId\", \"ProductVersion\") VALUES ({currentMigration}, {productVersion})");
    }
}

public partial class Program { }
