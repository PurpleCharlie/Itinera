using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/flights")]
    [ApiController]
    public class FlightSearchController : ControllerBase
    {
        private readonly IFlightSearchService _flightSearchService;

        public FlightSearchController(IFlightSearchService flightSearchService)
        {
            _flightSearchService = flightSearchService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string from, [FromQuery] string to, [FromQuery] string date)
        {
            if (string.IsNullOrWhiteSpace(from) || string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(date))
                return BadRequest(new { message = "Missing required parameters" });

            var results = await _flightSearchService.SearchFlightsAsync(from, to, date);
            return Ok(results);
        }
    }
}
