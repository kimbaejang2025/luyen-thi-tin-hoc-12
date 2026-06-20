# Kế hoạch thực hiện: Web App Luyện Thi Tốt Nghiệp THPT - Tin Học

Dự án này là một ứng dụng web (SPA) hiện đại được phát triển bằng **React** (sử dụng build tool **Vite**) và thiết kế giao diện bằng **Vanilla CSS** (không dùng Tailwind để đảm bảo tính tùy biến tối đa và ổn định). Toàn bộ dữ liệu (tài khoản, đề thi, lịch sử thi, kiến thức tổng hợp) được quản lý qua `localStorage` để cho phép tương tác trực tiếp: đăng ký, thi thử, chấm điểm tự động, quản trị nội dung và quản trị thành viên.

## Giao diện & Trải nghiệm Người dùng (UI/UX)

- **Chủ đề thiết kế**: Hiện đại, mượt mà với hiệu ứng kính mờ (Glassmorphism), viền phát sáng nhẹ, chuyển đổi linh hoạt chế độ Sáng/Tối (Light/Dark Mode).
- **Màu sắc chủ đạo**:
  - Tông tối: Nền xanh đen phi hành vũ trụ (`#020617`), các card màu xanh đá đậm (`#0b1329`), điểm nhấn màu Indigo (`#6366f1`) và Emerald xanh lá (`#22c55e`) cho CTA/Đúng.
  - Tông sáng: Nền Slate nhạt (`#f8fafc`), card trắng tinh tế (`#ffffff`), viền xám sáng (`#e2e8f0`), chữ tối Slate (`#0f172a`).
- **Phông chữ**: Sử dụng phông chữ Google Fonts **Inter** và **Plus Jakarta Sans** hỗ trợ đầy đủ tiếng Việt không lỗi font, mang lại cảm giác chuyên nghiệp, dễ đọc và đậm chất kỹ thuật số.
- **Biểu tượng**: Sử dụng các icon định dạng SVG tùy biến chất lượng cao từ bộ Lucide, đảm bảo hiệu năng tải trang tối ưu và hiển thị sắc nét.

---

## Các Tính năng Chính

### 1. Phân quyền Người dùng (Auth System)

- **Học viên (User)**:
  - Đăng ký tài khoản mới: Họ & tên, Username (tên đăng nhập), Mật khẩu.
  - Đăng nhập vào hệ thống.
  - Học kiến thức tổng hợp theo chủ đề, làm bài thi trắc nghiệm thử (có tính thời gian, chấm điểm và xem lời giải chi tiết), xem lịch sử thi cá nhân.
- **Quản trị viên (Admin)**:
  - Đăng nhập bằng tài khoản admin mặc định (`admin`/`admin123`).
  - Trang quản trị thành viên (Quản lý User): Xem danh sách, thêm, sửa thông tin, xóa tài khoản học viên và xem kết quả học tập của từng học viên.
  - Trang quản trị nội dung: Thêm, sửa, xóa các chủ đề kiến thức tổng hợp, các đề thi và các tài liệu tham khảo.

### 2. Các Phân hệ Nội dung

- **Kiến thức tổng hợp (7 Chủ đề theo chương trình mới)**:

  1. Trí tuệ nhân tạo (AI)
  2. Mạng máy tính
  3. Giao tiếp không gian mạng
  4. Hướng nghiệp với Tin học
  5. Web (HTML + CSS)
  6. Python
  7. Cơ sở dữ liệu

  - Mỗi chủ đề sẽ chứa nội dung lý thuyết tóm tắt thiết kế đẹp, các ví dụ trực quan và bộ câu hỏi trắc nghiệm ôn tập nhanh theo chủ đề đó.
- **Đề thi thử & tham khảo**: Phân chia rõ ràng thành 3 mục:

  - Đề thi các trường THPT (đề thi thử trường chuyên, trường điểm).
  - Đề thi các sở giáo dục và đào tạo (Hà Nội, TP.HCM, Đà Nẵng...).
  - Đề thi tham khảo (Đề minh họa của Bộ GD&ĐT).
  - Giao diện làm bài thi trực quan: đồng hồ đếm ngược, bảng lưới câu hỏi để theo dõi tiến độ, nộp bài tự động khi hết giờ, hiển thị bảng điểm và phản hồi đáp án chi tiết.
- **Tài liệu tham khảo**:

  - Kho tài liệu PDF, sách giáo khoa, infographic ôn tập.
  - Hỗ trợ xem trực tuyến và tải về.

---

## Kiến trúc Thư mục Đề xuất (React + Vite)

Ứng dụng sẽ được khởi tạo trong thư mục hiện tại:

```
c:/LT/Webapp/Webtest_2/
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx          # Thanh điều hướng và menu
│   │   ├── Hero.jsx            # Banner chào mừng & số liệu thống kê
│   │   ├── TopicCard.jsx       # Card hiển thị chủ đề kiến thức
│   │   ├── ExamCard.jsx        # Card đề thi và liên kết làm bài
│   │   ├── ExamSession.jsx     # Giao diện làm bài thi, đếm ngược, chấm điểm
│   │   ├── DashboardAdmin.jsx  # Trang quản trị của Admin (quản lý user, đề thi, nội dung)
│   │   ├── AuthModal.jsx       # Modal đăng nhập / đăng ký đẹp mắt
│   │   └── Icons.jsx           # Định nghĩa các SVG Icon Lucide dùng lại
│   └── data/
│       └── seedData.js         # Dữ liệu mẫu (chủ đề, đề thi, câu hỏi, tài liệu)
├── package.json
└── vite.config.js
```

---

## Kế hoạch Thực hiện Chi tiết

### Bước 1: Khởi tạo và Thiết lập Môi trường

1. Chạy lệnh tạo dự án Vite React bằng `npx.cmd`.
2. Dọn dẹp cấu trúc mặc định, thiết lập cấu hình CSS toàn cục trong `src/index.css`.
3. Định nghĩa bảng màu CSS variables cho cả hai chế độ Light/Dark.
4. Cài đặt các thư viện bổ trợ cần thiết (nếu có, tuy nhiên chúng ta sẽ ưu tiên code thuần JS/CSS để tối ưu hóa hiệu năng).

### Bước 2: Tạo Dữ liệu mẫu (Seed Data)

Tạo file `src/data/seedData.js` chứa:

- Nội dung chi tiết của 7 chủ đề Tin học THPT mới (lý thuyết tóm tắt, từ khóa chính).
- Ít nhất 4-5 đề thi chất lượng cao (gồm đề minh họa Bộ, đề thi Sở Hà Nội, đề THPT Chuyên) với 24-40 câu hỏi trắc nghiệm Tin học mỗi đề (chương trình 12 mới như AI, Python, CSDL, Mạng, Web).
- Danh sách tài liệu tham khảo hữu ích.
- Tài khoản Admin (`admin`/`admin123`) và tài khoản User mẫu.

### Bước 3: Phát triển CSS Core & Layout

- Thiết kế hệ thống CSS Typography sử dụng phông chữ Inter và Plus Jakarta Sans từ Google Fonts.
- Phát triển hệ thống layout Flexbox/Grid responsive cho điện thoại, máy tính bảng và màn hình máy tính rộng.
- Viết các hiệu ứng Glassmorphism, chuyển động hover của thẻ, hoạt ảnh chuyển đổi tab nhẹ nhàng.

### Bước 4: Xây dựng Giao diện Người dùng (User Flow)

- **Trang chủ & Menu chính**: Cho phép lọc tìm kiếm đề thi và duyệt 7 chủ đề.
- **Trang chi tiết Chủ đề**: Hiển thị bài giảng định dạng Markdown/HTML đẹp mắt và bài trắc nghiệm nhanh 10 câu ôn tập.
- **Trang làm bài thi**: Thiết kế bảng bấm chọn đáp án tiện lợi bên phải (như thi thật trên máy tính), đồng hồ chạy ngược trực quan. Hiển thị báo cáo kết quả thi chi tiết sau khi nộp bài.
- **Lịch sử thi**: Giúp học viên xem lại tiến độ và các bài thi đã làm.

### Bước 5: Xây dựng Trang Quản trị (Admin Flow)

- **Quản lý Thành viên**: Table danh sách học viên, nút Thêm học viên mới, Sửa học viên (Tên, mật khẩu), Xóa học viên. Hiển thị điểm số bài thi cao nhất của học viên đó.
- **Quản lý Đề thi & Câu hỏi**: Giao diện cho phép Admin thêm một đề thi mới, điền tên đề, mô tả, phân loại (Trường THPT / Sở GD / Tham khảo) và nhập danh sách câu hỏi trực tiếp thông qua form.
- **Quản lý Tài liệu**: Thêm hoặc xóa link tài liệu tham khảo.

### Bước 6: Đồng bộ dữ liệu & Kiểm tra (Verification)

- Lưu trữ mọi thao tác CRUD vào `localStorage` của trình duyệt.
- Tự động khôi phục dữ liệu mẫu (Seed Data) nếu `localStorage` trống.
- Kiểm thử các luồng hoạt động:
  - Học viên đăng ký -> Đăng nhập -> Làm bài -> Nộp bài -> Xem điểm lưu vào lịch sử.
  - Admin đăng nhập -> Vào trang Dashboard -> Sửa thông tin tài khoản vừa tạo -> Thêm đề thi mới -> Học viên đăng nhập lại thấy đề thi mới đó và làm bài bình thường.
  - Kiểm tra giao diện hiển thị tiếng Việt, các phông chữ, tính responsive trên mobile và desktop.

---
