import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })
    }

    console.log(`Geocoding coordinates: ${lat}, ${lng}`)

    // Sử dụng Nominatim (OpenStreetMap) để lấy thông tin cơ bản
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&accept-language=vi`,
      {
        headers: {
          "User-Agent": "CleaningService/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Nominatim response:", data)

    if (!data || !data.address) {
      return NextResponse.json({ error: "No address found" }, { status: 404 })
    }

    const address = data.address

    // Lấy thông tin cơ bản: quận/huyện và tỉnh/thành phố
    const district = address.city_district || address.district || address.county || address.suburb || address.town || ""

    const city = address.city || address.state || address.province || ""

    // Tạo địa chỉ đơn giản
    const simpleAddress = [district, city].filter(Boolean).join(", ")

    const result = {
      address: simpleAddress,
      district: district,
      city: city,
      coordinates: {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      },
    }

    console.log("Final result:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Failed to geocode location" }, { status: 500 })
  }
}
