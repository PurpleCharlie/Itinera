﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Itinera.API.Controllers
{
    [Route("api/trips/{tripId}/route")]
    [ApiController]
    [Authorize]
    public class RoutePointController : ControllerBase
    {
        private readonly IRoutePointService _routeService;
        public RoutePointController(IRoutePointService routService)
        {
            _routeService = routService;
        }

        [HttpPost]
        public async Task<IActionResult> AddPoint(int tripId, CreateRoutePointDTO dto)
        {
            var isSuccess = await _routeService.AddRoutePointAsync(tripId, dto);
            return isSuccess ? Ok("Точка добавлена") : NotFound("Поездка не найдена");
        }

        [HttpDelete("{routeId:int}")]
        public async Task<IActionResult> DeletePoint(int tripId, int routeId)
        {
            var result = await _routeService.DeleteRoutePointAsync(tripId, routeId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetRoute(int tripId)
        {
            var points = await _routeService.GetRouteByTripIdAsync(tripId);
            return Ok(points);
        }


    }
}
