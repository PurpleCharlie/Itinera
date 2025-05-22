using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IFlightSearchService
    {
        Task<List<FlightResultDTO>> SearchFlightsAsync(string from, string to, string departDate);
    }
}
