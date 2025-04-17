using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class RoutePointService : IRoutePointService
    {
        private readonly IRoutePointRepository _routeRepo;
        private readonly ITripRepository _tripRepo;
        public RoutePointService(IRoutePointRepository routeRepo, ITripRepository tripRepo)
        {
            _routeRepo = routeRepo;
            _tripRepo = tripRepo;
        }

        public async Task<bool> AddRoutePointAsync(int tripId, CreateRoutePointDTO dto)
        {
            var trip = await _tripRepo.GetByIdAsync(tripId);
            if (trip == null)
                return false;

            var point = new RoutePoint
            {
                TripId = tripId,
                Name = dto.Name,
                Description = dto.Description,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Order = dto.Order
            };

            await _routeRepo.AddAsync(point);
            return true;

        }

        public async Task<List<RoutePointDTO>> GetRouteByTripIdAsync(int tripId)
        {
            var points = await _routeRepo.GetByTripIdAsync(tripId);

            return points.Select(p => new RoutePointDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Order = p.Order
            }).ToList();
        }
    }
}
