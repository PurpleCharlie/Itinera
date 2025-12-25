using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Entities
{
    public class RoutePoint
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public int Order { get; set; }  // порядок точки в маршруте

        // Связь с поездкой (Trip)
        public int TripId { get; set; }
        public Trip Trip { get; set; }

    }
}
