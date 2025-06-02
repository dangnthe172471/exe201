"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Eye, EyeOff, User, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    address: "",
    experience: "",
    agreeTerms: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Save user to localStorage (in real app, this would be API call)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: formData.role === "cleaner" ? "pending" : "active",
      }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Auto login
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      // Redirect based on role
      switch (formData.role) {
        case "cleaner":
          router.push("/cleaner/dashboard")
          break
        default:
          router.push("/user/dashboard")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Đăng Ký
              </span>
            </h1>
            <p className="text-gray-600 text-lg">Tạo tài khoản mới để bắt đầu với CareU</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Tạo tài khoản mới</CardTitle>
              <CardDescription className="text-base">Điền thông tin để tạo tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Loại tài khoản
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Chọn loại tài khoản" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-blue-600" />
                          Khách hàng
                        </div>
                      </SelectItem>
                      <SelectItem value="cleaner">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-green-600" />
                          Nhân viên dọn vệ sinh
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Họ và tên
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    placeholder="0123456789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    placeholder="Nhập địa chỉ của bạn"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    className="h-12 border-gray-300 focus:border-blue-500"
                  />
                </div>

                {formData.role === "cleaner" && (
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">
                      Kinh nghiệm làm việc
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Chọn kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Dưới 1 năm</SelectItem>
                        <SelectItem value="1-3">1-3 năm</SelectItem>
                        <SelectItem value="3-5">3-5 năm</SelectItem>
                        <SelectItem value="5+">Trên 5 năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className="h-12 border-gray-300 focus:border-blue-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-purple-600 hover:underline">
                      điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-purple-600 hover:underline">
                      chính sách bảo mật
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Đang tạo tài khoản..." : "Đăng Ký"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link href="/login" className="text-blue-600 hover:text-purple-600 font-medium hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
