using Microsoft.EntityFrameworkCore;

namespace my_new_app.Model;

public sealed class UserDataContext(DbContextOptions<UserDataContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<UserTask> UserTasks => Set<UserTask>();
    public DbSet<TaskGroup> TaskGroups => Set<TaskGroup>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserTask>().HasOne(task => task.User).WithMany(user => user.UserTasks)
            .HasForeignKey(task => task.UserId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<UserTask>().HasOne(task => task.TaskGroup).WithMany(group => group.UserTasks)
            .HasForeignKey(task => task.TaskGroupId).OnDelete(DeleteBehavior.SetNull);
    }
}
