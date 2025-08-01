﻿using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Review
{
    public int Id { get; set; }

    public int BookingId { get; set; }

    public int UserId { get; set; }

    public int CleanerId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual User Cleaner { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
