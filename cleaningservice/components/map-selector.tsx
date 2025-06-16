"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Loader2, Navigation } from "lucide-react"
import type { GeocodingResult } from "@/lib/geocode"

interface MapSelectorProps {
  onLocationSelect: (location: GeocodingResult) => void
  currentLocation?: GeocodingResult | null
}

export default function MapSelector({ onLocationSelect, currentLocation }: MapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Use refs to store map instances
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerInstanceRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const isMapInitializedRef = useRef(false)

  // Load Leaflet when dialog opens
  useEffect(() => {
    if (isOpen && !leafletRef.current) {
      const loadLeaflet = async () => {
        try {
          console.log("Loading Leaflet...")

          // Load Leaflet CSS and wait for it
          const loadCSS = () => {
            return new Promise<void>((resolve) => {
              if (document.querySelector('link[href*="leaflet"]')) {
                resolve()
                return
              }

              const link = document.createElement("link")
              link.rel = "stylesheet"
              link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
              link.onload = () => resolve()
              link.onerror = () => resolve() // Continue even if CSS fails
              document.head.appendChild(link)
            })
          }

          await loadCSS()
          console.log("Leaflet CSS loaded")

          // Load Leaflet JS
          const L = await import("leaflet")
          console.log("Leaflet JS loaded")

          // Fix default markers
          delete (L as any).Icon.Default.prototype._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          })

          leafletRef.current = L
          setLeafletLoaded(true)
          console.log("Leaflet setup complete")
        } catch (error) {
          console.error("Error loading Leaflet:", error)
          setMapLoading(false)
        }
      }

      loadLeaflet()
    }
  }, [isOpen])

  // Initialize map when everything is ready
  useEffect(() => {
    if (isOpen && leafletLoaded && mapRef.current && !isMapInitializedRef.current) {
      console.log("Initializing map...")

      // Wait a bit more to ensure DOM is fully ready
      const timer = setTimeout(() => {
        initializeMap()
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [isOpen, leafletLoaded])

  const initializeMap = useCallback(() => {
    if (!leafletRef.current || !mapRef.current || isMapInitializedRef.current) {
      console.log("Map initialization skipped - conditions not met")
      return
    }

    try {
      console.log("Creating map instance...")
      const L = leafletRef.current

      // Default to Hanoi center
      const defaultLat = currentLocation?.coordinates.lat || 21.0285
      const defaultLng = currentLocation?.coordinates.lng || 105.8542

      // Create map
      const newMap = L.map(mapRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      })

      console.log("Map created, adding tiles...")

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(newMap)

      // Add marker if current location exists
      if (currentLocation) {
        console.log("Adding current location marker...")
        const newMarker = L.marker([currentLocation.coordinates.lat, currentLocation.coordinates.lng], {
          draggable: true,
        }).addTo(newMap)

        newMarker.on("dragend", (e: any) => {
          const position = e.target.getLatLng()
          setSelectedPosition({ lat: position.lat, lng: position.lng })
        })

        markerInstanceRef.current = newMarker
        setSelectedPosition({ lat: currentLocation.coordinates.lat, lng: currentLocation.coordinates.lng })
      }

      // Add click handler
      newMap.on("click", (e: any) => {
        console.log("Map clicked at:", e.latlng)
        const { lat, lng } = e.latlng

        setSelectedPosition({ lat, lng })

        // Remove existing marker
        if (markerInstanceRef.current) {
          newMap.removeLayer(markerInstanceRef.current)
        }

        // Add new marker
        const newMarker = L.marker([lat, lng], {
          draggable: true,
        }).addTo(newMap)

        newMarker.on("dragend", (dragEvent: any) => {
          const position = dragEvent.target.getLatLng()
          setSelectedPosition({ lat: position.lat, lng: position.lng })
        })

        markerInstanceRef.current = newMarker
      })

      // Wait for map to be ready
      newMap.whenReady(() => {
        console.log("Map is ready!")
        setMapLoading(false)
      })

      // Force invalidate size after a short delay
      setTimeout(() => {
        newMap.invalidateSize()
        console.log("Map size invalidated")
      }, 300)

      mapInstanceRef.current = newMap
      isMapInitializedRef.current = true
      console.log("Map initialization complete")
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapLoading(false)
    }
  }, [currentLocation])

  // Cleanup when dialog closes
  useEffect(() => {
    if (!isOpen && isMapInitializedRef.current) {
      console.log("Cleaning up map...")

      // Clean up map
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off()
          mapInstanceRef.current.remove()
        } catch (error) {
          console.warn("Error cleaning up map:", error)
        }
        mapInstanceRef.current = null
      }

      // Clean up marker
      markerInstanceRef.current = null

      // Reset states
      isMapInitializedRef.current = false
      setMapLoading(true)
      setSelectedPosition(null)
      setLeafletLoaded(false)
      leafletRef.current = null
    }
  }, [isOpen])

  const handleConfirmLocation = async () => {
    if (!selectedPosition) return

    setIsLoading(true)

    try {
      console.log("Confirming location:", selectedPosition)

      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: selectedPosition.lat,
          lng: selectedPosition.lng,
        }),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log("Geocoding result:", result)

      if (result.error) {
        throw new Error(result.error)
      }

      // Call the callback with the result
      onLocationSelect(result)
      setIsOpen(false)
    } catch (error) {
      console.error("Error getting address:", error)
      alert(`Không thể lấy địa chỉ từ vị trí đã chọn: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị")
      return
    }

    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        if (mapInstanceRef.current && leafletRef.current) {
          const L = leafletRef.current
          mapInstanceRef.current.setView([latitude, longitude], 16)

          // Remove existing marker
          if (markerInstanceRef.current) {
            mapInstanceRef.current.removeLayer(markerInstanceRef.current)
          }

          // Add new marker
          const newMarker = L.marker([latitude, longitude], {
            draggable: true,
          }).addTo(mapInstanceRef.current)

          newMarker.on("dragend", (e: any) => {
            const pos = e.target.getLatLng()
            setSelectedPosition({ lat: pos.lat, lng: pos.lng })
          })

          markerInstanceRef.current = newMarker
          setSelectedPosition({ lat: latitude, lng: longitude })
        }

        setIsLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert("Không thể lấy vị trí hiện tại")
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full h-12 border-gray-300 hover:border-blue-500">
          <MapPin className="w-4 h-4 mr-2" />
          Chọn trên bản đồ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Chọn vị trí trên bản đồ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleGetCurrentLocation} disabled={isLoading} variant="outline" size="sm">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
              Vị trí hiện tại
            </Button>
          </div>

          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-gray-300 bg-gray-50"
              style={{
                minHeight: "400px",
                zIndex: 0,
              }}
            />
            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {!leafletLoaded ? "Đang tải thư viện bản đồ..." : "Đang khởi tạo bản đồ..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            💡 <strong>Hướng dẫn:</strong> Click vào bản đồ để chọn vị trí, hoặc kéo thả marker để điều chỉnh vị trí
            chính xác.
          </div>

          {selectedPosition && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>Tọa độ đã chọn:</strong> {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmLocation} disabled={!selectedPosition || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Xác nhận vị trí
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
