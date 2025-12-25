using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface ITripTaskService
    {
        Task<bool> AddTaskToTripAsync(int tripId, CreateTripTaskDTO dto);
        Task<bool> DeleteTaskToTripAsync(int tripId, int taskId);
        Task<List<TripTaskDTO>> GetTasksByTripAsync(int tripId);
        Task<bool> ToggleTaskStatusAsync(int tripId, int taskId);
    }
}
