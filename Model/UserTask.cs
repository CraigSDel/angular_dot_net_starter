using System;
using System.ComponentModel.DataAnnotations;

namespace my_new_app.Model
{
    public class UserTask
    {
        [Key]
        public int? UserTaskId { get; set; }
        public string Name { get; set; }
        public DateTime Deadline { get; set; }
        public string Status { get; set; }

        public int? UserId { get; set; }
        public virtual User User { get; set; }
    }
}
