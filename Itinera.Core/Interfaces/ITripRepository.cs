global using Itinera.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface ITripRepository
    {
        Task<List<Trip>> GetTripsByUserIdAsync(int userId);
        Task<Trip> GetByIdAsync(int id);
        Task AddAsync(Trip trip);
        Task DeleteAsync(int tripId);
    }
}
