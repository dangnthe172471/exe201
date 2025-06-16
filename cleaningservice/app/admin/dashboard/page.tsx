"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar, DollarSign, CheckCircle, X, Search, Filter } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [cleaners, setCleaners] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "admin") {
      router.push("/")
      return
    }

    setUser(userData)
    loadData()
  }, [router])

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")

    setUsers(allUsers.filter((u: any) => u.role === "user"))
    setCleaners(allUsers.filter((u: any) => u.role === "cleaner"))
    setBookings(allBookings)
  }

  const updateCleanerStatus = (cleanerId: number, newStatus: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = allUsers.map((user: any) => {
      if (user.id === cleanerId) {
        return { ...user, status: newStatus }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    loadData()
  }

  const updateBookingStatus = (bookingId: number, newStatus: string) => {
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const updatedBookings = allBookings.map((booking: any) => {
      if (booking.id === bookingId) {
        return { ...booking, status: newStatus }
      }
      return booking
    })

    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
    loadData()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", variant: "secondary" as const },
      active: { label: "Hoạt động", variant: "default" as const },
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  if (!user) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng Điều Khiển Quản Trị</h1>
            <p className="text-gray-600">Quản lý toàn bộ hệ thống dịch vụ dọn vệ sinh</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nhân viên</p>
                    <p className="text-2xl font-bold">{cleaners.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold">{totalRevenue.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">Đơn Đặt Lịch</TabsTrigger>
              <TabsTrigger value="cleaners">Nhân Viên</TabsTrigger>
              <TabsTrigger value="customers">Khách Hàng</TabsTrigger>
              <TabsTrigger value="analytics">Thống Kê</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quản Lý Đơn Đặt Lịch</h2>
              </div>

              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, địa chỉ, mã đơn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.contactName}</p>
                            <p className="text-sm text-gray-500">{booking.contactPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getServiceName(booking.serviceType)}</TableCell>
                        <TableCell>
                          {booking.date
                            ? format(new Date(booking.date), "dd/MM/yyyy", { locale: vi })
                            : "Chưa xác định"}
                        </TableCell>
                        <TableCell>{booking.totalPrice?.toLocaleString("vi-VN")}đ</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {booking.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="cleaners" className="space-y-6">
              <h2 className="text-2xl font-bold">Quản Lý Nhân Viên</h2>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên nhân viên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Kinh nghiệm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cleaners.map((cleaner) => (
                      <TableRow key={cleaner.id}>
                        <TableCell className="font-medium">{cleaner.name}</TableCell>
                        <TableCell>{cleaner.email}</TableCell>
                        <TableCell>{cleaner.phone}</TableCell>
                        <TableCell>{cleaner.experience}</TableCell>
                        <TableCell>{getStatusBadge(cleaner.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {cleaner.status === "pending" && (
                              <>
                                <Button size="sm" onClick={() => updateCleanerStatus(cleaner.id, "active")}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateCleanerStatus(cleaner.id, "rejected")}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              <h2 className="text-2xl font-bold">Quản Lý Khách Hàng</h2>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên khách hàng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Số đơn hàng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>
                          {customer.createdAt
                            ? format(new Date(customer.createdAt), "dd/MM/yyyy", { locale: vi })
                            : "N/A"}
                        </TableCell>
                        <TableCell>{bookings.filter((b) => b.userId === customer.id).length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold">Thống Kê & Báo Cáo</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê đơn hàng theo trạng thái</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["pending", "confirmed", "in_progress", "completed", "cancelled"].map((status) => {
                        const count = bookings.filter((b) => b.status === status).length
                        const percentage = bookings.length > 0 ? ((count / bookings.length) * 100).toFixed(1) : 0
                        return (
                          <div key={status} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">{getStatusBadge(status)}</div>
                            <div className="text-right">
                              <div className="font-semibold">{count}</div>
                              <div className="text-sm text-gray-500">{percentage}%</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu theo dịch vụ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["home-regular", "office", "post-construction", "year-end"].map((serviceType) => {
                        const revenue = bookings
                          .filter((b) => b.serviceType === serviceType && b.status === "completed")
                          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                        return (
                          <div key={serviceType} className="flex justify-between items-center">
                            <div>{getServiceName(serviceType)}</div>
                            <div className="font-semibold">{revenue.toLocaleString("vi-VN")}đ</div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
