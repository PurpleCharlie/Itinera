using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IRoutePointRepository
    {
        Task AddAsync(RoutePoint point);
        Task<List<RoutePoint>> GetByTripIdAsync(int tripId);
        Task SaveAsync();
    }
}
