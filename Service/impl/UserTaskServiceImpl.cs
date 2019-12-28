using Microsoft.Extensions.Logging;
using my_new_app.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Service
{
    public class UserTaskServiceImpl : IUserTaskService
    {

        private readonly ILogger<UserTaskServiceImpl> _logger;

        private UserDataContext _context;

        public UserTaskServiceImpl() { }

        public UserTaskServiceImpl(ILogger<UserTaskServiceImpl> logger, UserDataContext context)
        {
            _logger = logger;
            _context = context;
        }

        public Boolean Delete(UserTask userTask)
        {
            _context.UserTasks.Remove(userTask);
            _context.SaveChanges();
            _logger.LogInformation("Delete Task Group " + userTask.id + " " + userTask.name);
            return true;
        }

        public UserTask Get(int id)
        {
            var taskGroup = from u in _context.UserTasks where u.id == id select u;
            if (taskGroup.Count() == 1)
            {
                return taskGroup.First();
            }
            return null;
        }

        public List<UserTask> GetAll()
        {
            return _context.UserTasks.ToList();
        }


        public UserTask Save(UserTask userTask)
        {
            _context.UserTasks.Add(userTask);
            _context.SaveChanges();
            _logger.LogInformation("Saved Task Group " + userTask.id + " " + userTask.name);
            return userTask;
        }
    }
}

