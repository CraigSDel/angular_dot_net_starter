using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using my_new_app.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace my_new_app.Service
{
    public class TaskGroupService
    {
        private readonly IConfiguration configuration;

        private readonly ILogger<TaskGroupService> _logger;

        readonly UserDataContext context;

        private readonly string[] summaries = new[]
        {
            "Angela", "David", "Cathryn", "Victoria", "Kevin", "Justin", "Craig", "Gregory", "Nunny", "Drummond", "Andrea"
        };

        public TaskGroupService() { }

        public TaskGroupService(ILogger<TaskGroupService> logger, IConfiguration configuration, UserDataContext context)
        {
            _logger = logger;
            this.configuration = configuration;
            this.context = context;
        }

        public IEnumerable<TaskGroup> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new TaskGroup
            {
                id = rng.Next(-20, 55),
                name = summaries[rng.Next(summaries.Length)],
                userTasks = new UserTask[2]
            })
            .ToArray();
        }


        public TaskGroup Save(TaskGroup taskGroup)
        {
            context.TaskGroups.Add(taskGroup);
            context.SaveChanges();
            _logger.LogInformation("Saved Task Group");
            return taskGroup;
        }
    }
}

