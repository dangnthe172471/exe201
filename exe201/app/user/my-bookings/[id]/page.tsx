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
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - trong thực tế sẽ fetch từ API dựa trên ID
const mockBookingDetail = {
  id: 1,
  serviceName: "Dọn Nhà Định Kỳ",
  serviceIcon: "🏠",
  serviceDescription: "Dịch vụ dọn dẹp nhà cửa hàng tuần, hàng tháng với đội ngũ chuyên nghiệp",
  bookingDate: "2024-01-20",
  timeRange: "08:00 - 10:00",
  fullAddress: "123 Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP.HCM",
  ward: "Phường Tân Phú",
  district: "Quận 7",
  city: "TP.HCM",
  addressNote: "Tầng 3, căn hộ A301",
  contactName: "Nguyễn Văn A",
  contactPhone: "0123456789",
  notes: "Cần dọn dẹp kỹ phòng khách và bếp",
  areaSize: "Trung bình (50-100m²)",
  totalPrice: 450000,
  status: "completed",
  cleanerName: "Trần Thị B",
  cleanerPhone: "0987654321",
  cleanerEmail: "cleaner@demo.com",
  cleanerAvatar: "/placeholder.svg?height=40&width=40",
  startedAt: "2024-01-20T08:00:00",
  completedAt: "2024-01-20T11:30:00",
  createdAt: "2024-01-15T10:30:00",
  paymentMethod: "cash",
  paymentStatus: "completed",
  hasReview: true,
  review: {
    overallRating: 5,
    qualityRating: 5,
    timelinessRating: 5,
    professionalismRating: 4,
    comment: "Dịch vụ rất tốt, nhân viên làm việc cẩn thận và chuyên nghiệp. Nhà tôi sạch sẽ như mới!",
    whatWentWell: "Nhân viên đến đúng giờ, làm việc rất cẩn thận, đặc biệt là khu vực bếp được làm sạch rất kỹ",
    whatCouldImprove: "Có thể cải thiện thêm về việc sắp xếp đồ đạc sau khi dọn dẹp",
    wouldRecommend: true,
    createdAt: "2024-01-20T12:00:00",
  },
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
  const booking = mockBookingDetail // Trong thực tế sẽ fetch dựa trên params.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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

            {booking.status === "completed" && !booking.hasReview && (
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
                  <span className="text-2xl">{booking.serviceIcon}</span>
                  {booking.serviceName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{booking.serviceDescription}</p>
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
                        <span>{booking.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Diện tích:</span>
                        <span>{booking.areaSize}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Thời gian thực hiện</h4>
                    <div className="space-y-2 text-sm">
                      {booking.startedAt && (
                        <div>
                          <span className="text-gray-600">Bắt đầu: </span>
                          <span>{new Date(booking.startedAt).toLocaleString("vi-VN")}</span>
                        </div>
                      )}
                      {booking.completedAt && (
                        <div>
                          <span className="text-gray-600">Hoàn thành: </span>
                          <span>{new Date(booking.completedAt).toLocaleString("vi-VN")}</span>
                        </div>
                      )}
                      {booking.startedAt && booking.completedAt && (
                        <div>
                          <span className="text-gray-600">Thời gian làm việc: </span>
                          <span className="font-medium">
                            {Math.round(
                              (new Date(booking.completedAt).getTime() - new Date(booking.startedAt).getTime()) /
                              (1000 * 60 * 60 * 100),
                            ) / 10}{" "}
                            giờ
                          </span>
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
                    <p className="text-gray-700">{booking.fullAddress}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Phường/Xã: </span>
                      <span>{booking.ward}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quận/Huyện: </span>
                      <span>{booking.district}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Thành phố: </span>
                      <span>{booking.city}</span>
                    </div>
                  </div>

                  {booking.addressNote && (
                    <div>
                      <h4 className="font-semibold mb-1">Ghi chú địa chỉ</h4>
                      <p className="text-gray-700">{booking.addressNote}</p>
                    </div>
                  )}
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

            {/* Review Section */}
            {booking.hasReview && booking.review && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Đánh giá của bạn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall Rating */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{booking.review.overallRating}</div>
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < booking.review.overallRating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-600">Tổng thể</div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Chất lượng</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < booking.review.qualityRating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Đúng giờ</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < booking.review.timelinessRating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Chuyên nghiệp</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < booking.review.professionalismRating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Nhận xét chung</h4>
                        <p className="text-gray-700">{booking.review.comment}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Điều gì tốt</h4>
                        <p className="text-gray-700">{booking.review.whatWentWell}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-orange-700">Điều gì cần cải thiện</h4>
                        <p className="text-gray-700">{booking.review.whatCouldImprove}</p>
                      </div>

                      {booking.review.wouldRecommend && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">Bạn sẽ giới thiệu dịch vụ này cho người khác</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Đánh giá vào {new Date(booking.review.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cleaner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Nhân viên thực hiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={booking.cleanerAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{booking.cleanerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{booking.cleanerName}</h4>
                    <p className="text-sm text-gray-600">Nhân viên dọn dẹp</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{booking.cleanerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Email:</span>
                    <span>{booking.cleanerEmail}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      <span>{booking.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge variant={booking.paymentStatus === "completed" ? "default" : "secondary"}>
                        {booking.paymentStatus === "completed" ? "Đã thanh toán" : "Chưa thanh toán"}
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

                  {booking.startedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Bắt đầu làm việc</div>
                        <div className="text-gray-600">{new Date(booking.startedAt).toLocaleString("vi-VN")}</div>
                      </div>
                    </div>
                  )}

                  {booking.completedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Hoàn thành</div>
                        <div className="text-gray-600">{new Date(booking.completedAt).toLocaleString("vi-VN")}</div>
                      </div>
                    </div>
                  )}

                  {booking.hasReview && booking.review && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <div>
                        <div className="font-medium">Đánh giá</div>
                        <div className="text-gray-600">
                          {new Date(booking.review.createdAt).toLocaleString("vi-VN")}
                        </div>
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
  )
}
