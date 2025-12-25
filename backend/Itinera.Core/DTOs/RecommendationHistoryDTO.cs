using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class RecommendationHistoryDTO
    {
        public int Id { get; set; }
        public string Destination { get; set; }
        public string RecommendationText { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Days { get; set; }
        public string Style { get; set; }
    }
}
