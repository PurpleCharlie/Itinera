using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Entities
{
    public class TripTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public bool IsCompleted { get; set; } = false;
        public DateTime? DueDate { get; set; }

        // Связь с поездкой (Trip)
        public int TripId { get; set; }
        public Trip? Trip { get; set; }
    }
}
