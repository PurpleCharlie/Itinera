using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IAiRecommendationService
    {
        Task<AiRecommendationResultDTO> GetRecommendationAsync(UserPreferencesDTO preferences);
        Task<AiRecommendationResultDTO> GetRecommendationV2Async(UserPreferencesDTO preferences);
    }
}
