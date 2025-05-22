using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class AiRecommendationService : IAiRecommendationService
    {

        private readonly HttpClient _http;
        private readonly IConfiguration _config;
        public AiRecommendationService(HttpClient http, IConfiguration config)
        {
            _config = config;
            _http = http;
        }

        /*          Запрос к API AI на макс.кол-во токенов          */
        public async Task<AiRecommendationResultDTO> GetRecommendationAsync(UserPreferencesDTO preferences)
        {
            var prompt = BuildPrompt(preferences);
            var apiKey = _config["DeepSeek:ApiKey"];

            var requestBody = new
            {
                model = "deepseek/deepseek-r1",
                messages = new[] { new { role = "user", content = prompt } }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Headers.Add("HTTP-Referer", "https://itinera.local");
            request.Headers.Add("X-Title", "Itinera Travel AI");
            request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            try
            {
                var response = await _http.SendAsync(request);
                var json = await response.Content.ReadAsStringAsync();

                Console.WriteLine("== RAW RESPONSE ==");
                Console.WriteLine(json);

                if (!response.IsSuccessStatusCode)
                {
                    return new AiRecommendationResultDTO
                    {
                        Summary = $"Ошибка AI: {response.StatusCode} — {json}"
                    };
                }

                var document = JsonDocument.Parse(json);
                var answer = document.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return new AiRecommendationResultDTO
                {
                    Summary = answer ?? "Ответ пуст"
                };
            }
            catch (Exception ex)
            {
                return new AiRecommendationResultDTO
                {
                    Summary = $"Ошибка AI: {ex.Message}"
                };
            }
        }

        /*          Альтернативный запрос к API AI с регулировкой токенов          */
        public async Task<AiRecommendationResultDTO> GetRecommendationV2Async(UserPreferencesDTO preferences)
        {
            var prompt = BuildPrompt(preferences);
            var apiKey = _config["DeepSeek:ApiKey"];
            var maxTokens = 4096;

            async Task<string> SendRequest(int tokens)
            {
                var requestBody = new
                {
                    model = "deepseek/deepseek-r1",
                    messages = new[] { new { role = "user", content = prompt } },
                    max_tokens = tokens
                };

                var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                request.Headers.Add("HTTP-Referer", "https://itinera.local");
                request.Headers.Add("X-Title", "Itinera Travel AI");
                request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

                var response = await _http.SendAsync(request);
                var json = await response.Content.ReadAsStringAsync();

                Console.WriteLine("== RAW RESPONSE ==");
                Console.WriteLine(json);

                if (!response.IsSuccessStatusCode)
                    throw new Exception(json);

                var document = JsonDocument.Parse(json);
                return document.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString() ?? "Ответ пуст";
            }

            while (maxTokens >= 512)
            {
                try
                {
                    var summary = await SendRequest(maxTokens);
                    return new AiRecommendationResultDTO { Summary = summary };
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("max_tokens") || ex.Message.Contains("more credits"))
                    {
                        maxTokens -= 512;
                        continue;
                    }

                    return new AiRecommendationResultDTO { Summary = $"Ошибка AI: {ex.Message}" };
                }
            }

            return new AiRecommendationResultDTO { Summary = "Не удалось получить ответ от AI: недостаточно токенов." };
        }


        private string BuildPrompt(UserPreferencesDTO dto)
        {
            return $"Планирую поехать в {dto.Destination} на {dto.Days} дней. " +
                   $"Стиль: {dto.Style}. " +
                   $"Интересы: {dto.Interests}. " +
                   $"Бюджет: {dto.BudgetLevel}. " +
                   $"Дай рекомендации по маршруту и советам";
        }
    }
}
