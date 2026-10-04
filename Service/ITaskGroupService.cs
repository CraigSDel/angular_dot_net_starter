using my_new_app.Contracts;

namespace my_new_app.Service;

public interface ITaskGroupService
{
    Task<IReadOnlyList<TaskGroupDto>> GetAllAsync(string? sort, CancellationToken cancellationToken);
    Task<TaskGroupDto?> GetAsync(int id, CancellationToken cancellationToken);
    Task<TaskGroupDto> CreateAsync(CreateTaskGroupRequest request, CancellationToken cancellationToken);
    Task<TaskGroupDto?> UpdateAsync(int id, UpdateTaskGroupRequest request, CancellationToken cancellationToken);
    Task<DeleteResult> DeleteAsync(int id, CancellationToken cancellationToken);
}
