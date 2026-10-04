using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using my_new_app.Model;

namespace UserTaskManagement.Tests;

public sealed class DatabaseFixture : IDisposable
{
    public SqliteConnection Connection { get; } = new("Data Source=:memory:");

    public DatabaseFixture()
    {
        Connection.Open();
    }

    public void Dispose() => Connection.Dispose();
}

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly DatabaseFixture database = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                service => service.ServiceType == typeof(DbContextOptions<UserDataContext>));
            if (descriptor is not null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<UserDataContext>(options => options.UseSqlite(database.Connection));
        });
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            database.Dispose();
        }

        base.Dispose(disposing);
    }
}
