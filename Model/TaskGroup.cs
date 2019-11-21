using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Model
{
    public class TaskGroup
    {
        public string name { get; set; }
        public UserTask[] userTasks { get; set; }
    }
}
