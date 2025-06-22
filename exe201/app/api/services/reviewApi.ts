export interface CreateReviewRequest {
    bookingId: number;
    rating: number;
    comment?: string;
}

export interface ReviewResponse {
    id: number;
    bookingId: number;
    userId: number;
    userName: string;
    cleanerId: number;
    cleanerName: string;
    rating: number;
    comment?: string;
    createdAt?: string;
}

export const reviewApi = {
    // Tạo đánh giá mới
    createReview: async (data: CreateReviewRequest, token: string): Promise<ReviewResponse> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            let message = "Tạo đánh giá thất bại";
            try {
                const errorData = await response.json();
                message = errorData.message || message;
            } catch (_) { }
            throw new Error(message);
        }

        return response.json();
    },

    // Kiểm tra user đã đánh giá booking chưa
    checkUserReviewedBooking: async (bookingId: number, token: string): Promise<boolean> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/check/${bookingId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            let message = "Kiểm tra đánh giá thất bại";
            try {
                const errorData = await response.json();
                message = errorData.message || message;
            } catch (_) { }
            throw new Error(message);
        }

        return response.json();
    },

    // Lấy đánh giá theo booking ID
    getReviewByBookingId: async (bookingId: number, token: string): Promise<ReviewResponse | null> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/booking/${bookingId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                let message = "Lấy đánh giá thất bại";
                try {
                    const errorData = await response.json();
                    message = errorData.message || message;
                } catch (_) { }
                throw new Error(message);
            }

            return response.json();
        } catch (error: any) {
            if (error.message.includes("404")) {
                return null;
            }
            throw error;
        }
    },

    // Sửa đánh giá
    updateReview: async (bookingId: number, data: { rating: number; comment?: string }, token: string): Promise<ReviewResponse> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/${bookingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let message = "Sửa đánh giá thất bại";
            try {
                const errorData = await response.json();
                message = errorData.message || message;
            } catch (_) { }
            throw new Error(message);
        }
        return response.json();
    },
}; 