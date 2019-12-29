using Microsoft.Extensions.Logging;
using my_new_app.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace my_new_app.Service
{
    public class UserServiceImpl : IUserService
    {

        private readonly ILogger<UserServiceImpl> _logger;

        private UserDataContext _context;

        public UserServiceImpl() { }

        public UserServiceImpl(ILogger<UserServiceImpl> logger, UserDataContext context)
        {
            _logger = logger;
            _context = context;
        }

        public Boolean Delete(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
            _logger.LogInformation("Delete Task Group " + user.UserId + " " + user.FirstName);
            return true;
        }

        public User Get(int id)
        {
            var user = from u in _context.Users where u.UserId == id select u;
            if (user.Count() == 1)
            {
                return user.First();
            }
            return null;
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }


        public User Save(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            _logger.LogInformation("Saved Task Group " + user.UserId + " " + user.FirstName);
            return user;
        }
    }
}
