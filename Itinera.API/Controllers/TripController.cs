global using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Itinera.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripService;
        public TripController(ITripService tripService)
        {
            _tripService = tripService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        public async Task<IActionResult> CreateTrip(CreateTripDTO dto)
        {
            var isSucces = await _tripService.CreateTripAsync(GetUserId(), dto);
            if (!isSucces)
                return BadRequest("Не удалось создать поездку");

            return Ok("Поездка добавлена");
        }

        [HttpGet]
        public async Task<IActionResult> GetTrips()
        {
            var trips = await _tripService.GetTripsForUserAsync(GetUserId());
            if (trips == null || trips.Count == 0)
                return NotFound("Поездки не найдены");
            return Ok(trips);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTrip(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id, GetUserId());
            if (trip == null)
                return NotFound("Поездка не найдена");

            return Ok(trip);
        }
    }
}
