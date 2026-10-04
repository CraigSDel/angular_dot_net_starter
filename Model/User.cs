using System.ComponentModel.DataAnnotations;

namespace my_new_app.Model;

public sealed class User
{
    [Key] public int UserId { get; set; }
    [Required, MaxLength(100)] public string FirstName { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string LastName { get; set; } = string.Empty;
    public ICollection<UserTask> UserTasks { get; set; } = new List<UserTask>();
}
