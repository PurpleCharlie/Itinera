using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Itinera.API.Controllers
{
    [Route("api/profile")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var profile = await _profileService.GetProfileAsync(userId.Value);
            if (profile == null)
                return NotFound();

            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile(UpdateUserProfileDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var success = await _profileService.UpdateProfileAsync(userId.Value, dto);
            if (!success)
                return NotFound();

            return NoContent();
        }

        private int? GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(idClaim, out var id) ? id : null;
        }
    }
}
