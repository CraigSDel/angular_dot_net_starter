using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace my_new_app.Model
{
    public class TaskGroup
    {
        [Key]
        public int? TaskGroupId { get; set; }
        public string Name { get; set; }

        public virtual List<UserTask>? UserTasks { get; set; }
    }
}
