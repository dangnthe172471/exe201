"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, DollarSign, Plus, Star, User, Phone, Eye } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load user's bookings
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const userBookings = allBookings.filter((booking: any) => booking.userId === userData.id)
    setBookings(userBookings)
  }, [router])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ xác nhận", variant: "secondary" as const },
      confirmed: { label: "Đã xác nhận", variant: "default" as const },
      in_progress: { label: "Đang thực hiện", variant: "default" as const },
      completed: { label: "Hoàn thành", variant: "default" as const },
      cancelled: { label: "Đã hủy", variant: "destructive" as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getServiceName = (serviceType: string) => {
    const services = {
      "home-regular": "Dọn Nhà Định Kỳ",
      office: "Dọn Văn Phòng",
      "post-construction": "Dọn Sau Xây Dựng",
      "year-end": "Dọn Cuối Năm",
    }
    return services[serviceType as keyof typeof services] || serviceType
  }

  if (!user) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào, {user.name}!</h1>
            <p className="text-gray-600">Quản lý lịch đặt dịch vụ dọn vệ sinh của bạn</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng đặt lịch</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                    <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                    <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "completed").length}</p>
                  </div>
                  <Star className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                    <p className="text-2xl font-bold">
                      {bookings
                        .filter((b) => b.status === "completed")
                        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                        .toLocaleString("vi-VN")}
                      đ
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">Lịch Đặt</TabsTrigger>
              <TabsTrigger value="profile">Thông Tin Cá Nhân</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lịch Đặt Của Bạn</h2>
                <Button asChild>
                  <Link href="/booking">
                    <Plus className="w-4 h-4 mr-2" />
                    Đặt Lịch Mới
                  </Link>
                </Button>
              </div>

              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có lịch đặt nào</h3>
                    <p className="text-gray-600 mb-4">Bạn chưa đặt lịch dịch vụ nào. Hãy đặt lịch đầu tiên của bạn!</p>
                    <Button asChild>
                      <Link href="/booking">Đặt Lịch Ngay</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{getServiceName(booking.serviceType)}</CardTitle>
                            <CardDescription>Mã đặt lịch: #{booking.id}</CardDescription>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {booking.date ? format(new Date(booking.date), "PPP", { locale: vi }) : "Chưa xác định"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {booking.timeSlot || "Chưa xác định"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {booking.address}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              {booking.totalPrice?.toLocaleString("vi-VN")}đ
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              {booking.contactName}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {booking.contactPhone}
                            </div>
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Ghi chú:</strong> {booking.notes}
                            </p>
                          </div>
                        )}

                        <Button asChild variant="outline" size="sm">
                          <Link href={`/user/my-bookings/${booking.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-bold">Thông Tin Cá Nhân</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Họ và tên</Label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Số điện thoại</Label>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                      <p className="text-lg">{user.address}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline">Chỉnh Sửa Thông Tin</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
