using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class RecommendationHistoryService : IRecommendationHistoryService
    {
        private readonly IRecommendationHistoryRepository _repository;

        public RecommendationHistoryService(IRecommendationHistoryRepository repository)
        {
            _repository = repository;
        }

        public async Task SaveRecommendationAsync(int tripId, string destination, string text, int days, string style)
        {
            var entity = new RecommendationHistory
            {
                TripId = tripId,
                Destination = destination,
                Days = days,
                Style = style,
                RecommendationText = text,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }


        public async Task<List<RecommendationHistoryDTO>> GetByTripIdAsync(int tripId)
        {
            var list = await _repository.GetByTripIdAsync(tripId);

            return list.Select(r => new RecommendationHistoryDTO
            {
                Id = r.Id,
                Destination = r.Destination,
                RecommendationText = r.RecommendationText,
                CreatedAt = r.CreatedAt,
                Days = r.Days,
                Style = r.Style
            }).ToList();
        }

        public async Task<RecommendationHistoryDTO?> GetByIdAsync(int id)
        {
            var r = await _repository.GetByIdAsync(id);
            if (r == null) return null;

            return new RecommendationHistoryDTO
            {
                Id = r.Id,
                Destination = r.Destination,
                RecommendationText = r.RecommendationText,
                CreatedAt = r.CreatedAt,
                Days = r.Days,
                Style = r.Style
            };
        }
    }
}
