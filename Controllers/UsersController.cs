using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly IConfiguration configuration;

        private static readonly string[] Summaries = new[]
        {
            "Angela", "Kevin", "Justin", "Craig", "Gregory", "Nunny", "Drummond", "Andrea"
        };

        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger, IConfiguration configuration)
        {
            _logger = logger;
            this.configuration = configuration;
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
        public User Save()
        {
            return new User();
        }
    }
}