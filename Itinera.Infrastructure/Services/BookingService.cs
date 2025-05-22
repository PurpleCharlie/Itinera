using Itinera.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Itinera.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _context;
        private readonly IEmailSender _email;
        public BookingService(AppDbContext context, IEmailSender email)
        {
            _context = context;
            _email = email;
        }

        public async Task<bool> BookHotelAsync(int tripId, CreateHotelBookingDTO dto, string email)
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

            if (!string.IsNullOrEmpty(email))
            {
              await _email.SendEmailAsync(
                  toEmail: email,
                  subject: "Подтверждение бронирования отеля",
                  body: $"Вы забронировали отель {dto.HotelName} с {dto.CheckIn:dd.MM.yyyy} по {dto.CheckOut:dd.MM.yyyy}");
            }
            return true;
        }

        public  async Task<bool> BookFlightAsync(int tripId, CreateFlightBookingDTO dto, string email)
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

            if(!string.IsNullOrEmpty(email))
            {
              await _email.SendEmailAsync(
                toEmail: email,
                subject: "Подтверждение бронирования рейса",
                body: $"Вы забронировали рейс компанией {dto.Airline} на {dto.DepartureDate}. Летите из {dto.From} в {dto.To}"
                );
            }
            
            return true;
        }
    }
}
