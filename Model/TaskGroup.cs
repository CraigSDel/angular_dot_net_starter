﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Model
{
    public class TaskGroup
    {
        public int id { get; set; }
        public string name { get; set; }
        public UserTask[] userTasks { get; set; }
    }

    public class TaskGroupDBContext : DbContext
    {
        public DbSet<TaskGroup> TaskGroups { get; set; }
    }
}
