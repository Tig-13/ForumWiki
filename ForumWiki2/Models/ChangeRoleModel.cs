using System.ComponentModel.DataAnnotations;

namespace ForumWiki2.Models
{
    public class ChangeRoleModel
    {
        [Required]
        public string? UserId { get; set; }

        [Required]
        public string? Role { get; set; }
    }
}
