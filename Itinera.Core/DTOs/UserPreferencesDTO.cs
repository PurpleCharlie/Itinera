using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class UserPreferencesDTO
    {
        public string Destination { get; set; } = null!;
        public int Days { get; set; }
        public string Style { get; set; } = null!;
        public string Interests { get; set; } = null!;
        public string BudgetLevel { get; set; } = null!;
    }
}
