-- Tạo database CareU
CREATE DATABASE CareU;
GO

USE CareU;
GO

-- Bảng Users (Người dùng)
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('user', 'cleaner', 'admin')),
    Status NVARCHAR(20) DEFAULT 'active' CHECK (Status IN ('active', 'pending', 'inactive')),
    Experience NVARCHAR(50) NULL, -- Chỉ cho cleaner
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Bảng Services (Dịch vụ)
CREATE TABLE Services (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    BasePrice DECIMAL(10,2) NOT NULL,
    Duration NVARCHAR(50), -- VD: "2-4 giờ"
    Icon NVARCHAR(10), -- Emoji icon
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Bảng AreaSizes (Kích thước diện tích)
CREATE TABLE AreaSizes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL, -- VD: "Nhỏ (< 50m²)"
    Multiplier DECIMAL(3,2) NOT NULL, -- Hệ số nhân giá
    IsActive BIT DEFAULT 1
);

-- Bảng TimeSlots (Khung giờ làm việc)
CREATE TABLE TimeSlots (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TimeRange NVARCHAR(50) NOT NULL, -- VD: "08:00 - 10:00"
    IsActive BIT DEFAULT 1
);

-- Bảng Bookings (Đặt lịch)
CREATE TABLE Bookings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ServiceId INT NOT NULL,
    AreaSizeId INT NOT NULL,
    TimeSlotId INT NULL,
    CleanerId INT NULL,
    BookingDate DATE NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    ContactName NVARCHAR(100) NOT NULL,
    ContactPhone NVARCHAR(20) NOT NULL,
    Notes NVARCHAR(500),
    TotalPrice DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'pending' CHECK (Status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ServiceId) REFERENCES Services(Id),
    FOREIGN KEY (AreaSizeId) REFERENCES AreaSizes(Id),
    FOREIGN KEY (TimeSlotId) REFERENCES TimeSlots(Id),
    FOREIGN KEY (CleanerId) REFERENCES Users(Id)
);

-- Bảng Reviews (Đánh giá)
CREATE TABLE Reviews (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BookingId INT NOT NULL,
    UserId INT NOT NULL,
    CleanerId INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (BookingId) REFERENCES Bookings(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CleanerId) REFERENCES Users(Id)
);

-- Bảng Payments (Thanh toán)
CREATE TABLE Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BookingId INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod NVARCHAR(50), -- VD: "cash", "card", "transfer"
    PaymentStatus NVARCHAR(20) DEFAULT 'pending' CHECK (PaymentStatus IN ('pending', 'completed', 'failed')),
    TransactionId NVARCHAR(100),
    PaidAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

-- Bảng Notifications (Thông báo)
CREATE TABLE Notifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    Type NVARCHAR(50), -- VD: "booking", "payment", "system"
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Insert dữ liệu mẫu

-- Services
INSERT INTO Services (Name, Description, BasePrice, Duration, Icon) VALUES
(N'Dọn Nhà Định Kỳ', N'Dịch vụ dọn dẹp nhà cửa hàng tuần, hàng tháng với đội ngũ chuyên nghiệp', 300000, N'2-4 giờ', N'🏠'),
(N'Dọn Văn Phòng', N'Vệ sinh văn phòng chuyên nghiệp, tạo môi trường làm việc sạch sẽ', 500000, N'3-5 giờ', N'🏢'),
(N'Dọn Sau Xây Dựng', N'Dọn dẹp chuyên sâu sau khi sửa chữa, xây dựng hoặc cải tạo', 800000, N'4-8 giờ', N'🔨'),
(N'Dọn Cuối Năm', N'Dọn dẹp tổng thể, chuẩn bị đón Tết Nguyên Đán trọn vẹn', 600000, N'4-6 giờ', N'🎊');

-- AreaSizes
INSERT INTO AreaSizes (Name, Multiplier) VALUES
(N'Nhỏ (< 50m²)', 1.0),
(N'Trung bình (50-100m²)', 1.5),
(N'Lớn (100-200m²)', 2.0),
(N'Rất lớn (> 200m²)', 2.5);

-- TimeSlots
INSERT INTO TimeSlots (TimeRange) VALUES
(N'08:00 - 10:00'),
(N'10:00 - 12:00'),
(N'14:00 - 16:00'),
(N'16:00 - 18:00');

-- Demo Users
INSERT INTO Users (Name, Email, Password, Phone, Address, Role, Status) VALUES
(N'Nguyễn Văn A', 'user@demo.com', '123456', '0123456789', N'123 Nguyễn Văn Linh, Q.7, TP.HCM', 'user', 'active'),
(N'Trần Thị B', 'cleaner@demo.com', '123456', '0987654321', N'456 Lê Văn Việt, Q.9, TP.HCM', 'cleaner', 'active'),
(N'Admin', 'admin@demo.com', '123456', '0111222333', N'789 Nguyễn Thị Minh Khai, Q.1, TP.HCM', 'admin', 'active');

-- Indexes để tối ưu performance
CREATE INDEX IX_Bookings_UserId ON Bookings(UserId);
CREATE INDEX IX_Bookings_CleanerId ON Bookings(CleanerId);
CREATE INDEX IX_Bookings_Status ON Bookings(Status);
CREATE INDEX IX_Bookings_BookingDate ON Bookings(BookingDate);
CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Users_Email ON Users(Email);
