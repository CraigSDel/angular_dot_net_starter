using System.ComponentModel.DataAnnotations;

namespace my_new_app.Model;

public sealed class UserTask
{
    [Key] public int UserTaskId { get; set; }
    [Required, MaxLength(200)] public string Name { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    [Required, MaxLength(50)] public string Status { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int? TaskGroupId { get; set; }
    public TaskGroup? TaskGroup { get; set; }
}
