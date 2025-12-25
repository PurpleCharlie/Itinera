using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Itinera.API.Controllers
{
    [Route("api/trips/{tripId}/bookings")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _booking;
        private readonly IEmailSender _emailSender;
        public BookingController(IBookingService booking, IEmailSender emailSender)
        {
            _booking = booking;
            _emailSender = emailSender;
        }

        [HttpPost("hotel")]
        public async Task<IActionResult> BookHotel(int tripId, CreateHotelBookingDTO dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var result = await _booking.BookHotelAsync(tripId, dto, email);

            return result ? Ok(new { message = "Отель забронирован" }) : NotFound(new { message = "Поездка не найдена" });
        }

        [HttpPost("flight")]
        public async Task<IActionResult> BookFlight(int tripId, CreateFlightBookingDTO dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var result = await _booking.BookFlightAsync(tripId, dto, email);

            return result ? Ok(new { message = "Билет забронирован" }) : NotFound(new { message = "Поездка не найдена" });
        }
    }
}
