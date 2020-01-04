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
        private ITaskGroupService _taskGroupService;

        public TaskGroupController(ILogger<TaskGroupController> logger, ITaskGroupService taskGroupService)
        {
            _logger = logger;
            _taskGroupService = taskGroupService;
        }

        private readonly ILogger<TaskGroupController> _logger;

        [HttpGet]
        public List<TaskGroup> Get()
        {
            return _taskGroupService.GetAll();
        }

        [HttpGet]
        [Route("GetAllOrderByName")]
        public List<TaskGroup> GetAllOrderByName()
        {
            return _taskGroupService.GetAllOrderByName();
        }

        [HttpGet]
        [Route("GetAllOrderByTaskCount")]
        public List<TaskGroup> GetAllOrderByTaskCount()
        {
            return _taskGroupService.GetAllOrderByTaskCount();
        }

        [HttpPost]
        public TaskGroup Save([FromBody] TaskGroup taskGroup)
        {
            return _taskGroupService.Save(taskGroup);
        }
       
        [HttpPost]
        [Route("Delete")]
        public Boolean Delete([FromBody] TaskGroup taskGroup)
        {
            return _taskGroupService.Delete(taskGroup);
        }
    }
}