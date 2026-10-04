using System.ComponentModel.DataAnnotations;

namespace my_new_app.Model;

public sealed class TaskGroup
{
    [Key] public int TaskGroupId { get; set; }
    [Required, MaxLength(200)] public string Name { get; set; } = string.Empty;
    public ICollection<UserTask> UserTasks { get; set; } = new List<UserTask>();
}
