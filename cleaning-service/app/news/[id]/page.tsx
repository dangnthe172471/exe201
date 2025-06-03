"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Calendar,
  Clock,
  User,
  Eye,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  ThumbsUp,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function NewsDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<any>(null)
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])

  // Mock data - trong thực tế sẽ fetch từ API
  const newsArticles = [
    {
      id: 1,
      title: "10 Mẹo Dọn Nhà Nhanh Chóng Và Hiệu Quả",
      excerpt: "Khám phá những bí quyết giúp bạn dọn dẹp nhà cửa một cách nhanh chóng và tiết kiệm thời gian...",
      content: `
        <h2>Dọn dẹp nhà cửa không cần phải mất cả ngày</h2>
        <p>Với những mẹo hay này, bạn có thể có một ngôi nhà sạch sẽ chỉ trong vài giờ. Hãy cùng CareU khám phá những bí quyết đơn giản nhưng hiệu quả.</p>
        
        <h3>1. Chuẩn bị đầy đủ dụng cụ</h3>
        <p>Trước khi bắt đầu, hãy chuẩn bị đầy đủ các dụng cụ cần thiết như khăn lau, chất tẩy rửa, túi rác, và máy hút bụi. Điều này giúp bạn không phải ngừng giữa chừng để tìm kiếm dụng cụ.</p>
        
        <h3>2. Áp dụng quy tắc 15 phút</h3>
        <p>Dành 15 phút mỗi ngày để dọn dẹp một khu vực nhỏ. Điều này giúp duy trì sự sạch sẽ và tránh việc phải dọn dẹp lớn vào cuối tuần.</p>
        
        <h3>3. Dọn từ trên xuống dưới</h3>
        <p>Luôn bắt đầu dọn dẹp từ trần nhà, quạt trần, đèn chiếu sáng rồi mới đến bàn ghế và cuối cùng là sàn nhà. Điều này tránh việc bụi bẩn rơi xuống những nơi đã dọn sạch.</p>
        
        <h3>4. Sử dụng phương pháp "một lần chạm"</h3>
        <p>Khi nhặt một vật dụng, hãy quyết định ngay xem sẽ giữ lại, vứt bỏ hay tặng đi. Không để lại để quyết định sau, điều này sẽ tiết kiệm rất nhiều thời gian.</p>
        
        <h3>5. Dọn dẹp theo từng phòng</h3>
        <p>Tập trung hoàn thành một phòng trước khi chuyển sang phòng khác. Điều này giúp bạn có cảm giác hoàn thành và động lực để tiếp tục.</p>
        
        <p><strong>Kết luận:</strong> Dọn dẹp nhà cửa không nhất thiết phải là công việc nặng nhọc. Với những mẹo đơn giản này, bạn có thể duy trì một ngôi nhà sạch sẽ mà không tốn quá nhiều thời gian và công sức.</p>
      `,
      category: "tips",
      author: "Nguyễn Thị Lan",
      publishDate: new Date("2024-01-15"),
      readTime: "5 phút đọc",
      views: 1250,
      likes: 89,
      comments: 23,
      image: "/placeholder.svg?height=400&width=800",
      tags: ["dọn dẹp", "mẹo vặt", "tiết kiệm thời gian", "nhà cửa"],
    },
    // Thêm các bài viết khác...
  ]

  useEffect(() => {
    // Tìm bài viết theo ID
    const foundArticle = newsArticles.find((a) => a.id === Number.parseInt(params.id as string))
    setArticle(foundArticle)

    // Tìm bài viết liên quan (cùng category, khác ID)
    if (foundArticle) {
      const related = newsArticles
        .filter((a) => a.category === foundArticle.category && a.id !== foundArticle.id)
        .slice(0, 3)
      setRelatedArticles(related)
    }
  }, [params.id])

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-3xl font-bold mb-4">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Button asChild>
              <Link href="/news">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại tin tức
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      tips: "bg-blue-100 text-blue-700",
      health: "bg-green-100 text-green-700",
      technology: "bg-purple-100 text-purple-700",
      company: "bg-orange-100 text-orange-700",
      promotion: "bg-red-100 text-red-700",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link href="/news">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại tin tức
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="relative">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className={`${getCategoryColor(article.category)} border-0`}>
                  {article.category === "tips"
                    ? "Mẹo vặt"
                    : article.category === "health"
                      ? "Sức khỏe"
                      : article.category === "technology"
                        ? "Công nghệ"
                        : article.category === "company"
                          ? "Tin công ty"
                          : "Khuyến mãi"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{format(article.publishDate, "dd MMMM yyyy", { locale: vi })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{article.views} lượt xem</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* Social Actions */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {article.likes}
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {article.comments}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bài Viết Liên Quan
                </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="hover:shadow-lg transition-all duration-300 border-0">
                    <div className="relative">
                      <img
                        src={relatedArticle.image || "/placeholder.svg"}
                        alt={relatedArticle.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/news/${relatedArticle.id}`}>{relatedArticle.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedArticle.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{format(relatedArticle.publishDate, "dd/MM", { locale: vi })}</span>
                        <span>{relatedArticle.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cần Dịch Vụ Dọn Vệ Sinh?</h3>
              <p className="text-lg mb-6 opacity-90">Để CareU chăm sóc ngôi nhà của bạn với dịch vụ chuyên nghiệp</p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/booking">Đặt Lịch Ngay</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
