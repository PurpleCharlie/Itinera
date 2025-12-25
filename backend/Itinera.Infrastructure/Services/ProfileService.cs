using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _profileRepository;

        public ProfileService(IProfileRepository profileRepository)
        {
            _profileRepository = profileRepository;
        }

        public async Task<UserProfileDTO?> GetProfileAsync(int userId)
        {
            var user = await _profileRepository.GetUserByIdAsync(userId);
            if (user == null) return null;

            return new UserProfileDTO
            {
                Username = user.Username,
                CurrentCity = user.CurrentCity,
                Interests = user.InterestsRaw,
                TravelStyle = user.TravelStyle
            };
        }

        public async Task<bool> UpdateProfileAsync(int userId, UpdateUserProfileDTO dto)
        {
            var user = await _profileRepository.GetUserByIdAsync(userId);
            if (user == null) return false;

            if (dto.CurrentCity != null)
                user.CurrentCity = dto.CurrentCity;

            if (dto.Interests != null)
                user.InterestsRaw = dto.Interests;

            if (dto.TravelStyle != null)
                user.TravelStyle = dto.TravelStyle;

            if(dto.Username != null)
                user.Username = dto.Username;

            await _profileRepository.UpdateUserAsync(user);
            return true;
        }
    }
}
