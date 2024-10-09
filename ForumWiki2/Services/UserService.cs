using ForumWiki2.Models;
using ForumWiki2.Db;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;


namespace ForumWiki2.Services
{
    public class UserService
    {
        public static string GenerateJwtToken(User user, IConfiguration _configuration)
        {
            if (user.Username == null || user.Role == null)
            {
                throw new ArgumentNullException("User's username or role cannot be null.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured."));

            if (key.Length < 16)
            {
                throw new InvalidOperationException("JWT key must be at least 128 bits (16 bytes) long.");
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static async Task<User> GetCurrentUserAsync(string token, MyContext context)
        {

            var newUser = new User
            {
                Username = "Guest",
                Role = "Guest"
            };
            if (string.IsNullOrEmpty(token))
            {
                return newUser;
            }
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var username = jwtToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name)?.Value;

            if (username == null) return newUser;
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return user ?? new User
            {
                Username = "Guest",
                Role = "Guest"
            };
        }
    }
}
