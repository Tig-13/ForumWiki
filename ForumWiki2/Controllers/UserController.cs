using Microsoft.AspNetCore.Mvc;
using ForumWiki2.Models;
using Microsoft.AspNetCore.Authorization;
using ForumWiki2.Db;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ForumWiki2.Services;


namespace ForumWiki2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly MyContext context;
        private readonly IConfiguration _configuration;

        public UserController(ILogger<UserController> logger, MyContext context, IConfiguration configuration)   
        {
            
            _logger = logger;
            this.context = context;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid registration details" });
            }
            var existingUser2 = await context.Users.FirstOrDefaultAsync(u => u.Username == model.Username);
            if (existingUser2 != null)
            {
                return BadRequest(new { message = "User already exists" });
            }

            if (model.Role != "User" && model.Role != "Admin")
            {
                return BadRequest(new { message = "Invalid role specified" });
            }

            var user = new User
            {
                Username = model.Username,
                Password = model.Password,
                Role = model.Role
            };
            await context.Users.AddAsync(user);
            context.SaveChanges();
            return Ok(new { message = "User registered successfully" });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Username and password are required" });
            }
            var user2 = await context.Users.FirstOrDefaultAsync(u => u.Username == model.Username && u.Password == model.Password);
            if (user2 == null)
            {
                _logger.LogWarning($"Invalid login attempt for username: {model.Username}");
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = UserService.GenerateJwtToken(user2, _configuration);
            return Ok(new
            {
                token,
                id = user2.Id,
                username = user2.Username,
                role = user2.Role
            });
        }

        

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var user = await UserService.GetCurrentUserAsync(token, context);
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users2 = await context.Users.ToListAsync();
            return Ok(users2);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user2 = await context.Users.FindAsync(id);
            if (user2 == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user2);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserModel model)
        {
            var user2 = await context.Users.FindAsync(id);
            if (user2 == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user2.Username = model.Username ?? user2.Username;
            user2.Role = model.Role ?? user2.Role;

            await context.SaveChangesAsync(); 
            return Ok(new { message = "User updated successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user2 = await context.Users.FindAsync(id);
            if (user2 == null)
            {
                return NotFound(new { message = "User not found" });
            }
            context.Users.Remove(user2);
            await context.SaveChangesAsync();
            return Ok(new { message = "User deleted successfully" });
        }
    }
}
