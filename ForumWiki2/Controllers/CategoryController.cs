using Microsoft.AspNetCore.Mvc;
using ForumWiki2.Models;
using ForumWiki2.Db;
using Microsoft.EntityFrameworkCore;

namespace ForumWiki2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly MyContext context;

        public CategoryController(MyContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories2 = await context.Categories.ToListAsync();
            return Ok(categories2);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category2 = await context.Categories.FindAsync(id);
            if (category2 == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            return Ok(category2);
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            await context.AddAsync(category);
            context.SaveChanges();
            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            var existingCategory2 = await context.Categories.FindAsync(id);
            if (existingCategory2 == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            existingCategory2.Name = category.Name;
            await context.SaveChangesAsync();

            return Ok(existingCategory2);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category2 = await context.Categories.FindAsync(id);
            if (category2 == null)
            {
                return NotFound(new { message = "Category not found" });
            }
            context.Categories.Remove(category2);
            await context.SaveChangesAsync();
            return Ok(new { message = "Category deleted successfully" });
        }
    }
}
