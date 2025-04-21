using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Entities
{
    public class HotelBooking
    {
        public int Id { get; set; }
        public string HotelName { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public string Status { get; set; } = "Ожидание";

        // Связь с поездкой (Trip)
        public int TripId { get; set; }
        public Trip Trip { get; set; }
    }
}
