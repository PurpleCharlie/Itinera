using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IProfileService
    {
        Task<UserProfileDTO?> GetProfileAsync(int userId);
        Task<bool> UpdateProfileAsync(int userId, UpdateUserProfileDTO dto);
    }
}
