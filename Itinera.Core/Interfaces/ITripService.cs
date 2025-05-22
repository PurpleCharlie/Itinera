using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface ITripService
    {
        Task<bool> CreateTripAsync(int userId, CreateTripDTO dto);
        Task<bool> DeleteTripAsync(int tripId);
        Task<List<TripDTO>> GetTripsForUserAsync(int userId);
        Task<TripDTO?> GetTripByIdAsync(int id, int userId);
    }
}
