using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Entities
{
    public class FlightBooking
    {
        public int Id { get; set; }
        public string From { get; set; } = null!;
        public string To { get; set; } = null!;
        public DateTime DepatureDate { get; set; }
        public string Airline { get; set; } = null!;
        public string Status { get; set; } = "Ожидание";
        public decimal Price { get; set; }

        // Связь с поездкой (Trip)
        public int TripId { get; set; }
        public Trip Trip { get; set; }
    }
}
