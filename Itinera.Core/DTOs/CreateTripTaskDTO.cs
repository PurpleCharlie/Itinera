using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Core.DTOs
{
    public class CreateTripTaskDTO
    {
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
    }
}
