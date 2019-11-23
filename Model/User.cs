using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app
{
    public class User
    {
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
    }

    public class UserDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
    }
}
