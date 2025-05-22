using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IProfileRepository
    {
        Task<User?> GetUserByIdAsync(int userId);
        Task UpdateUserAsync(User user);
    }
}
