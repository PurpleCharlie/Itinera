using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class UpdateUserProfileDTO
    {
        public string Username { get; set; }
        public string? CurrentCity { get; set; }
        public string? Interests { get; set; }
        public string? TravelStyle { get; set; }
    }
}
