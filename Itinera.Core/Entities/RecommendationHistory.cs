using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.Entities
{
    public class RecommendationHistory
    {
        public int Id { get; set; }
        public string Destination { get; set; }
        public int Days { get; set; }
        public string Style { get; set; }
        public string RecommendationText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Связь с поездкой
        public int TripId { get; set; }             // Внешний ключ к поездке
        public Trip Trip { get; set; }               // Навигационное свойство
    }
}
