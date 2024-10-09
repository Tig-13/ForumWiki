using System.ComponentModel.DataAnnotations;

namespace ForumWiki2.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
    }
}
