using my_new_app.Model;
using System.ComponentModel.DataAnnotations;
namespace my_new_app
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public UserTask UserTask { get; set; }
    }
}
