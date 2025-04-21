global using Itinera.Core.Entities;
global using Itinera.Core.Interfaces;
global using Itinera.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripTask> TripTasks { get; set; }
        public DbSet<RoutePoint> RoutePoints { get; set; }
        public DbSet<HotelBooking> HotelBookings { get; set; }
        public DbSet<FlightBooking> FlightBookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
