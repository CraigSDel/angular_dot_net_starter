using my_new_app.Contracts;

namespace my_new_app.Service;

public interface IUserTaskService
{
    Task<IReadOnlyList<UserTaskDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<UserTaskDto?> GetAsync(int id, CancellationToken cancellationToken);
    Task<UserTaskDto> CreateAsync(CreateUserTaskRequest request, CancellationToken cancellationToken);
    Task<UserTaskDto?> UpdateAsync(int id, UpdateUserTaskRequest request, CancellationToken cancellationToken);
    Task<DeleteResult> DeleteAsync(int id, CancellationToken cancellationToken);
}
