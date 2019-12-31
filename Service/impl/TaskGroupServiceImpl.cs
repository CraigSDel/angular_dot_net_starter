using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using my_new_app.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace my_new_app.Service
{
    public class TaskGroupServiceImpl : ITaskGroupService
    {

        private readonly ILogger<TaskGroupServiceImpl> _logger;

        private UserDataContext _context;

        public TaskGroupServiceImpl() { }

        public TaskGroupServiceImpl(ILogger<TaskGroupServiceImpl> logger, UserDataContext context)
        {
            _logger = logger;
            _context = context;
        }

        public Boolean Delete(TaskGroup taskGroup)
        {
            _context.TaskGroups.Remove(taskGroup);
            _context.SaveChanges();
            _logger.LogInformation("Delete Task Group " + taskGroup.TaskGroupId + " " + taskGroup.Name);
            return true;
        }

        public TaskGroup Get(int id)
        {
            var taskGroup = from u in _context.TaskGroups where u.TaskGroupId == id select u;
            if (taskGroup.Count() == 1)
            {
                return taskGroup.First();
            }
            return null;
        }

        public List<TaskGroup> GetAll()
        {
            List<TaskGroup> taskGroups = _context.TaskGroups
                .Include( userTask => userTask.UserTasks)
                .ToList();
            return taskGroups;
        }


        public TaskGroup Save(TaskGroup taskGroup)
        {
            try {
                taskGroup.UserTasks.ForEach(userTask => {
                    _context.Entry(userTask).State = EntityState.Modified;
                    //_context.Entry(userTask.User).State = EntityState.Detached;
                    });
                _context.TaskGroups.Add(taskGroup);
                if (taskGroup.TaskGroupId > 0)
                {
                    _context.Entry(taskGroup).State = EntityState.Modified;

                }
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _context.UserTasks.RemoveRange(taskGroup.UserTasks); 
                throw;
            }
            _logger.LogInformation("Saved Task Group " + taskGroup.TaskGroupId + " " + taskGroup.Name);
            return taskGroup;
        }
    }
}

