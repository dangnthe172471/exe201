using Exe201_API.DTOs;
using Exe201_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Collections.Generic;

namespace Exe201_API.Services
{
    public class BookingService : IBookingService
    {
        private readonly CareUContext _context;

        public BookingService(CareUContext context)
        {
            _context = context;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId)
        {
            var service = await _context.Services.FindAsync(request.ServiceId);
            if (service == null) throw new ArgumentException("Dịch vụ không tồn tại.");

            var areaSize = await _context.AreaSizes.FindAsync(request.AreaSizeId);
            if (areaSize == null) throw new ArgumentException("Kích thước khu vực không tồn tại.");
            
            var timeSlot = await _context.TimeSlots.FindAsync(request.TimeSlotId);
            if (timeSlot == null) throw new ArgumentException("Khung giờ không tồn tại.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new ArgumentException("Người dùng không tồn tại.");

            var totalPrice = service.BasePrice * areaSize.Multiplier;
            var fullAddress = $"{request.AddressDetail}, {request.AddressDistrict}";

            var booking = new Booking
            {
                UserId = userId,
                ServiceId = request.ServiceId,
                AreaSizeId = request.AreaSizeId,
                TimeSlotId = request.TimeSlotId,
                BookingDate = request.BookingDate,
                Address = fullAddress,
                ContactName = request.ContactName,
                ContactPhone = request.ContactPhone,
                Notes = request.Notes,
                TotalPrice = totalPrice,
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            
            return new BookingResponseDto
            {
                Id = booking.Id,
                UserName = user.Name,
                ServiceName = service.Name,
                AreaSizeName = areaSize.Name,
                TimeSlotRange = timeSlot.TimeRange,
                BookingDate = booking.BookingDate,
                Address = booking.Address,
                ContactName = booking.ContactName,
                ContactPhone = booking.ContactPhone,
                Notes = booking.Notes,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                CleanerName = null,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(int userId, string? status)
        {
            var query = _context.Bookings
                .Where(b => b.UserId == userId);
            
            if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
            {
                query = query.Where(b => b.Status.ToLower() == status.ToLower());
            }

            return await query
                .Include(b => b.User)
                .Include(b => b.Service)
                .Include(b => b.AreaSize)
                .Include(b => b.TimeSlot)
                .Include(b => b.Cleaner)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BookingResponseDto
                {
                    Id = b.Id,
                    UserName = b.User.Name,
                    ServiceName = b.Service.Name,
                    AreaSizeName = b.AreaSize.Name,
                    TimeSlotRange = b.TimeSlot.TimeRange,
                    BookingDate = b.BookingDate,
                    Address = b.Address,
                    ContactName = b.ContactName,
                    ContactPhone = b.ContactPhone,
                    Notes = b.Notes,
                    TotalPrice = b.TotalPrice,
                    Status = b.Status,
                    CleanerName = b.Cleaner != null ? b.Cleaner.Name : "Chưa có",
                    CreatedAt = b.CreatedAt
                }).ToListAsync();
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(int userId)
        {
            var userBookings = _context.Bookings.Where(b => b.UserId == userId);

            var stats = new DashboardStatsDto
            {
                TotalBookings = await userBookings.CountAsync(),
                PendingBookings = await userBookings.CountAsync(b => b.Status.ToLower() == "pending" || b.Status.ToLower() == "confirmed"),
                CompletedBookings = await userBookings.CountAsync(b => b.Status.ToLower() == "completed"),
                TotalSpent = await userBookings.Where(b => b.Status.ToLower() == "completed").SumAsync(b => b.TotalPrice)
            };

            return stats;
        }
    }
} 