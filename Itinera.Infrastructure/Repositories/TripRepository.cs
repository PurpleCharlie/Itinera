using Itinera.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Repositories
{
    /// <summary>
    /// Репозиторий поездок
    /// </summary>
    public class TripRepository : ITripRepository
    {
        private readonly AppDbContext _context;
        public TripRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Trip trip)
        {
            await _context.Trips.AddAsync(trip);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int tripId)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
        }

        public async Task<Trip> GetByIdAsync(int id)
        {
            return await _context.Trips.FindAsync(id);
        }

        public async Task<List<Trip>> GetTripsByUserIdAsync(int userId)
        {
            return await _context.Trips
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.DateFrom)
                .ToListAsync();
        }
    }
}
