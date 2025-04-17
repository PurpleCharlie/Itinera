using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface ITripTaskRepository
    {
        Task AddAsync(TripTask tripTask);
        Task<List<TripTask>> GetByTripIdAsync(int tripId);
        Task<TripTask> GetByIdAsync(int taskId);
        Task SaveAsync();
    }
}
