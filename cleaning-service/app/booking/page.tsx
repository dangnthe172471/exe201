"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, Clock, CheckCircle, Heart, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function BookingPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    serviceType: "",
    timeSlot: "",
    address: "",
    area: "",
    notes: "",
    contactName: "",
    contactPhone: "",
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const services = [
    {
      id: "home-regular",
      name: "Dọn Nhà Định Kỳ",
      basePrice: 300000,
      unit: "lần",
      icon: "🏠",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "office",
      name: "Dọn Văn Phòng",
      basePrice: 500000,
      unit: "lần",
      icon: "🏢",
      color: "from-purple-500 to-pink-400",
    },
    {
      id: "post-construction",
      name: "Dọn Sau Xây Dựng",
      basePrice: 800000,
      unit: "lần",
      icon: "🔨",
      color: "from-orange-500 to-red-400",
    },
    {
      id: "year-end",
      name: "Dọn Cuối Năm",
      basePrice: 600000,
      unit: "lần",
      icon: "🎊",
      color: "from-green-500 to-emerald-400",
    },
  ]

  const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00"]

  const areaSizes = [
    { id: "small", name: "Nhỏ (< 50m²)", multiplier: 1 },
    { id: "medium", name: "Trung bình (50-100m²)", multiplier: 1.5 },
    { id: "large", name: "Lớn (100-200m²)", multiplier: 2 },
    { id: "extra-large", name: "Rất lớn (> 200m²)", multiplier: 2.5 },
  ]

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(currentUser)
    setUser(userData)
    setFormData((prev) => ({
      ...prev,
      contactName: userData.name || "",
      contactPhone: userData.phone || "",
    }))
  }, [router])

  useEffect(() => {
    calculatePrice()
  }, [formData.serviceType, formData.area])

  const calculatePrice = () => {
    const service = services.find((s) => s.id === formData.serviceType)
    const area = areaSizes.find((a) => a.id === formData.area)

    if (service && area) {
      setTotalPrice(service.basePrice * area.multiplier)
    } else {
      setTotalPrice(0)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      const newBooking = {
        id: Date.now(),
        userId: user.id,
        ...formData,
        date: selectedDate?.toISOString(),
        totalPrice,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      bookings.push(newBooking)
      localStorage.setItem("bookings", JSON.stringify(bookings))

      setLoading(false)
      setSuccess(true)
    }, 1000)
  }

  if (!user) {
    return <div>Đang tải...</div>
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Đặt Lịch Thành Công!
              </span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Chúng tôi đã nhận được yêu cầu của bạn. Nhân viên sẽ liên hệ xác nhận trong vòng 30 phút.
            </p>
            <div className="space-y-4">
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <a href="/user/dashboard">Xem Lịch Đặt</a>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 border-gray-300 hover:border-blue-500">
                <a href="/">Về Trang Chủ</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đặt Lịch Dọn Vệ Sinh
              </span>
            </h1>
            <p className="text-gray-600 text-lg">Chọn dịch vụ và thời gian phù hợp với bạn</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Thông tin đặt lịch</CardTitle>
              <CardDescription className="text-base">
                Vui lòng điền đầy đủ thông tin để chúng tôi phục vụ bạn tốt nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Service Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Loại dịch vụ</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => handleInputChange("serviceType", value)}
                  >
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn loại dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{service.icon}</span>
                              <span>{service.name}</span>
                            </div>
                            <span className="text-sm text-blue-600 font-medium ml-4">
                              {service.basePrice.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Diện tích khu vực</Label>
                  <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn diện tích" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaSizes.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Ngày thực hiện</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal border-gray-300 focus:border-blue-500"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Slot */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Khung giờ</Label>
                  <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn khung giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {slot}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ thực hiện
                  </Label>
                  <Input
                    id="address"
                    placeholder="Nhập địa chỉ chi tiết"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="contactName" className="text-sm font-medium">
                      Tên người liên hệ
                    </Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="contactPhone" className="text-sm font-medium">
                      Số điện thoại
                    </Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Ghi chú thêm
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Yêu cầu đặc biệt, hướng dẫn đường đi..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>

                {/* Price Summary */}
                {totalPrice > 0 && (
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Tổng chi phí:</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {totalPrice.toLocaleString("vi-VN")}đ
                          </div>
                          <div className="text-sm text-gray-600">(Đã bao gồm VAT)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
                  disabled={loading || !selectedDate || !formData.serviceType}
                >
                  {loading ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Xác Nhận Đặt Lịch
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
