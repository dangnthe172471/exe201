"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Calendar, Clock, User, Search, Filter, ArrowRight, Sparkles, Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = [
    { id: "all", name: "Tất cả", color: "bg-gray-100 text-gray-700" },
    { id: "tips", name: "Mẹo vặt", color: "bg-blue-100 text-blue-700" },
    { id: "health", name: "Sức khỏe", color: "bg-green-100 text-green-700" },
    { id: "technology", name: "Công nghệ", color: "bg-purple-100 text-purple-700" },
    { id: "company", name: "Tin công ty", color: "bg-orange-100 text-orange-700" },
    { id: "promotion", name: "Khuyến mãi", color: "bg-red-100 text-red-700" },
  ]

  const newsArticles = [
    {
      id: 1,
      title: "10 Mẹo Dọn Nhà Nhanh Chóng Và Hiệu Quả",
      excerpt: "Khám phá những bí quyết giúp bạn dọn dẹp nhà cửa một cách nhanh chóng và tiết kiệm thời gian...",
      content:
        "Dọn dẹp nhà cửa không cần phải mất cả ngày. Với những mẹo hay này, bạn có thể có một ngôi nhà sạch sẽ chỉ trong vài giờ.",
      category: "tips",
      author: "Nguyễn Thị Lan",
      publishDate: new Date("2024-01-15"),
      readTime: "5 phút đọc",
      views: 1250,
      image: "/placeholder.svg?height=200&width=400",
      featured: true,
    },
    {
      id: 2,
      title: "Tác Hại Của Bụi Bẩn Đến Sức Khỏe Gia Đình",
      excerpt: "Tìm hiểu về những tác hại nghiêm trọng của bụi bẩn và cách bảo vệ sức khỏe gia đình bạn...",
      content:
        "Bụi bẩn không chỉ làm mất thẩm mỹ mà còn ảnh hưởng nghiêm trọng đến sức khỏe, đặc biệt là trẻ em và người già.",
      category: "health",
      author: "BS. Trần Văn Nam",
      publishDate: new Date("2024-01-12"),
      readTime: "7 phút đọc",
      views: 980,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
    },
    {
      id: 3,
      title: "CareU Ra Mắt Ứng Dụng Mobile Mới",
      excerpt: "Ứng dụng CareU phiên bản mới với nhiều tính năng thông minh, giúp đặt lịch dễ dàng hơn bao giờ hết...",
      content: "Ứng dụng CareU mới được tích hợp AI để đề xuất dịch vụ phù hợp và tối ưu hóa lịch trình làm việc.",
      category: "company",
      author: "CareU Team",
      publishDate: new Date("2024-01-10"),
      readTime: "3 phút đọc",
      views: 2100,
      image: "/placeholder.svg?height=200&width=400",
      featured: true,
    },
    {
      id: 4,
      title: "Công Nghệ Robot Dọn Dẹp: Tương Lai Đã Đến",
      excerpt:
        "Khám phá những công nghệ robot dọn dẹp tiên tiến nhất hiện nay và xu hướng phát triển trong tương lai...",
      content: "Robot dọn dẹp đang trở thành xu hướng mới, giúp tiết kiệm thời gian và nâng cao chất lượng cuộc sống.",
      category: "technology",
      author: "Lê Minh Tuấn",
      publishDate: new Date("2024-01-08"),
      readTime: "6 phút đọc",
      views: 750,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
    },
    {
      id: 5,
      title: "Khuyến Mãi Tháng 1: Giảm 30% Dịch Vụ Dọn Cuối Năm",
      excerpt: "Chương trình khuyến mãi đặc biệt dành cho khách hàng mới và cũ trong tháng 1/2024...",
      content: "Nhân dịp đầu năm mới, CareU triển khai chương trình khuyến mãi hấp dẫn với mức giảm giá lên đến 30%.",
      category: "promotion",
      author: "CareU Marketing",
      publishDate: new Date("2024-01-05"),
      readTime: "2 phút đọc",
      views: 3200,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
    },
    {
      id: 6,
      title: "Cách Chọn Sản Phẩm Vệ Sinh An Toàn Cho Gia Đình",
      excerpt: "Hướng dẫn chi tiết cách lựa chọn các sản phẩm vệ sinh an toàn, thân thiện với môi trường...",
      content: "Việc lựa chọn sản phẩm vệ sinh phù hợp không chỉ đảm bảo hiệu quả mà còn bảo vệ sức khỏe gia đình.",
      category: "health",
      author: "Phạm Thu Hương",
      publishDate: new Date("2024-01-03"),
      readTime: "8 phút đọc",
      views: 1100,
      image: "/placeholder.svg?height=200&width=400",
      featured: false,
    },
  ]

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const featuredArticles = filteredArticles.filter((article) => article.featured)
  const regularArticles = filteredArticles.filter((article) => !article.featured)

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>

          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Tin tức & Mẹo hay
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Tin Tức
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareU</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Cập nhật những tin tức mới nhất, mẹo vặt hữu ích và kiến thức chăm sóc nhà cửa
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-blue-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 h-12 border-gray-300 focus:border-blue-500">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  categoryFilter === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setCategoryFilter(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bài Viết Nổi Bật
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article) => {
                const categoryInfo = getCategoryInfo(article.category)
                return (
                  <Card
                    key={article.id}
                    className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${categoryInfo.color} border-0`}>{categoryInfo.name}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Nổi bật
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">{article.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(article.publishDate, "dd/MM/yyyy", { locale: vi })}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                          </div>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Link href={`/news/${article.id}`}>
                          Đọc tiếp
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section className="pb-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Tất Cả Bài Viết
            </span>
          </h2>

          {regularArticles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => {
                const categoryInfo = getCategoryInfo(article.category)
                return (
                  <Card
                    key={article.id}
                    className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${categoryInfo.color} border-0 text-xs`}>{categoryInfo.name}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(article.publishDate, "dd/MM", { locale: vi })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {article.views}
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Link href={`/news/${article.id}`}>
                          Đọc tiếp
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Đăng Ký Nhận Tin Tức</h2>
          <p className="text-xl mb-8 opacity-90">Nhận những bài viết mới nhất và mẹo vặt hữu ích từ CareU</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Nhập email của bạn"
              className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8">Đăng Ký</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
