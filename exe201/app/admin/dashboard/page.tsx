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
  const [bills, setBills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("currentUser")
      console.log("Current user from localStorage:", currentUser) // Debug log

      if (!currentUser) {
        console.log("No user found, redirecting to login")
        router.push("/login")
        return
      }

      const userData = JSON.parse(currentUser)
      console.log("User data:", userData) // Debug log

      if (userData.role !== "admin") {
        console.log("User is not admin, redirecting to home")
        setError(`Bạn không có quyền truy cập. Role hiện tại: ${userData.role}`)
        setTimeout(() => router.push("/"), 2000)
        return
      }

      setUser(userData)
      loadData()
      setLoading(false)

      // Initialize fake bills if not exists
      const existingBills = localStorage.getItem("bills")
      if (!existingBills) {
        const fakeBills = [
          {
            id: 1,
            date: "2025-05-29",
            customerEmail: "nguyenductanmdsl@gmail.com",
            amount: 119000,
            billId: "00001",
            status: "paid",
          },
          {
            id: 2,
            date: "2025-05-30",
            customerEmail: "namkhanhdz123@gmail.com",
            amount: 119000,
            billId: "00002",
            status: "paid",
          },
          {
            id: 3,
            date: "2025-05-31",
            customerEmail: "quy77889@gmail.com",
            amount: 149000,
            billId: "00003",
            status: "paid",
          },
          {
            id: 4,
            date: "2025-06-01",
            customerEmail: "nguyenquangyinhzz@gmail.com",
            amount: 119000,
            billId: "00004",
            status: "paid",
          },
          {
            id: 5,
            date: "2025-06-02",
            customerEmail: "huynhthaikhang@gmail.com",
            amount: 119000,
            billId: "00005",
            status: "paid",
          },
          {
            id: 6,
            date: "2025-06-03",
            customerEmail: "dat8948@gmail.com",
            amount: 119000,
            billId: "00006",
            status: "paid",
          },
          {
            id: 7,
            date: "2025-06-07",
            customerEmail: "thanhd2006@gmail.com",
            amount: 149000,
            billId: "00007",
            status: "paid",
          },
          {
            id: 8,
            date: "2025-06-07",
            customerEmail: "hinhvonkuv1987az@gmail.com",
            amount: 149000,
            billId: "00008",
            status: "paid",
          },
          {
            id: 9,
            date: "2025-06-08",
            customerEmail: "kingppfa2006@gmail.com",
            amount: 119000,
            billId: "00009",
            status: "paid",
          },
          {
            id: 10,
            date: "2025-06-08",
            customerEmail: "vonhatduy07082k6@gmail.com",
            amount: 149000,
            billId: "00010",
            status: "paid",
          },
          {
            id: 11,
            date: "2025-06-08",
            customerEmail: "tiennhien2k6@gmail.com",
            amount: 149000,
            billId: "00011",
            status: "paid",
          },
          {
            id: 12,
            date: "2025-06-09",
            customerEmail: "ngkhanh2002zz@gmail.com",
            amount: 119000,
            billId: "00012",
            status: "paid",
          },
          {
            id: 13,
            date: "2025-06-10",
            customerEmail: "vanlinh2k666@gmail.com",
            amount: 149000,
            billId: "00013",
            status: "paid",
          },
          {
            id: 14,
            date: "2025-06-11",
            customerEmail: "ngthaoguyen77@gmail.com",
            amount: 119000,
            billId: "00014",
            status: "paid",
          },
          {
            id: 15,
            date: "2025-06-14",
            customerEmail: "vnaxkonchiem111@gmail.com",
            amount: 149000,
            billId: "00015",
            status: "paid",
          },
          {
            id: 16,
            date: "2025-06-14",
            customerEmail: "thangnhgien1964@gmail.com",
            amount: 119000,
            billId: "00016",
            status: "paid",
          },
          {
            id: 17,
            date: "2025-06-14",
            customerEmail: "vanzzlinh@gmail.com",
            amount: 149000,
            billId: "00017",
            status: "paid",
          },
          {
            id: 18,
            date: "2025-06-15",
            customerEmail: "holyalone123@gmail.com",
            amount: 119000,
            billId: "00018",
            status: "paid",
          },
          {
            id: 19,
            date: "2025-06-15",
            customerEmail: "tandat193@gmail.com",
            amount: 278000,
            billId: "00019",
            status: "paid",
          },
          {
            id: 20,
            date: "2025-06-15",
            customerEmail: "vongvinhphuc1808@gmail.com",
            amount: 149000,
            billId: "00020",
            status: "paid",
          },
          {
            id: 21,
            date: "2025-06-18",
            customerEmail: "nhkhiem12@gmail.com",
            amount: 149000,
            billId: "00021",
            status: "paid",
          },
        ]
        localStorage.setItem("bills", JSON.stringify(fakeBills))
      }
    } catch (err) {
      console.error("Error in useEffect:", err)
      setError("Có lỗi xảy ra khi tải dữ liệu")
      setLoading(false)
    }
  }, [router])

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const allBills = JSON.parse(localStorage.getItem("bills") || "[]")

    setUsers(allUsers.filter((u: any) => u.role === "user"))
    setCleaners(allUsers.filter((u: any) => u.role === "cleaner"))
    setBookings(allBookings)
    setBills(allBills)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
          <Button onClick={() => router.push("/login")}>Đăng nhập lại</Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Không tìm thấy thông tin người dùng</p>
          <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
        </div>
      </div>
    )
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
              <TabsTrigger value="bills">Hóa Đơn</TabsTrigger>
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

            <TabsContent value="bills" className="space-y-6">
              <h2 className="text-2xl font-bold">Quản Lý Hóa Đơn</h2>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Email khách hàng</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Mã hóa đơn</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{format(new Date(bill.date), "dd/MM/yyyy", { locale: vi })}</TableCell>
                        <TableCell>{bill.customerEmail}</TableCell>
                        <TableCell>{bill.amount.toLocaleString("vi-VN")}đ</TableCell>
                        <TableCell>#{bill.billId}</TableCell>
                        <TableCell>
                          <Badge variant={bill.status === "paid" ? "default" : "secondary"}>
                            {bill.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
