using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IRecommendationHistoryRepository
    {
        Task AddAsync(RecommendationHistory recommendation);
        Task DeleteAsync(int id);
        Task<List<RecommendationHistory>> GetByTripIdAsync(int tripId);
        Task<RecommendationHistory?> GetByIdAsync(int id);

    }
}
