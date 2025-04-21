using Itinera.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _context;
        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> BookHotelAsync(int tripId, CreateHotelBookingDTO dto)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return false;

            var booking = new HotelBooking
            {
                TripId = tripId,
                HotelName = dto.HotelName,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                Status = "Ожидание"
            };

            _context.HotelBookings.Add(booking);
            await _context.SaveChangesAsync();
            return true;
        }

        public  async Task<bool> BookFlightAsync(int tripId, CreateFlightBookingDTO dto)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return false;

            var booking = new FlightBooking
            {
                TripId = tripId,
                From = dto.From,
                To = dto.To,
                DepatureDate = dto.DepartureDate,
                Airline = dto.Airline,
                Status = "Ожидание"
            };

            _context.FlightBookings.Add(booking);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
