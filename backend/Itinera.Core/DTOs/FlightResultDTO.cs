using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class FlightResultDTO
    {
        public string From { get; set; }
        public string To { get; set; }
        public DateTime DepartureAt { get; set; }
        public string Airline { get; set; }
        public decimal Price { get; set; }

    }
}
