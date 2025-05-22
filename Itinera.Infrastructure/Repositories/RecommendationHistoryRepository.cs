using Itinera.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Repositories
{
    public class RecommendationHistoryRepository : IRecommendationHistoryRepository
    {
        private readonly AppDbContext _context;

        public RecommendationHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RecommendationHistory recommendation)
        {
            _context.RecommendationHistories.Add(recommendation);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var entity = await _context.RecommendationHistories.FindAsync(id);
            if (entity != null)
            {
                _context.RecommendationHistories.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<RecommendationHistory>> GetByTripIdAsync(int tripId)
        {
            return await _context.RecommendationHistories
                .Where(r => r.TripId == tripId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<RecommendationHistory?> GetByIdAsync(int id)
        {
            return await _context.RecommendationHistories
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}
