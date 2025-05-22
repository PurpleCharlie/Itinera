using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class FlightSearchService : IFlightSearchService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public FlightSearchService(HttpClient httpClient, IConfiguration config)
        {
            _config = config;
            _httpClient = httpClient;
        }

        public async Task<List<FlightResultDTO>> SearchFlightsAsync(string from, string to, string departDate)
        {
            // Преобразуем города в IATA-коды
            var fromCode = await GetIataCodeAsync(from);
            var toCode = await GetIataCodeAsync(to);

            if (string.IsNullOrEmpty(fromCode) || string.IsNullOrEmpty(toCode))
                return new List<FlightResultDTO>(); // ничего не найдено

            var url = $"https://api.travelpayouts.com/v2/prices/latest?origin={fromCode}&destination={toCode}&depart_date={departDate}&currency=rub";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("X-Access-Token", _config["Aviasales:API"]);

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return new List<FlightResultDTO>();

            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine("FLIGHT RAW JSON:");
            Console.WriteLine(content);

            var result = new List<FlightResultDTO>();

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            if (root.TryGetProperty("data", out var dataArray) && dataArray.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in dataArray.EnumerateArray())
                {
                    var origin = item.GetProperty("origin").GetString() ?? "";
                    var destination = item.GetProperty("destination").GetString() ?? "";
                    var departedDate = item.GetProperty("depart_date").GetString() ?? "";
                    var price = item.GetProperty("value").GetDecimal();
                    var gate = item.GetProperty("gate").GetString() ?? "";

                    result.Add(new FlightResultDTO
                    {
                        Airline = gate,
                        Price = price,
                        DepartureAt = DateTime.TryParse(departedDate, out var parsed) ? parsed : DateTime.MinValue,
                        From = origin,
                        To = destination
                    });
                }
            }

            return result;
        }


        private async Task<string?> GetIataCodeAsync(string cityName)
        {
            var url = $"https://autocomplete.travelpayouts.com/places2?term={Uri.EscapeDataString(cityName)}&locale=ru&type=city";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.ValueKind == JsonValueKind.Array && root.GetArrayLength() > 0)
            {
                var first = root[0];
                if (first.TryGetProperty("code", out var code))
                    return code.GetString();
            }

            return null;
        }

    }
}
