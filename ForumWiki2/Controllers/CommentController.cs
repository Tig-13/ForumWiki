using Microsoft.AspNetCore.Mvc;
using ForumWiki2.Models;
using ForumWiki2.Db;  
using Microsoft.EntityFrameworkCore;  

namespace ForumWiki2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly MyContext context;  

        public CommentController(MyContext context)
        {
            this.context = context;  
        }

        [HttpGet]
        public async Task<IActionResult> GetComments()
        {
            var comments = await context.Comments.ToListAsync();  
            return Ok(comments);  
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id)
        {
            var comment = await context.Comments.FindAsync(id);  
            if (comment == null)
            {
                return NotFound(new { message = "Comment not found" });
            }

            return Ok(comment); 
        }

        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] Comment comment)
        {
            context.Comments.Add(comment);  
            await context.SaveChangesAsync();  
            return Ok(comment);  
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] Comment comment)
        {
            var existingComment = await context.Comments.FindAsync(id);  
            if (existingComment == null)
            {
                return NotFound(new { message = "Comment not found" });
            }

            existingComment.Content = comment.Content;
            existingComment.PostId = comment.PostId;

            await context.SaveChangesAsync();  
            return Ok(existingComment);  
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await context.Comments.FindAsync(id); 
            if (comment == null)
            {
                return NotFound(new { message = "Comment not found" });
            }

            context.Comments.Remove(comment);  
            await context.SaveChangesAsync();  

            return Ok(new { message = "Comment deleted successfully" });
        }
    }
}
