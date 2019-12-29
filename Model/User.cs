using my_new_app.Model;
using System.ComponentModel.DataAnnotations;
namespace my_new_app
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual UserTask UserTask { get; set; }
    }
}
