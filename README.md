# CareU - Hệ thống đặt dịch vụ dọn dẹp nhà cửa

## 📋 Mô tả dự án

CareU là một nền tảng kết nối khách hàng với dịch vụ dọn dẹp nhà cửa chuyên nghiệp. Hệ thống được xây dựng với kiến trúc full-stack hiện đại, bao gồm backend API (.NET Core) và frontend (Next.js), cung cấp trải nghiệm đặt lịch dọn dẹp thuận tiện và hiệu quả.

### 🎯 Tính năng chính
- **Đặt lịch dọn dẹp**: Quy trình đặt lịch đơn giản và nhanh chóng
- **Quản lý dịch vụ**: Đa dạng dịch vụ dọn dẹp với giá cả minh bạch
- **Hệ thống đánh giá**: Review và rating cho cleaner
- **Thanh toán**: Tích hợp thanh toán an toàn
- **Tin tức & Blog**: Hệ thống tin tức và bài viết
- **Quản lý người dùng**: Phân quyền user, cleaner, admin
- **Thông báo**: Hệ thống notification real-time

## 🛠️ Công nghệ sử dụng

### Backend (.NET Core API)
- **ASP.NET Core 8**
- **Entity Framework Core 8**
- **JWT Bearer Authentication**
- **SQL Server**
- **Swagger/OpenAPI**

### Frontend (Next.js)
- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI Components**
- **React Hook Form**
- **Zod Validation**

### Database
- **Microsoft SQL Server**
- **Entity Framework Migrations**

### Third-party Libraries
- **SweetAlert2** (Notifications)
- **Recharts** (Charts)
- **Leaflet** (Maps)
- **Date-fns** (Date utilities)
- **Lucide React** (Icons)

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- **.NET 8 SDK**
- **Node.js 18+**
- **SQL Server 2019+**
- **Visual Studio 2022** hoặc **VS Code**

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd exe201
```

### Bước 2: Cấu hình Database
1. Mở SQL Server Management Studio
2. Tạo database mới tên `CareU`
3. Chạy script SQL từ file `final_database.sql`
4. Cập nhật connection string trong `appsettings.json`:
   ```json
   "ConnectionStrings": {
       "MyCnn": "Server=YOUR_SERVER;Database=CareU;User Id=sa;Password=123;TrustServerCertificate=True;"
   }
   ```

### Bước 3: Cấu hình Backend
1. Mở solution `Exe201_API.sln`
2. Restore NuGet packages
3. Build solution
4. Chạy API:
   ```bash
   dotnet run
   ```
5. API sẽ chạy tại: `https://localhost:7000`

### Bước 4: Cấu hình Frontend
1. Mở terminal trong thư mục `exe201`
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Chạy ứng dụng:
   ```bash
   npm run dev
   ```
4. Frontend sẽ chạy tại: `http://localhost:3000`

## 👥 Hệ thống vai trò

### 🔐 Admin
- Quản lý toàn bộ hệ thống
- Quản lý dịch vụ và giá cả
- Quản lý người dùng và cleaner
- Xem thống kê và báo cáo
- Quản lý tin tức và bài viết

### 🧹 Cleaner
- Xem danh sách booking được phân công
- Cập nhật trạng thái công việc
- Xem đánh giá từ khách hàng
- Quản lý profile và kinh nghiệm

### 👤 User
- Đăng ký/đăng nhập tài khoản
- Đặt lịch dọn dẹp
- Chọn dịch vụ và thời gian
- Thanh toán và theo dõi booking
- Đánh giá và review cleaner

## 📁 Cấu trúc dự án

```
exe201/
├── Exe201_API/              # Backend API
│   └── Exe201_API/          # Main API project
│       ├── Controllers/     # API Controllers
│       ├── Models/          # Entity models
│       ├── Services/        # Business services
│       ├── DTOs/            # Data Transfer Objects
│       └── Program.cs       # Startup configuration
├── exe201/                  # Frontend Next.js
│   ├── app/                 # App Router pages
│   │   ├── admin/           # Admin pages
│   │   ├── user/            # User pages
│   │   ├── cleaner/         # Cleaner pages
│   │   ├── booking/         # Booking pages
│   │   └── news/            # News pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── styles/              # CSS styles
└── final_database.sql       # Database script
```

## 🗄️ Database Schema

### Bảng chính
- **Users**: Thông tin người dùng (user, cleaner, admin)
- **Services**: Dịch vụ dọn dẹp với giá cơ bản
- **AreaSizes**: Kích thước diện tích và hệ số nhân giá
- **TimeSlots**: Khung giờ làm việc
- **Bookings**: Đặt lịch dọn dẹp
- **Reviews**: Đánh giá và review
- **Payments**: Thanh toán
- **Notifications**: Thông báo
- **NewsArticles**: Tin tức và bài viết
- **NewsCategories**: Danh mục tin tức

### Đặc điểm
- **Role-based System**: 3 vai trò chính
- **Status Tracking**: Theo dõi trạng thái booking
- **Price Calculation**: Tính giá dựa trên diện tích
- **Audit Fields**: CreatedAt, UpdatedAt

## 🚀 Tính năng nổi bật

### 📅 Booking System
- **Service Selection**: Chọn dịch vụ dọn dẹp
- **Area Size Calculation**: Tính giá theo diện tích
- **Time Slot Booking**: Đặt khung giờ làm việc
- **Cleaner Assignment**: Phân công cleaner
- **Status Tracking**: Theo dõi trạng thái booking

### 💰 Pricing System
- **Base Price**: Giá cơ bản cho mỗi dịch vụ
- **Area Multiplier**: Hệ số nhân theo diện tích
- **Dynamic Pricing**: Tính giá động
- **Transparent Pricing**: Giá cả minh bạch

### ⭐ Review & Rating
- **Cleaner Reviews**: Đánh giá cleaner
- **Service Quality**: Đánh giá chất lượng dịch vụ
- **Rating System**: Hệ thống điểm từ 1-5
- **Comment System**: Bình luận chi tiết

### 📰 News & Blog
- **News Management**: Quản lý tin tức
- **Category System**: Phân loại bài viết
- **Tag System**: Hệ thống tags
- **Featured Articles**: Bài viết nổi bật

### 🔔 Notification System
- **Real-time Notifications**: Thông báo real-time
- **Booking Updates**: Cập nhật trạng thái booking
- **Payment Notifications**: Thông báo thanh toán
- **System Notifications**: Thông báo hệ thống

## 🎨 Giao diện người dùng

### User Interface
- **Modern Design**: Giao diện hiện đại với Tailwind CSS
- **Responsive Layout**: Tương thích mọi thiết bị
- **Interactive Components**: Radix UI components
- **Dark/Light Mode**: Hỗ trợ chế độ tối/sáng

### Key Pages
- **Home**: Trang chủ với dịch vụ nổi bật
- **Services**: Danh sách dịch vụ
- **Booking**: Đặt lịch dọn dẹp
- **Profile**: Quản lý thông tin cá nhân
- **Orders**: Lịch sử đặt lịch
- **News**: Tin tức và bài viết

## 🔒 Security Features

### Authentication
- **JWT Token**: Secure API authentication
- **Password Protection**: Bảo vệ mật khẩu
- **Role-based Access**: Phân quyền theo vai trò
- **Session Management**: Quản lý phiên đăng nhập

### Authorization
- **API Protection**: Bảo vệ API endpoints
- **Page Authorization**: Bảo vệ trang web
- **Resource Access**: Kiểm soát truy cập tài nguyên

### Data Protection
- **Input Validation**: Validate dữ liệu đầu vào
- **SQL Injection Prevention**: EF Core protection
- **XSS Prevention**: Output encoding
- **CORS Configuration**: Cross-origin security

## 📊 Business Features

### Booking Management
- **Booking Creation**: Tạo booking mới
- **Status Updates**: Cập nhật trạng thái
- **Cleaner Assignment**: Phân công cleaner
- **Schedule Management**: Quản lý lịch trình

### Payment System
- **Payment Processing**: Xử lý thanh toán
- **Payment Tracking**: Theo dõi thanh toán
- **Transaction History**: Lịch sử giao dịch
- **Payment Status**: Trạng thái thanh toán

### Analytics & Reporting
- **Booking Analytics**: Phân tích đặt lịch
- **Revenue Reports**: Báo cáo doanh thu
- **User Analytics**: Phân tích người dùng
- **Service Performance**: Hiệu suất dịch vụ

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Type safety
- **Zod Validation**: Runtime validation
- **Error Handling**: Comprehensive error handling
- **Logging**: Structured logging

### Performance
- **Next.js Optimization**: Built-in optimizations
- **Database Indexing**: Optimized queries
- **Image Optimization**: Next.js Image component
- **Bundle Optimization**: Tree shaking

## 📝 License

Dự án được phát triển cho mục đích học tập và nghiên cứu.

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ

- **Email**: admin@careu.com
- **Project Link**: [https://github.com/your-username/exe201](https://github.com/your-username/exe201)

---

⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star! 