using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class HotelResultDTO
    {
        public string HotelId { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public decimal PriceFrom { get; set; }
        public int Stars { get; set; }
    }
}
