using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IBookingService
    {
        Task<bool> BookHotelAsync(int tripId, CreateHotelBookingDTO dto);
        Task<bool> BookFlightAsync(int tripId, CreateFlightBookingDTO dto);
    }
}
