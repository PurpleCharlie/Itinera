using Itinera.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    /// <summary>
    /// Интерфейс для репозитория пользователей
    /// </summary>
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync (string email);
        Task AddAsync(User user);
        Task<bool> ExistsByEmailAsync(string email);
    }
}
