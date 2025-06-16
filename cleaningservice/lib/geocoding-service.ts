// Advanced Geocoding Service with multiple providers and intelligent fallback

export interface DetailedAddress {
  houseNumber?: string
  street?: string
  ward?: string
  district?: string
  city?: string
  province?: string
  country?: string
  formatted: string
  confidence: number
}

export interface GeocodingResult {
  success: boolean
  address: string
  detailedAddress: DetailedAddress
  district: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
  provider: string
  confidence: number
}

interface GeocodingProvider {
  name: string
  geocode: (lat: number, lng: number) => Promise<GeocodingResult | null>
}

// Nominatim Provider (OpenStreetMap)
class NominatimProvider implements GeocodingProvider {
  name = "Nominatim"

  async geocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi,en`,
        {
          headers: {
            "User-Agent": "CleaningService/1.0",
          },
        },
      )

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      if (!data || !data.address) return null

      return this.parseNominatimResponse(data, lat, lng)
    } catch (error) {
      console.error("Nominatim error:", error)
      return null
    }
  }

  private parseNominatimResponse(data: any, lat: number, lng: number): GeocodingResult {
    const addr = data.address
    const detailedAddress: DetailedAddress = {
      houseNumber: addr.house_number,
      street: addr.road || addr.pedestrian || addr.footway,
      ward: addr.suburb || addr.neighbourhood || addr.quarter || addr.village,
      district: addr.city_district || addr.county || addr.municipality || addr.town,
      city: addr.city || addr.state,
      province: addr.state || addr.province,
      country: addr.country,
      formatted: "",
      confidence: this.calculateConfidence(addr),
    }

    detailedAddress.formatted = this.formatVietnameseAddress(detailedAddress)

    return {
      success: true,
      address: detailedAddress.formatted,
      detailedAddress,
      district: detailedAddress.district || "Không xác định",
      city: detailedAddress.city || "Việt Nam",
      coordinates: { lat, lng },
      provider: this.name,
      confidence: detailedAddress.confidence,
    }
  }

  private calculateConfidence(addr: any): number {
    let confidence = 0.5
    if (addr.house_number) confidence += 0.2
    if (addr.road) confidence += 0.2
    if (addr.suburb || addr.neighbourhood) confidence += 0.1
    return Math.min(confidence, 1.0)
  }

  private formatVietnameseAddress(addr: DetailedAddress): string {
    const parts = []

    if (addr.houseNumber) parts.push(addr.houseNumber)
    if (addr.street) parts.push(addr.street)
    if (addr.ward) parts.push(addr.ward)
    if (addr.district) parts.push(addr.district)
    if (addr.city && addr.city !== addr.district) parts.push(addr.city)

    return parts.join(", ")
  }
}

// Photon Provider (Alternative free geocoding)
class PhotonProvider implements GeocodingProvider {
  name = "Photon"

  async geocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&lang=vi`)

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      if (!data.features || data.features.length === 0) return null

      return this.parsePhotonResponse(data.features[0], lat, lng)
    } catch (error) {
      console.error("Photon error:", error)
      return null
    }
  }

  private parsePhotonResponse(feature: any, lat: number, lng: number): GeocodingResult {
    const props = feature.properties
    const detailedAddress: DetailedAddress = {
      houseNumber: props.housenumber,
      street: props.street,
      ward: props.district || props.suburb,
      district: props.city || props.county,
      city: props.state,
      country: props.country,
      formatted: "",
      confidence: 0.7,
    }

    detailedAddress.formatted = this.formatAddress(detailedAddress)

    return {
      success: true,
      address: detailedAddress.formatted,
      detailedAddress,
      district: detailedAddress.district || "Không xác định",
      city: detailedAddress.city || "Việt Nam",
      coordinates: { lat, lng },
      provider: this.name,
      confidence: detailedAddress.confidence,
    }
  }

  private formatAddress(addr: DetailedAddress): string {
    const parts = []
    if (addr.houseNumber) parts.push(addr.houseNumber)
    if (addr.street) parts.push(addr.street)
    if (addr.ward) parts.push(addr.ward)
    if (addr.district) parts.push(addr.district)
    if (addr.city) parts.push(addr.city)
    return parts.join(", ")
  }
}

// LocationIQ Provider
class LocationIQProvider implements GeocodingProvider {
  name = "LocationIQ"

  async geocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
      // Using free tier without API key (limited requests)
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=demo&lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=vi`,
      )

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      if (!data || !data.address) return null

      return this.parseLocationIQResponse(data, lat, lng)
    } catch (error) {
      console.error("LocationIQ error:", error)
      return null
    }
  }

  private parseLocationIQResponse(data: any, lat: number, lng: number): GeocodingResult {
    const addr = data.address
    const detailedAddress: DetailedAddress = {
      houseNumber: addr.house_number,
      street: addr.road,
      ward: addr.suburb || addr.neighbourhood,
      district: addr.city_district || addr.county,
      city: addr.city || addr.town,
      province: addr.state,
      country: addr.country,
      formatted: "",
      confidence: 0.8,
    }

    detailedAddress.formatted = this.formatAddress(detailedAddress)

    return {
      success: true,
      address: detailedAddress.formatted,
      detailedAddress,
      district: detailedAddress.district || "Không xác định",
      city: detailedAddress.city || "Việt Nam",
      coordinates: { lat, lng },
      provider: this.name,
      confidence: detailedAddress.confidence,
    }
  }

  private formatAddress(addr: DetailedAddress): string {
    const parts = []
    if (addr.houseNumber) parts.push(addr.houseNumber)
    if (addr.street) parts.push(addr.street)
    if (addr.ward) parts.push(addr.ward)
    if (addr.district) parts.push(addr.district)
    if (addr.city) parts.push(addr.city)
    return parts.join(", ")
  }
}

// Smart Geocoding Service with multiple providers
export class SmartGeocodingService {
  private providers: GeocodingProvider[]
  private cache = new Map<string, GeocodingResult>()

  constructor() {
    this.providers = [new NominatimProvider(), new PhotonProvider(), new LocationIQProvider()]
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
    const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const results: GeocodingResult[] = []

    // Try all providers in parallel
    const promises = this.providers.map((provider) => provider.geocode(lat, lng).catch(() => null))

    const responses = await Promise.allSettled(promises)

    responses.forEach((response, index) => {
      if (response.status === "fulfilled" && response.value) {
        results.push(response.value)
      }
    })

    // Choose the best result based on confidence and completeness
    const bestResult = this.selectBestResult(results, lat, lng)

    // Cache the result
    this.cache.set(cacheKey, bestResult)

    return bestResult
  }

  private selectBestResult(results: GeocodingResult[], lat: number, lng: number): GeocodingResult {
    if (results.length === 0) {
      return this.createFallbackResult(lat, lng)
    }

    // Sort by confidence and address completeness
    results.sort((a, b) => {
      const scoreA = this.calculateResultScore(a)
      const scoreB = this.calculateResultScore(b)
      return scoreB - scoreA
    })

    // Enhance the best result with data from other results
    const bestResult = results[0]
    const enhancedResult = this.enhanceResult(bestResult, results.slice(1))

    return enhancedResult
  }

  private calculateResultScore(result: GeocodingResult): number {
    let score = result.confidence

    // Bonus for having detailed address components
    if (result.detailedAddress.houseNumber) score += 0.2
    if (result.detailedAddress.street) score += 0.2
    if (result.detailedAddress.ward) score += 0.1
    if (result.detailedAddress.district) score += 0.1

    // Bonus for longer formatted address (more detail)
    score += Math.min(result.address.length / 100, 0.2)

    return score
  }

  private enhanceResult(primary: GeocodingResult, alternatives: GeocodingResult[]): GeocodingResult {
    const enhanced = { ...primary }

    // Fill in missing details from alternative results
    for (const alt of alternatives) {
      if (!enhanced.detailedAddress.houseNumber && alt.detailedAddress.houseNumber) {
        enhanced.detailedAddress.houseNumber = alt.detailedAddress.houseNumber
      }
      if (!enhanced.detailedAddress.street && alt.detailedAddress.street) {
        enhanced.detailedAddress.street = alt.detailedAddress.street
      }
      if (!enhanced.detailedAddress.ward && alt.detailedAddress.ward) {
        enhanced.detailedAddress.ward = alt.detailedAddress.ward
      }
    }

    // Reformat the address with enhanced details
    enhanced.detailedAddress.formatted = this.formatEnhancedAddress(enhanced.detailedAddress)
    enhanced.address = enhanced.detailedAddress.formatted

    return enhanced
  }

  private formatEnhancedAddress(addr: DetailedAddress): string {
    const parts = []

    if (addr.houseNumber) parts.push(addr.houseNumber)
    if (addr.street) {
      // Clean up street names
      let street = addr.street
      if (!street.toLowerCase().includes("phố") && !street.toLowerCase().includes("đường")) {
        street = `Phố ${street}`
      }
      parts.push(street)
    }
    if (addr.ward) {
      let ward = addr.ward
      if (!ward.toLowerCase().includes("phường") && !ward.toLowerCase().includes("xã")) {
        ward = `Phường ${ward}`
      }
      parts.push(ward)
    }
    if (addr.district) parts.push(addr.district)
    if (addr.city && addr.city !== addr.district) parts.push(addr.city)

    return parts.join(", ")
  }

  private createFallbackResult(lat: number, lng: number): GeocodingResult {
    // Create a basic result based on coordinates
    const district = this.guessDistrictFromCoordinates(lat, lng)

    return {
      success: false,
      address: `Vị trí ${lat.toFixed(6)}, ${lng.toFixed(6)} - ${district}, Hà Nội`,
      detailedAddress: {
        district,
        city: "Hà Nội",
        formatted: `${district}, Hà Nội`,
        confidence: 0.3,
      },
      district,
      city: "Hà Nội",
      coordinates: { lat, lng },
      provider: "Fallback",
      confidence: 0.3,
    }
  }

  private guessDistrictFromCoordinates(lat: number, lng: number): string {
    // Simple district guessing based on coordinate ranges for Hanoi
    const districts = [
      { name: "Quận Ba Đình", bounds: { n: 21.045, s: 21.02, e: 105.83, w: 105.8 } },
      { name: "Quận Hoàn Kiếm", bounds: { n: 21.04, s: 21.015, e: 105.865, w: 105.84 } },
      { name: "Quận Tây Hồ", bounds: { n: 21.09, s: 21.05, e: 105.84, w: 105.8 } },
      { name: "Quận Long Biên", bounds: { n: 21.07, s: 21.03, e: 105.91, w: 105.86 } },
      { name: "Quận Cầu Giấy", bounds: { n: 21.055, s: 21.015, e: 105.815, w: 105.775 } },
      { name: "Quận Đống Đa", bounds: { n: 21.035, s: 20.995, e: 105.85, w: 105.81 } },
    ]

    for (const district of districts) {
      if (
        lat >= district.bounds.s &&
        lat <= district.bounds.n &&
        lng >= district.bounds.w &&
        lng <= district.bounds.e
      ) {
        return district.name
      }
    }

    return "Hà Nội"
  }
}

// Export singleton instance
export const geocodingService = new SmartGeocodingService()
