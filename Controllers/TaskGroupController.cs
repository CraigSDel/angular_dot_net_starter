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

        public TaskGroupController(ILogger<TaskGroupController> logger, IConfiguration configuration, UserDataContext context)
        {
            _logger = logger;
            this.configuration = configuration;
            this.context = context;
        }

        private readonly ILogger<TaskGroupController> _logger;

        [HttpGet]
        public IEnumerable<TaskGroup> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new TaskGroup
            {
                id = rng.Next(-20, 55),
                name = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpPost]
        public void Save([FromBody] TaskGroup taskGroup)
        {
            context.TaskGroups.Add(new TaskGroup());
            context.SaveChanges();
        }
    }
}