using my_new_app.Model;
using System;
using System.Collections.Generic;

namespace my_new_app.Service
{
    public interface ITaskGroupService
    {  

        TaskGroup Get(int id);
    
        List<TaskGroup> GetAll();

        TaskGroup Save(TaskGroup taskGroup);

        Boolean Delete(TaskGroup taskGroup);

        List<TaskGroup> GetAllOrderByName();

        List<TaskGroup> GetAllOrderByTaskCount();
    }
}
