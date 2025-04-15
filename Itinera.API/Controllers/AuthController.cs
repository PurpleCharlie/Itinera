global using Itinera.Core.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        /// <summary>
        /// Внедрение зависимостей
        /// </summary>
        /// <param name="authService"></param>
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Аутентификация пользователя с отправкой jwt-токена
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var token = await _authService.LoginAsync(dto);
            if(token == null)
                return BadRequest("Неверный логин или пароль");

            return Ok(new { Token = token });
        }

        /// <summary>
        /// Регистрация нового пользователя
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var isSuccess = await _authService.RegisterAsync(dto);
            if(!isSuccess)
                return BadRequest("Пользователь с таким email уже существует");

            return Ok("Пользователь успешно зарегистрирован");
        }

    }
}
