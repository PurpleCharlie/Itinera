using System.Text.Json;
using Itinera.Core.DTOs;
using Itinera.Core.Interfaces;

namespace Itinera.Infrastructure.Services
{
    public class HotelSearchService : IHotelSearchService
    {
        private readonly HttpClient _httpClient;

        public HotelSearchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<HotelResultDTO>> SearchHotelsAsync(string city, DateTime checkIn, DateTime checkOut)
        {
            var checkInDate = checkIn.ToString("yyyy-MM-dd");
            var checkOutDate = checkOut.ToString("yyyy-MM-dd");

            
            var lookupUrl = $"https://engine.hotellook.com/api/v2/lookup.json?query={Uri.EscapeDataString(city)}&lang=ru&lookFor=city&limit=1";

            var locationResponse = await _httpClient.GetAsync(lookupUrl);
            if (!locationResponse.IsSuccessStatusCode)
                return new List<HotelResultDTO>();

            var locationJson = JsonDocument.Parse(await locationResponse.Content.ReadAsStringAsync());

            if (!locationJson.RootElement.TryGetProperty("results", out var results) ||
                !results.TryGetProperty("locations", out var locations) ||
                locations.GetArrayLength() == 0)
                return new List<HotelResultDTO>();

            var locationId = locations[0].GetProperty("id").GetString();

            var cacheUrl = $"https://engine.hotellook.com/api/v2/cache.json?locationId={locationId}&currency=rub&limit=10&checkIn={checkInDate}&checkOut={checkOutDate}";

            var cacheResponse = await _httpClient.GetAsync(cacheUrl);
            if (!cacheResponse.IsSuccessStatusCode)
                return new List<HotelResultDTO>();

            var cacheJson = JsonDocument.Parse(await cacheResponse.Content.ReadAsStringAsync());
            var hotels = new List<HotelResultDTO>();

            foreach (var hotel in cacheJson.RootElement.EnumerateArray())
            {
                hotels.Add(new HotelResultDTO
                {
                    HotelId = hotel.GetProperty("hotelId").GetRawText().Trim('"'),
                    HotelName = hotel.GetProperty("hotelName").GetString() ?? "Неизвестно",
                    PriceFrom = hotel.TryGetProperty("priceFrom", out var price) ? price.GetDecimal() : 0,
                    Stars = hotel.TryGetProperty("stars", out var stars) ? stars.GetInt32() : 0
                });
            }

            return hotels;
        }

    }
}
