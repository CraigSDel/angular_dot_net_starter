using System.Net;
using System.Net.Http.Json;
using my_new_app.Contracts;

namespace UserTaskManagement.Tests;

public sealed class ApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient client;
    public ApiTests(CustomWebApplicationFactory factory) => client = factory.CreateClient();

    [Fact]
    public async Task Health_endpoint_is_available()
    {
        var response = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task User_crud_uses_rest_status_codes()
    {
        var create = await client.PostAsJsonAsync("/api/v1/users", new CreateUserRequest { FirstName = "Ada", LastName = "Lovelace" });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var user = await create.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(user);

        var update = await client.PutAsJsonAsync($"/api/v1/users/{user!.Id}", new UpdateUserRequest { FirstName = "Grace", LastName = "Hopper" });
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync($"/api/v1/users/{user.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/v1/users/{user.Id}")).StatusCode);
    }

    [Fact]
    public async Task Invalid_task_reference_returns_bad_request()
    {
        var response = await client.PostAsJsonAsync("/api/v1/tasks", new CreateUserTaskRequest
        {
            Name = "Invalid", Status = "To-Do", Deadline = DateTime.UtcNow, UserId = int.MaxValue
        });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Assigned_user_and_group_cannot_be_deleted()
    {
        var userResponse = await client.PostAsJsonAsync("/api/v1/users", new CreateUserRequest { FirstName = "Delete", LastName = "Guard" });
        var user = await userResponse.Content.ReadFromJsonAsync<UserDto>();
        Assert.NotNull(user);

        var taskResponse = await client.PostAsJsonAsync("/api/v1/tasks", new CreateUserTaskRequest
        {
            Name = "Protected task", Status = "To-Do", Deadline = DateTime.UtcNow, UserId = user!.Id
        });
        var task = await taskResponse.Content.ReadFromJsonAsync<UserTaskDto>();
        Assert.NotNull(task);
        Assert.Equal(HttpStatusCode.Conflict, (await client.DeleteAsync($"/api/v1/users/{user.Id}")).StatusCode);

        var groupResponse = await client.PostAsJsonAsync("/api/v1/task-groups", new CreateTaskGroupRequest
        {
            Name = "Protected group", TaskIds = [task!.Id]
        });
        var group = await groupResponse.Content.ReadFromJsonAsync<TaskGroupDto>();
        Assert.NotNull(group);
        Assert.Equal(HttpStatusCode.Conflict, (await client.DeleteAsync($"/api/v1/task-groups/{group!.Id}")).StatusCode);
    }
}
