using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    /// <summary>
    /// Интерфейс для сервиса аутентификации
    /// </summary>
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterDTO register);
        Task<string?> LoginAsync(LoginDTO login);
    }
}
