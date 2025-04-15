global using Microsoft.Extensions.Configuration;
global using System.Text;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Внедрение зависимостей
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="configuration"></param>
        public AuthService(IUserRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<string?> LoginAsync(LoginDTO login)
        {
            var user = await _repository.GetByEmailAsync(login.Email);
            if (user == null)
                return null;

            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
                return null;

            return GenerateJwtToken(user);
        }
        public async Task<bool> RegisterAsync(RegisterDTO register)
        {
            var isExistsUser = await _repository.ExistsByEmailAsync(register.Email);
            if(isExistsUser)
                return false;

            var user = new User
            {
                Username = register.Username,
                Email = register.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
                RegisteredAt = DateTime.UtcNow
            };

            await _repository.AddAsync(user);
            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
