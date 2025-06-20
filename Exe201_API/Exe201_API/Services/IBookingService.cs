using Exe201_API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Exe201_API.Services
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId);
        Task<IEnumerable<BookingResponseDto>> GetUserBookingsAsync(int userId, string? status);
        Task<DashboardStatsDto> GetDashboardStatsAsync(int userId);
    }
} 