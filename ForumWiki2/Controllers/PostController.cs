using Microsoft.AspNetCore.Mvc;
using ForumWiki2.Models;
using ForumWiki2.Db;
using Microsoft.EntityFrameworkCore;

namespace ForumWiki2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly MyContext context;

        public PostController(MyContext context)
        {
            this.context = context;
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetPostsByCategory(int categoryId)
        {
            var localPosts = await context.Posts
                                  .Where(p => p.CategoryId == categoryId)
                                  .ToListAsync();

            return Ok(localPosts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var localPost = await context.Posts.FindAsync(id);
            if (localPost == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            return Ok(localPost);
        }

        [HttpPost]
        public async Task<IActionResult> AddPost([FromBody] Post post)
        {
            context.Posts.Add(post);
            await context.SaveChangesAsync();
            return Ok(post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            var existingPost = await context.Posts.FindAsync(id);
            if (existingPost == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            existingPost.Title = post.Title;
            existingPost.Content = post.Content;
            existingPost.CategoryId = post.CategoryId;

            await context.SaveChangesAsync();

            return Ok(existingPost);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            context.Posts.Remove(post);
            await context.SaveChangesAsync();
            return Ok(new { message = "Post deleted successfully" });
        }

        [HttpPost("{postId}/like")]
        public async Task<IActionResult> LikePost(int postId, [FromBody] Like like)
        {
            var post = await context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            var existingLike = await context.Likes.FirstOrDefaultAsync(l => l.UserId == like.UserId && l.PostId == postId);
            if (existingLike != null)
            {
                return BadRequest(new { message = "User already liked this post", isAlreadyLiked = true });
            }

            post.Likes++;
            context.Likes.Add(like);
            await context.SaveChangesAsync();

            return Ok(new { message = "Like added", likes = post.Likes });
        }

        [HttpDelete("{postId}/like/{userId}")]
        public async Task<IActionResult> UnlikePost(int postId, int userId)
        {
            var post = await context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            var likeToDelete = await context.Likes.FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId);
            if (likeToDelete == null)
            {
                return BadRequest(new { message = "Like not found" });
            }

            post.Likes--;
            context.Likes.Remove(likeToDelete);
            await context.SaveChangesAsync();

            return Ok(new { message = "Like removed", likes = post.Likes });
        }

        [HttpGet("{postId}/liked/{userId}")]
        public async Task<IActionResult> HasUserLikedPost(int postId, int userId)
        {
            var post = await context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }

            var existingLike = await context.Likes.FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == postId);
            bool liked = existingLike != null;

            return Ok(new { liked=liked});
        }

        [HttpPost("{postId}/comments")]
        public async Task<IActionResult> AddCommentbyPost(int postId, [FromBody] Comment comment)
        {
            var post = await context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }
            comment.PostId = postId;
            await context.Comments.AddAsync(comment);
            await context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpGet("{postId}/comments")]
        public async Task<IActionResult> GetCommentbyPost(int postId)
        {
            var post = await context.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found" });
            }
            var comments = await context.Comments.Where(c => c.PostId == postId).ToListAsync();

            return Ok(comments);
        }
    }
}
