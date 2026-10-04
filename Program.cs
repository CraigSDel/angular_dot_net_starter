using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.SpaServices.Extensions;
using Microsoft.EntityFrameworkCore;
using my_new_app.Model;
using my_new_app.Service;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=blog.db";

builder.Services.AddDbContext<UserDataContext>(options => options.UseSqlite(connectionString));
builder.Services.AddScoped<IUserService, UserServiceImpl>();
builder.Services.AddScoped<IUserTaskService, UserTaskServiceImpl>();
builder.Services.AddScoped<ITaskGroupService, TaskGroupServiceImpl>();
builder.Services.AddControllers();
builder.Services.AddHealthChecks();
builder.Services.AddSpaStaticFiles(options => options.RootPath = "ClientApp/dist");

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var database = scope.ServiceProvider.GetRequiredService<UserDataContext>().Database;
    if (app.Environment.IsEnvironment("Testing")) database.EnsureCreated();
    else database.Migrate();
}
if (app.Environment.IsDevelopment()) app.UseDeveloperExceptionPage();
else { app.UseExceptionHandler("/Error"); app.UseHsts(); }
if (!app.Environment.IsEnvironment("Testing")) app.UseHttpsRedirection();
app.UseStaticFiles();
if (!app.Environment.IsDevelopment()) app.UseSpaStaticFiles();
app.UseRouting();
app.MapHealthChecks("/health");
app.MapControllers();
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (app.Environment.IsDevelopment()) spa.UseAngularCliServer(npmScript: "start");
});
app.Run();

public partial class Program { }
