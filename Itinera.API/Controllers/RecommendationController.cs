using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly IAiRecommendationService _service;
        public RecommendationController(IAiRecommendationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> GetRecommendation(UserPreferencesDTO dto)
        {
            var resultRecommendation = await _service.GetRecommendationAsync(dto);
            return Ok(resultRecommendation);
        }
    }
}
