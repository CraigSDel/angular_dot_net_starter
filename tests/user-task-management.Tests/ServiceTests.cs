using Microsoft.EntityFrameworkCore;
using my_new_app.Model;
using my_new_app.Service;

namespace UserTaskManagement.Tests;

public sealed class ServiceTests
{
    [Fact]
    public async Task UserService_saves_and_reads_users()
    {
        var options = new DbContextOptionsBuilder<UserDataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        using var context = new UserDataContext(options);
        var service = new UserServiceImpl(context);

        var saved = await service.CreateAsync(new my_new_app.Contracts.CreateUserRequest { FirstName = "Grace", LastName = "Hopper" }, CancellationToken.None);

        Assert.True(saved.Id > 0);
        Assert.Single(await service.GetAllAsync(CancellationToken.None));
        Assert.Equal("Grace", (await service.GetAsync(saved.Id, CancellationToken.None))!.FirstName);
    }
}
