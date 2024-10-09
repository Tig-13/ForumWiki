using System.ComponentModel.DataAnnotations;
namespace ForumWiki2.Models
{
    public class Comment
    {
        public int Id { get; set; }
        [Required]
        public string? Content { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
    }
}
