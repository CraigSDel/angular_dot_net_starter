using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using my_new_app.Model;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskGroupController : Controller
    {
        private readonly IConfiguration configuration;

        readonly UserDataContext context;


        private static readonly string[] Summaries = new[]
        {
            "Angela", "Kevin", "Justin", "Craig", "Gregory", "Nunny", "Drummond", "Andrea"
        };

        public TaskGroupController(ILogger<UsersController> logger, IConfiguration configuration, UserDataContext context)
        {
            _logger = logger;
            this.configuration = configuration;
            this.context = context;
        }

        private readonly ILogger<UsersController> _logger;

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
            context.Users.Add(new User());
            context.SaveChanges();
        }
    }
}