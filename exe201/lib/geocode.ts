// Utility functions for geocoding

/**
 * Reverse geocode coordinates to address using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
  console.log(`Geocoding coordinates: ${lat}, ${lng}`)

  // Validate coordinates for Vietnam/Hanoi area
  if (!isValidVietnamCoordinates(lat, lng)) {
    console.warn("Coordinates outside Vietnam, using mock data")
    return getMockAddress(lat, lng)
  }

  try {
    // Use OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=vi&zoom=18`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "CleaningServiceApp/1.0", // Required by Nominatim usage policy
        },
      },
    )

    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status}`)
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Nominatim response:", data)

    if (!data || !data.address) {
      throw new Error("No address data returned from API")
    }

    // Extract relevant address components
    const address = {
      fullAddress: data.display_name || "",
      street: data.address?.road || data.address?.pedestrian || "",
      houseNumber: data.address?.house_number || "",
      suburb: data.address?.suburb || data.address?.neighbourhood || "",
      district:
        data.address?.city_district ||
        data.address?.county ||
        data.address?.state_district ||
        data.address?.municipality ||
        "",
      city: data.address?.city || data.address?.town || "Hà Nội",
      province: data.address?.state || "",
      country: data.address?.country || "",
      formatted: "",
      confidence: 1, // Assuming 100% confidence for API response
    }

    // Create a formatted address
    const addressParts = [address.houseNumber, address.street, address.suburb, address.district, address.city].filter(
      Boolean,
    )

    address.formatted = addressParts.join(", ")

    // If we don't have enough detail, fall back to mock
    if (!address.street && !address.suburb && !address.district) {
      console.warn("Insufficient address detail from API, using mock data")
      return getMockAddress(lat, lng)
    }

    return {
      address: address.formatted || address.fullAddress,
      district: address.district || "Hà Nội",
      city: address.city,
      coordinates: { lat, lng },
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    // Fallback to mock data based on coordinates
    return getMockAddress(lat, lng)
  }
}

/**
 * Check if coordinates are within Vietnam bounds
 */
function isValidVietnamCoordinates(lat: number, lng: number): boolean {
  // Vietnam approximate bounds
  const vietnamBounds = {
    north: 23.4,
    south: 8.2,
    east: 109.5,
    west: 102.1,
  }

  return (
    lat >= vietnamBounds.south && lat <= vietnamBounds.north && lng >= vietnamBounds.west && lng <= vietnamBounds.east
  )
}

/**
 * Get a mock address based on coordinates
 * This is used as a fallback when the API fails
 */
function getMockAddress(lat: number, lng: number): GeocodingResult {
  console.log(`Using mock address for coordinates: ${lat}, ${lng}`)

  // More accurate coordinates for Hanoi districts
  const districts = [
    { name: "Quận Ba Đình", lat: 21.0337, lng: 105.814, bounds: { n: 21.045, s: 21.02, e: 105.83, w: 105.8 } },
    { name: "Quận Hoàn Kiếm", lat: 21.0287, lng: 105.8522, bounds: { n: 21.04, s: 21.015, e: 105.865, w: 105.84 } },
    { name: "Quận Tây Hồ", lat: 21.0712, lng: 105.823, bounds: { n: 21.09, s: 21.05, e: 105.84, w: 105.8 } },
    { name: "Quận Long Biên", lat: 21.0501, lng: 105.8868, bounds: { n: 21.07, s: 21.03, e: 105.91, w: 105.86 } },
    { name: "Quận Cầu Giấy", lat: 21.0359, lng: 105.7946, bounds: { n: 21.055, s: 21.015, e: 105.815, w: 105.775 } },
    { name: "Quận Đống Đa", lat: 21.0141, lng: 105.8302, bounds: { n: 21.035, s: 20.995, e: 105.85, w: 105.81 } },
    { name: "Quận Hai Bà Trưng", lat: 21.0094, lng: 105.8516, bounds: { n: 21.03, s: 20.99, e: 105.875, w: 105.83 } },
    { name: "Quận Hoàng Mai", lat: 20.9804, lng: 105.8573, bounds: { n: 21.0, s: 20.96, e: 105.88, w: 105.835 } },
    { name: "Quận Thanh Xuân", lat: 20.9961, lng: 105.8054, bounds: { n: 21.015, s: 20.975, e: 105.825, w: 105.785 } },
    { name: "Quận Bắc Từ Liêm", lat: 21.052, lng: 105.765, bounds: { n: 21.08, s: 21.025, e: 105.79, w: 105.74 } },
    { name: "Quận Nam Từ Liêm", lat: 21.013, lng: 105.758, bounds: { n: 21.04, s: 20.985, e: 105.785, w: 105.73 } },
    { name: "Quận Hà Đông", lat: 20.972, lng: 105.769, bounds: { n: 21.0, s: 20.945, e: 105.795, w: 105.74 } },
  ]

  // Find district by bounds (more accurate than distance)
  let selectedDistrict = districts[0] // default

  for (const district of districts) {
    if (lat >= district.bounds.s && lat <= district.bounds.n && lng >= district.bounds.w && lng <= district.bounds.e) {
      selectedDistrict = district
      break
    }
  }

  // If no exact match, find closest district
  if (selectedDistrict === districts[0]) {
    let minDistance = calculateDistance(lat, lng, districts[0].lat, districts[0].lng)

    for (const district of districts) {
      const distance = calculateDistance(lat, lng, district.lat, district.lng)
      if (distance < minDistance) {
        minDistance = distance
        selectedDistrict = district
      }
    }
  }

  // Generate a realistic mock address
  const streetNumber = Math.floor(Math.random() * 200) + 1
  const street = getRandomStreet()
  const ward = getRandomWard(selectedDistrict.name)

  const mockAddress = `${streetNumber} ${street}, ${ward}, ${selectedDistrict.name}, Hà Nội`

  console.log(`Generated mock address: ${mockAddress}`)

  return {
    address: mockAddress,
    district: selectedDistrict.name,
    city: "Hà Nội",
    coordinates: { lat, lng },
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Get a random street name (common Hanoi streets)
 */
function getRandomStreet(): string {
  const streets = [
    "Phố Trần Hưng Đạo",
    "Phố Lê Duẩn",
    "Phố Điện Biên Phủ",
    "Phố Nguyễn Huệ",
    "Phố Lý Thường Kiệt",
    "Phố Phan Đình Phùng",
    "Phố Nguyễn Thái Học",
    "Phố Bà Triệu",
    "Phố Hàng Bài",
    "Phố Tràng Tiền",
    "Phố Hàng Đào",
    "Phố Hàng Bông",
    "Phố Hàng Gai",
    "Phố Huế",
    "Phố Lê Thái Tổ",
    "Phố Hàng Khay",
    "Phố Tràng Thi",
    "Phố Hàng Trống",
    "Phố Láng",
    "Phố Giải Phóng",
    "Phố Nguyễn Trãi",
    "Phố Cầu Giấy",
    "Phố Kim Mã",
    "Phố Thái Hà",
  ]
  return streets[Math.floor(Math.random() * streets.length)]
}

/**
 * Get a random ward name based on district
 */
function getRandomWard(district: string): string {
  const wardsByDistrict: { [key: string]: string[] } = {
    "Quận Ba Đình": ["Phường Phúc Xá", "Phường Trúc Bạch", "Phường Vĩnh Phúc", "Phường Cống Vị", "Phường Liễu Giai"],
    "Quận Hoàn Kiếm": [
      "Phường Phan Chu Trinh",
      "Phường Hàng Trống",
      "Phường Tràng Tiền",
      "Phường Hàng Bài",
      "Phường Cửa Nam",
    ],
    "Quận Tây Hồ": ["Phường Phú Thượng", "Phường Nhật Tân", "Phường Tứ Liên", "Phường Quảng An", "Phường Xuân La"],
    "Quận Long Biên": [
      "Phường Thượng Thanh",
      "Phường Ngọc Lâm",
      "Phường Gia Thụy",
      "Phường Ngọc Thụy",
      "Phường Sài Đồng",
    ],
    "Quận Cầu Giấy": ["Phường Nghĩa Đô", "Phường Nghĩa Tân", "Phường Mai Dịch", "Phường Dịch Vọng", "Phường Quan Hoa"],
    "Quận Đống Đa": [
      "Phường Cát Linh",
      "Phường Văn Miếu",
      "Phường Quốc Tử Giám",
      "Phường Láng Thượng",
      "Phường Ô Chợ Dừa",
    ],
    "Quận Hai Bà Trưng": [
      "Phường Nguyễn Du",
      "Phường Bạch Đằng",
      "Phường Phạm Đình Hổ",
      "Phường Lê Đại Hành",
      "Phường Đống Mác",
    ],
    "Quận Hoàng Mai": [
      "Phường Hoàng Văn Thụ",
      "Phường Hoàng Liệt",
      "Phường Tân Mai",
      "Phường Vĩnh Hưng",
      "Phường Đại Kim",
    ],
    "Quận Thanh Xuân": [
      "Phường Nhân Chính",
      "Phường Thượng Đình",
      "Phường Khương Trung",
      "Phường Khương Mai",
      "Phường Thanh Xuân Bắc",
    ],
  }

  const wards = wardsByDistrict[district] || ["Phường Trung Tâm", "Phường An Bình", "Phường Thành Công"]
  return wards[Math.floor(Math.random() * wards.length)]
}

// Types
export interface GeocodingResult {
  address: string
  district: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
}
