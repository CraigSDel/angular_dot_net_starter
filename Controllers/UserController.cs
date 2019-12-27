using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using my_new_app.Model;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IConfiguration configuration;

        readonly UserDataContext context;

        private readonly ILogger<UserController> _logger;

        private static readonly string[] Summaries = new[]
        {
            "Angela", "David", "Cathryn", "Victoria", "Kevin", "Justin", "Craig", "Gregory", "Nunny", "Drummond", "Andrea"
        };

        public UserController(ILogger<UserController> logger, IConfiguration configuration, UserDataContext context)
        {
            _logger = logger;
            this.configuration = configuration;
            this.context = context;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new User
            {
                id = rng.Next(-20, 55),
                firstName = Summaries[rng.Next(Summaries.Length)],
                lastName = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }


        [HttpPost]
        public void Save([FromBody] User user)
        {
            context.Users.Add(user);
            context.SaveChanges();
        }
    }
}