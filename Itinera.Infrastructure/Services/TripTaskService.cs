using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class TripTaskService : ITripTaskService
    {
        private readonly ITripTaskRepository _taskRepo;
        private readonly ITripRepository _tripRepo;
        public TripTaskService(ITripTaskRepository taskRepo, ITripRepository tripRepo)
        {
            _taskRepo = taskRepo;
            _tripRepo = tripRepo;
        }

        public async Task<bool> AddTaskToTripAsync(int tripId, CreateTripTaskDTO dto)
        {
            var trip = await _tripRepo.GetByIdAsync(tripId);
            if (trip == null)
                return false;

            var task = new TripTask
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                TripId = tripId
            };

            await _taskRepo.AddAsync(task);
            return true;
        }

        public async Task<List<TripTaskDTO>> GetTasksByTripAsync(int tripId)
        {
            var tasks = await _taskRepo.GetByTripIdAsync(tripId);

            return tasks.Select(t => new TripTaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted
            }).ToList();
        }

        public async Task<bool> ToggleTaskStatusAsync(int tripId, int taskId)
        {
            var task = await _taskRepo.GetByIdAsync(taskId);
            if (task == null)
                return false;

            if (task.TripId != tripId)
                return false;

            task.IsCompleted = !task.IsCompleted;
            await _taskRepo.SaveAsync();

            return true;
        }
    }
}
