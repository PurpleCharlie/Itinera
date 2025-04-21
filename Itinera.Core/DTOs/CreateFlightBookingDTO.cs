using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class CreateFlightBookingDTO
    {
        public string From { get; set; } = null!;
        public string To { get; set; } = null!;
        public DateTime DepartureDate { get; set; }
        public string Airline { get; set; } = null!;
    }
}
