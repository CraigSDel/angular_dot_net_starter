using System.ComponentModel.DataAnnotations;

namespace my_new_app.Contracts;

public sealed record UserDto(int Id, string FirstName, string LastName);
public sealed record UserTaskDto(int Id, string Name, DateTime Deadline, string Status, int UserId, int? TaskGroupId);
public sealed record TaskGroupDto(int Id, string Name, IReadOnlyList<UserTaskDto> Tasks);

public class CreateUserRequest
{
    [Required, StringLength(100)] public string FirstName { get; init; } = string.Empty;
    [Required, StringLength(100)] public string LastName { get; init; } = string.Empty;
}
public sealed class UpdateUserRequest : CreateUserRequest { }

public class UserTaskRequest
{
    [Required, StringLength(200)] public string Name { get; init; } = string.Empty;
    public DateTime Deadline { get; init; }
    [Required, RegularExpression("^(To-Do|In-Progress|Done)$")] public string Status { get; init; } = string.Empty;
    [Range(1, int.MaxValue)] public int UserId { get; init; }
    public int? TaskGroupId { get; init; }
}
public sealed class CreateUserTaskRequest : UserTaskRequest { }
public sealed class UpdateUserTaskRequest : UserTaskRequest { }

public class CreateTaskGroupRequest
{
    [Required, StringLength(200)] public string Name { get; init; } = string.Empty;
    public IReadOnlyList<int> TaskIds { get; init; } = [];
}
public sealed class UpdateTaskGroupRequest : CreateTaskGroupRequest { }
