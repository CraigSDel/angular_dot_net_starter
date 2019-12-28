using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using my_new_app.Model;
using my_new_app.Service;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserTaskController : Controller
    {

        private IUserTaskService _userTaskService;

        public UserTaskController(ILogger<UserTaskController> logger, IUserTaskService userTaskService)
        {
            _logger = logger;
            _userTaskService = userTaskService;
        }

        private readonly ILogger<UserTaskController> _logger;

        [HttpGet]
        public List<UserTask> Get()
        {
            return _userTaskService.GetAll();
        }

        [HttpPost]
        public UserTask Save([FromBody] UserTask userTask)
        {
            return _userTaskService.Save(userTask);
        }

        [HttpPost]
        [Route("Delete")]
        public Boolean Delete([FromBody] UserTask userTask)
        {
            return _userTaskService.Delete(userTask);
        }
    }
}