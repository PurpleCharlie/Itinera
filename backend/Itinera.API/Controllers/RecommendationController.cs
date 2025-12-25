using MailKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecommendationController : ControllerBase
    {
        private readonly IAiRecommendationService _aiService;
        private readonly IRecommendationHistoryService _historyService;

        public RecommendationController(IAiRecommendationService aiService, IRecommendationHistoryService historyService)
        {
            _aiService = aiService;
            _historyService = historyService;
        }

        [HttpDelete("history/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _historyService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("{tripId}")]
        public async Task<IActionResult> GetRecommendation(int tripId, [FromBody] UserPreferencesDTO dto)
        {
            var aiResult = await _aiService.GetRecommendationV2Async(dto);

            await _historyService.SaveRecommendationAsync(
                tripId,
                dto.Destination,
                aiResult.Summary,
                dto.Days,
                dto.Style
            );

            return Ok(aiResult);
        }

        [HttpGet("{tripId}/history")]
        public async Task<IActionResult> GetHistory(int tripId)
        {
            var history = await _historyService.GetByTripIdAsync(tripId);
            return Ok(history);
        }

        [HttpGet("history/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _historyService.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }
    }
}
