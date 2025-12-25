using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IRoutePointService
    {
        Task<bool> AddRoutePointAsync(int tripId, CreateRoutePointDTO dto);
        Task<string> DeleteRoutePointAsync(int tripId, int routeId);
        Task<List<RoutePointDTO>> GetRouteByTripIdAsync(int tripId);
    }
}
