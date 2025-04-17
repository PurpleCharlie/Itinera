using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Entities
{
    public class Trip
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

        // Связь с пользователем (User)
        public int UserId { get; set; }
        public  User User { get; set; }

        // Связь с задачами (TripTask)
        public List<TripTask> Tasks { get; set; } = new();

        // Связь с точками маршрута (RoutePoint)
        public List<RoutePoint> RoutePoints { get; set; } = new();
    }
}
