using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Model
{
    public class UserTask
    {
        public string name { get; set; }
        public DateTime deadline { get; set; }
        public User user { get; set; }
        public string status { get; set; }
    }
}
