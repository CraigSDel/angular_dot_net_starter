using my_new_app.Contracts;
using my_new_app.Model;

namespace my_new_app.Service;

internal static class ApiMapper
{
    public static UserTaskDto ToDto(UserTask task) =>
        new(task.UserTaskId, task.Name, task.Deadline, task.Status, task.UserId, task.TaskGroupId);
}
