using Itinera.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Repositories
{
    public class RoutePointRepository : IRoutePointRepository
    {
        private readonly AppDbContext _context;
        public RoutePointRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RoutePoint point)
        {
            _context.RoutePoints.Add(point);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RoutePoint>> GetByTripIdAsync(int tripId)
        {
            return await _context.RoutePoints.Where(p => p.TripId == tripId)
                .OrderBy(p => p.Order)
                .ToListAsync();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
