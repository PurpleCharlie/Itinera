using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/trips/{tripId:int}/tasks")]
    [ApiController]
    [Authorize]
    public class TripTaskController : ControllerBase
    {
        private readonly ITripTaskService _taskService;
        public TripTaskController(ITripTaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        public async Task<IActionResult> AddTask(int tripId, CreateTripTaskDTO dto)
        {
            var isSuccess = await _taskService.AddTaskToTripAsync(tripId, dto);

            return isSuccess ? Ok("Задача добавлена") : NotFound("Поездка не найдена");
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks(int tripId)
        {
            var tasks = await _taskService.GetTasksByTripAsync(tripId);
            return Ok(tasks);
        }

        [HttpPost("{taskId}/toggle")]
        public async Task<IActionResult> ToggleStatus(int tripId, int taskId)
        {
            var isSuccess = await _taskService.ToggleTaskStatusAsync(tripId, taskId);
            return isSuccess ? Ok("Статус изменен") : NotFound("Задача не найдена");
        }
    }
}
