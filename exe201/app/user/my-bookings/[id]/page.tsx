"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  Star,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getBookingById } from "@/app/api/services/bookingApi"
import Header from "@/components/header"

// Interface cho dữ liệu từ API
interface BookingDetailDto {
  id: number;
  serviceName: string;
  areaSizeName: string;
  timeSlotRange: string;
  bookingDate: string;
  address: string;
  contactName: string;
  contactPhone: string;
  notes?: string;
  totalPrice: number;
  status: string;
  cleanerId?: number;
  cleanerName?: string;
  createdAt: string;
  updatedAt?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200"
    case "in_progress":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "confirmed":
      return "bg-orange-100 text-orange-700 border-orange-200"
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Hoàn thành"
    case "in_progress":
      return "Đang thực hiện"
    case "confirmed":
      return "Đã xác nhận"
    case "pending":
      return "Chờ xác nhận"
    case "cancelled":
      return "Đã hủy"
    default:
      return status
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "in_progress":
      return <PlayCircle className="h-5 w-5 text-blue-600" />
    case "confirmed":
      return <Clock className="h-5 w-5 text-orange-600" />
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-600" />
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-600" />
  }
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        // Lấy token từ localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const bookingId = parseInt(params.id as string)
        const data = await getBookingById(bookingId, token)
        setBooking(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra'
        setError(errorMessage)
        toast.error(errorMessage)

        // Nếu lỗi 401, redirect về login
        if (errorMessage.includes('token không hợp lệ')) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBookingDetail()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải thông tin đơn hàng</h2>
          <p className="text-gray-600 mb-4">{error || 'Đơn hàng không tồn tại'}</p>
          <Button asChild>
            <Link href="/user/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/user/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết booking #{booking.id}</h1>
                <div className="flex items-center gap-3">
                  {getStatusIcon(booking.status)}
                  <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                </div>
              </div>

              {booking.status === "completed" && (
                <Button asChild>
                  <Link href={`/feedback/${booking.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Đánh giá dịch vụ
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🏠</span>
                    {booking.serviceName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Dịch vụ dọn dẹp nhà cửa chuyên nghiệp</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Thông tin đặt lịch</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>{new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>{booking.timeSlotRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Diện tích:</span>
                          <span>{booking.areaSizeName}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Thông tin khác</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Ngày tạo: </span>
                          <span>{new Date(booking.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                        {booking.updatedAt && (
                          <div>
                            <span className="text-gray-600">Cập nhật lần cuối: </span>
                            <span>{new Date(booking.updatedAt).toLocaleString("vi-VN")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Địa chỉ thực hiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Địa chỉ đầy đủ</h4>
                      <p className="text-gray-700">{booking.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Người liên hệ</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Tên: </span>
                          <span>{booking.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span>{booking.contactPhone}</span>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Ghi chú</h4>
                        <p className="text-sm text-gray-700">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cleaner Info */}
              {booking.cleanerName && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nhân viên thực hiện</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{booking.cleanerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{booking.cleanerName}</h4>
                        <p className="text-sm text-gray-600">Nhân viên dọn dẹp</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {booking.totalPrice.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phương thức:</span>
                        <span>Tiền mặt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <Badge variant="default">
                          Đã thanh toán
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Đặt lịch</div>
                        <div className="text-gray-600">{new Date(booking.createdAt).toLocaleString("vi-VN")}</div>
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Đã xác nhận</div>
                          <div className="text-gray-600">Đơn hàng đã được xác nhận</div>
                        </div>
                      </div>
                    )}

                    {booking.status === "in_progress" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Đang thực hiện</div>
                          <div className="text-gray-600">Nhân viên đang làm việc</div>
                        </div>
                      </div>
                    )}

                    {booking.status === "completed" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Hoàn thành</div>
                          <div className="text-gray-600">Dịch vụ đã hoàn thành</div>
                        </div>
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Đã hủy</div>
                          <div className="text-gray-600">Đơn hàng đã bị hủy</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
