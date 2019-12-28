using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using my_new_app.Model;
using my_new_app.Service;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {

        private IUserService _userService;

        public UserController(ILogger<UserController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        private readonly ILogger<UserController> _logger;

        [HttpGet]
        public List<User> Get()
        {
            return _userService.GetAll();
        }

        [HttpPost]
        public User Save([FromBody] User user)
        {
            return _userService.Save(user);
        }

        [HttpPost]
        [Route("Delete")]
        public Boolean Delete([FromBody] User user)
        {
            return _userService.Delete(user);
        }
    }
}