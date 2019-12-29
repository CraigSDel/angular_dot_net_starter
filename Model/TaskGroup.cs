using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Model
{
    public class TaskGroup
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual List<UserTask> UserTasks { get; set; }
    }
}
