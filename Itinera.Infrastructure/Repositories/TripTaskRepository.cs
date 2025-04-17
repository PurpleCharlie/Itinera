using Itinera.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Repositories
{
    public class TripTaskRepository : ITripTaskRepository
    {
        private readonly AppDbContext _context;
        public TripTaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(TripTask tripTask)
        {
            _context.TripTasks.Add(tripTask);
            await _context.SaveChangesAsync();
        }

        public async Task<TripTask> GetByIdAsync(int taskId)
        {
            return await _context.TripTasks.FindAsync(taskId);
        }

        public async Task<List<TripTask>> GetByTripIdAsync(int tripId)
        {
            return await _context.TripTasks
                .Where(t => t.TripId == tripId)
                .ToListAsync();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
