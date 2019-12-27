using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using my_new_app.Model;
using my_new_app.Service;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskGroupController : Controller
    {
        private TaskGroupService taskGroupService;


        public TaskGroupController(ILogger<TaskGroupController> logger)
        {
            _logger = logger;
            this.taskGroupService = new TaskGroupService();
        }

        private readonly ILogger<TaskGroupController> _logger;

        [HttpGet]
        public IEnumerable<TaskGroup> Get()
        {
            return taskGroupService.Get();
        }

        [HttpPost]
        public TaskGroup Save([FromBody] TaskGroup taskGroup)
        {
           return taskGroupService.Save(taskGroup);
        }
    }
}