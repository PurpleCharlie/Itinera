using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/trips/{tripId}/bookings")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _booking;
        public BookingController(IBookingService booking)
        {
            _booking = booking;
        }

        [HttpPost("hotel")]
        public async Task<IActionResult> BookHotel(int tripId, CreateHotelBookingDTO dto)
        {
            var result = await _booking.BookHotelAsync(tripId, dto);

            return result ? Ok("Отель забронирован") : NotFound("Поездка не найдена");
        }

        [HttpPost("flight")]
        public async Task<IActionResult> BookFlight(int tripId, CreateFlightBookingDTO dto)
        {
            var result = await _booking.BookFlightAsync(tripId, dto);

            return result ? Ok("Билет забронирован") : NotFound("Поездка не найдена");
        }
    }
}
