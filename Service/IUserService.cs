using my_new_app.Model;
using System;
using System.Collections.Generic;

namespace my_new_app.Service
{
    public interface IUserService
    {  

        User Get(int id);
    
        List<User> GetAll();

        User Save(User user);

        Boolean Delete(User user);
    }
}

