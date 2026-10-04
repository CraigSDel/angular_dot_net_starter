using Microsoft.EntityFrameworkCore;
using my_new_app.Contracts;
using my_new_app.Model;

namespace my_new_app.Service;

public sealed class UserTaskServiceImpl(UserDataContext context) : IUserTaskService
{
    private static UserTaskDto Map(UserTask task) => new(task.UserTaskId, task.Name, task.Deadline, task.Status, task.UserId, task.TaskGroupId);

    public async Task<IReadOnlyList<UserTaskDto>> GetAllAsync(CancellationToken cancellationToken) =>
        await context.UserTasks.AsNoTracking().OrderBy(task => task.Deadline).Select(task => new UserTaskDto(task.UserTaskId, task.Name, task.Deadline, task.Status, task.UserId, task.TaskGroupId)).ToListAsync(cancellationToken);

    public async Task<UserTaskDto?> GetAsync(int id, CancellationToken cancellationToken) =>
        await context.UserTasks.AsNoTracking().Where(task => task.UserTaskId == id).Select(task => new UserTaskDto(task.UserTaskId, task.Name, task.Deadline, task.Status, task.UserId, task.TaskGroupId)).SingleOrDefaultAsync(cancellationToken);

    public async Task<UserTaskDto> CreateAsync(CreateUserTaskRequest request, CancellationToken cancellationToken)
    {
        await EnsureReferencesAsync(request.UserId, request.TaskGroupId, cancellationToken);
        var task = new UserTask { Name = request.Name.Trim(), Deadline = request.Deadline, Status = request.Status.Trim(), UserId = request.UserId, TaskGroupId = request.TaskGroupId };
        context.UserTasks.Add(task);
        await context.SaveChangesAsync(cancellationToken);
        return Map(task);
    }

    public async Task<UserTaskDto?> UpdateAsync(int id, UpdateUserTaskRequest request, CancellationToken cancellationToken)
    {
        var task = await context.UserTasks.SingleOrDefaultAsync(item => item.UserTaskId == id, cancellationToken);
        if (task is null) return null;
        await EnsureReferencesAsync(request.UserId, request.TaskGroupId, cancellationToken);
        task.Name = request.Name.Trim(); task.Deadline = request.Deadline; task.Status = request.Status.Trim();
        task.UserId = request.UserId; task.TaskGroupId = request.TaskGroupId;
        await context.SaveChangesAsync(cancellationToken);
        return Map(task);
    }

    public async Task<DeleteResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var task = await context.UserTasks.SingleOrDefaultAsync(item => item.UserTaskId == id, cancellationToken);
        if (task is null) return DeleteResult.NotFound;
        context.UserTasks.Remove(task);
        await context.SaveChangesAsync(cancellationToken);
        return DeleteResult.Deleted;
    }

    private async Task EnsureReferencesAsync(int userId, int? taskGroupId, CancellationToken cancellationToken)
    {
        if (!await context.Users.AnyAsync(user => user.UserId == userId, cancellationToken)) throw new ArgumentException("UserId does not exist.");
        if (taskGroupId.HasValue && !await context.TaskGroups.AnyAsync(group => group.TaskGroupId == taskGroupId, cancellationToken)) throw new ArgumentException("TaskGroupId does not exist.");
    }
}
