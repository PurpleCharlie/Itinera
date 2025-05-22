using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/hotels")]
    [ApiController]
    public class HotelSearchController : ControllerBase
    {
        private readonly IHotelSearchService _service;

        public HotelSearchController(IHotelSearchService service)
        {
            _service = service;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string city, [FromQuery] DateTime checkIn, [FromQuery] DateTime checkOut)
        {
            if (string.IsNullOrWhiteSpace(city))
                return BadRequest(new { message = "Город не указан" });

            if (checkOut <= checkIn)
                return BadRequest(new { message = "Неверный диапазон дат" });

            var hotels = await _service.SearchHotelsAsync(city, checkIn, checkOut);
            return Ok(hotels);
        }

    }
}
