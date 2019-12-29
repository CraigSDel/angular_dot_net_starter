using Microsoft.EntityFrameworkCore;

namespace my_new_app.Model
{
    public class UserDataContext : DbContext
    {

        public UserDataContext(DbContextOptions<UserDataContext> options)
         : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserTask>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId);      
        }

        public DbSet<User> Users { get; set; }

        public DbSet<UserTask> UserTasks { get; set; }

        public DbSet<TaskGroup> TaskGroups { get; set; }
    }
}
