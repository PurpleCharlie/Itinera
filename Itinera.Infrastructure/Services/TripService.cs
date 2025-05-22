using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class TripService : ITripService
    {
        private readonly ITripRepository _repository;
        /// <summary>
        /// Внедрение зависимостей
        /// </summary>
        /// <param name="repository"></param>
        public TripService(ITripRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> CreateTripAsync(int userId, CreateTripDTO dto)
        {
            var trip = new Trip
            {
                Title = dto.Title,
                Description = dto.Description,
                DateFrom = dto.DateFrom,
                DateTo = dto.DateTo,
                UserId = userId
            };

            await _repository.AddAsync(trip);
            return true;
        }

        public async Task<bool> DeleteTripAsync(int tripId)
        {
            await _repository.DeleteAsync(tripId);
            return true;
        }

        public async Task<TripDTO?> GetTripByIdAsync(int id, int userId)
        {
            var trip = await _repository.GetByIdAsync(id);
            if (trip == null || trip.UserId != userId)
                return null;

            return new TripDTO
            {
                Id = trip.Id,
                Title = trip.Title,
                Description = trip.Description,
                DateFrom = trip.DateFrom,
                DateTo = trip.DateTo
            };
        }

        public async Task<List<TripDTO>> GetTripsForUserAsync(int userId)
        {
            var trips = await _repository.GetTripsByUserIdAsync(userId);

            return trips.Select(t => new TripDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DateFrom = t.DateFrom,
                DateTo = t.DateTo
            }).ToList();
        }
    }
}
