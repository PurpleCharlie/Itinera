using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IRecommendationHistoryService
    {
        Task SaveRecommendationAsync(int tripId, string destination, string text, int days, string style);
        Task DeleteAsync(int id);
        Task<List<RecommendationHistoryDTO>> GetByTripIdAsync(int tripId);
        Task<RecommendationHistoryDTO?> GetByIdAsync(int id);
    }
}
