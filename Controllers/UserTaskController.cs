using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using my_new_app.Model;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserTaskController : Controller
    {
        private static readonly string[] Summaries = new[]
        {
            "Angela", "David", "Cathryn", "Victoria", "Kevin", "Justin", "Craig", "Gregory", "Nunny", "Drummond", "Andrea"
        };

        private readonly ILogger<UserTaskController> _logger;

        public UserTaskController(ILogger<UserTaskController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<UserTask> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new UserTask
            {
                id = rng.Next(-20, 55),
                name = Summaries[rng.Next(Summaries.Length)],
                status = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}