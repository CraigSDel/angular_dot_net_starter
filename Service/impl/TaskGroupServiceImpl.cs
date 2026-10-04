using Microsoft.EntityFrameworkCore;
using my_new_app.Contracts;
using my_new_app.Model;

namespace my_new_app.Service;

public sealed class TaskGroupServiceImpl(UserDataContext context) : ITaskGroupService
{
    private static UserTaskDto MapTask(UserTask task) => new(task.UserTaskId, task.Name, task.Deadline, task.Status, task.UserId, task.TaskGroupId);
    private static TaskGroupDto Map(TaskGroup group) => new(group.TaskGroupId, group.Name, group.UserTasks.OrderBy(task => task.Deadline).Select(MapTask).ToList());

    public async Task<IReadOnlyList<TaskGroupDto>> GetAllAsync(string? sort, CancellationToken cancellationToken)
    {
        var groups = context.TaskGroups.AsNoTracking().Include(group => group.UserTasks).AsQueryable();
        groups = sort?.ToLowerInvariant() switch
        {
            "name" => groups.OrderBy(group => group.Name),
            "taskcount" => groups.OrderByDescending(group => group.UserTasks.Count),
            _ => groups.OrderBy(group => group.TaskGroupId)
        };
        var entities = await groups.ToListAsync(cancellationToken);
        return entities.Select(Map).ToList();
    }

    public async Task<TaskGroupDto?> GetAsync(int id, CancellationToken cancellationToken)
    {
        var group = await context.TaskGroups.AsNoTracking().Include(item => item.UserTasks)
            .SingleOrDefaultAsync(item => item.TaskGroupId == id, cancellationToken);
        return group is null ? null : Map(group);
    }

    public async Task<TaskGroupDto> CreateAsync(CreateTaskGroupRequest request, CancellationToken cancellationToken)
    {
        var group = new TaskGroup { Name = request.Name.Trim() };
        context.TaskGroups.Add(group);
        await context.SaveChangesAsync(cancellationToken);
        await SetTasksAsync(group, request.TaskIds, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return Map(group);
    }

    public async Task<TaskGroupDto?> UpdateAsync(int id, UpdateTaskGroupRequest request, CancellationToken cancellationToken)
    {
        var group = await context.TaskGroups.Include(item => item.UserTasks).SingleOrDefaultAsync(item => item.TaskGroupId == id, cancellationToken);
        if (group is null) return null;
        group.Name = request.Name.Trim();
        await SetTasksAsync(group, request.TaskIds, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return Map(group);
    }

    public async Task<DeleteResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var group = await context.TaskGroups.Include(item => item.UserTasks).SingleOrDefaultAsync(item => item.TaskGroupId == id, cancellationToken);
        if (group is null) return DeleteResult.NotFound;
        if (group.UserTasks.Count != 0) return DeleteResult.Conflict;
        context.TaskGroups.Remove(group);
        await context.SaveChangesAsync(cancellationToken);
        return DeleteResult.Deleted;
    }

    private async Task SetTasksAsync(TaskGroup group, IReadOnlyList<int> taskIds, CancellationToken cancellationToken)
    {
        var distinctIds = taskIds.Distinct().ToArray();
        var tasks = await context.UserTasks.Where(task => distinctIds.Contains(task.UserTaskId)).ToListAsync(cancellationToken);
        if (tasks.Count != distinctIds.Length) throw new ArgumentException("One or more TaskIds do not exist.");
        foreach (var task in group.UserTasks) task.TaskGroupId = null;
        group.UserTasks.Clear();
        foreach (var task in tasks) { task.TaskGroupId = group.TaskGroupId == 0 ? null : group.TaskGroupId; group.UserTasks.Add(task); }
    }
}
