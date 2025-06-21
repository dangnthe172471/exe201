
export async function getServices(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ReferenceData/services`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không lấy được danh sách dịch vụ");
    return res.json();
}

export async function getAreaSizes(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ReferenceData/areasizes`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không lấy được danh sách diện tích");
    return res.json();
}

export async function getTimeSlots(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ReferenceData/timeslots`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không lấy được danh sách khung giờ");
    return res.json();
}
