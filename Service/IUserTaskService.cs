using my_new_app.Model;
using System;
using System.Collections.Generic;

namespace my_new_app.Service
{
    public interface IUserTaskService
    {  

        UserTask Get(int id);
    
        List<UserTask> GetAll();

        UserTask Save(UserTask taskGroup);

        Boolean Delete(UserTask taskGroup);
    }
}
