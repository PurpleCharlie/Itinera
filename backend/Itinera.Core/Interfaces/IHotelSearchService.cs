using Itinera.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Interfaces
{
    public interface IHotelSearchService
    {
        Task<List<HotelResultDTO>> SearchHotelsAsync(string city, DateTime checkIn, DateTime checkOut);
    }
}
