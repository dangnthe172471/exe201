export type CreateBookingRequestDto = {
    serviceId: number
    areaSizeId: number
    timeSlotId: number
    bookingDate: string // dạng "yyyy-MM-dd"
    addressDistrict: string
    addressDetail: string
    contactName: string
    contactPhone: string
    notes?: string
}

export async function createBooking(data: CreateBookingRequestDto, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        let message = "Tạo booking thất bại"
        try {
            const errorData = await res.json()
            message = errorData.message || message
        } catch (_) { }
        console.log("Sending token:", token)

        throw new Error(message)
    }

    return await res.json()
}

// Hàm gọi API lấy danh sách booking của user
export async function getUserBookings(token: string, status: string = "all") {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings?status=${status}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        let message = "Lấy booking thất bại"
        try {
            const errorData = await res.json()
            message = errorData.message || message
        } catch (_) { }
        throw new Error(message)
    }

    return await res.json()
}

// Hàm gọi API lấy thống kê dashboard
export async function getDashboardStats(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/dashboard-stats`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        let message = "Lấy thống kê thất bại"
        try {
            const errorData = await res.json()
            message = errorData.message || message
        } catch (_) { }
        throw new Error(message)
    }
    return await res.json()
}

