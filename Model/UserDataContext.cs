using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Model
{
    public class UserDataContext : DbContext
    {

        public UserDataContext(DbContextOptions<UserDataContext> options)
         : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(b => b.UserTask)
                .WithOne(i => i.User)
                .HasForeignKey<UserTask>(b => b.UserForeignKey);
        }

        public DbSet<User> Users { get; set; }

        public DbSet<UserTask> UserTasks { get; set; }

        public DbSet<TaskGroup> TaskGroups { get; set; }
    }
}
