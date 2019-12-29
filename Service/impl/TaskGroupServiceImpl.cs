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
            _logger.LogInformation("Delete Task Group " + taskGroup.Id + " " + taskGroup.Name);
            return true;
        }

        public TaskGroup Get(int id)
        {
            var taskGroup = from u in _context.TaskGroups where u.Id == id select u;
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
            
            try
            {
                _context.AddRange(taskGroup.UserTasks); 
                taskGroup.UserTasks.ForEach(l => _context.Entry(l).State = EntityState.Unchanged); 
                _context.TaskGroups.Add(taskGroup);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                _context.RemoveRange(taskGroup.UserTasks); 
                throw;
            }
            _logger.LogInformation("Saved Task Group " + taskGroup.Id + " " + taskGroup.Name);
            return taskGroup;
        }
    }
}

