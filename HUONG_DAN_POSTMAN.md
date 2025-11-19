# Hướng Dẫn Sử Dụng Postman

## 📥 Cách Import Collection vào Postman

### Bước 1: Mở Postman
1. Mở ứng dụng Postman
2. Click **Import** (góc trên bên trái)

### Bước 2: Import File
1. Chọn tab **File**
2. Click **Upload Files**
3. Chọn file `Postman_Collection.json` trong thư mục project
4. Click **Import**

### Bước 3: Setup Environment (Tùy chọn)
1. Click **Environments** (bên trái)
2. Click **+** để tạo mới
3. Đặt tên: "Hotel Management"
4. Thêm biến:
   - **Variable:** `baseUrl`
   - **Initial Value:** `http://localhost:5000/api`
   - **Current Value:** `http://localhost:5000/api`
5. Thêm biến:
   - **Variable:** `token`
   - **Initial Value:** (để trống)
   - **Current Value:** (sẽ tự động cập nhật)

### Bước 4: Chọn Environment
1. Ở góc trên bên phải, chọn environment "Hotel Management"

---

## 🚀 Cách Sử Dụng

### Bước 1: Login để lấy Token
1. Mở folder **Authentication**
2. Chọn request **Login**
3. Click **Send**
4. Token sẽ tự động lưu vào biến `token`
5. Kiểm tra console để xem token đã được lưu

### Bước 2: Test các API khác
1. Tất cả các request khác đã tự động sử dụng token
2. Chỉ cần thay các ID placeholder (`ROOM_ID_HERE`, `BOOKING_ID_HERE`, etc.) bằng ID thực tế
3. Click **Send** để test

---

## 📋 Danh Sách Tất Cả Endpoints

### 🔐 Authentication (3 endpoints)
1. **POST** `/api/auth/login` - Đăng nhập
2. **GET** `/api/auth/profile` - Lấy thông tin profile
3. **POST** `/api/auth/logout` - Đăng xuất

### 📅 Bookings (6 endpoints)
4. **POST** `/api/bookings` - Tạo booking
5. **GET** `/api/bookings` - Lấy tất cả bookings
6. **GET** `/api/bookings/:bookingId` - Lấy booking theo ID
7. **PUT** `/api/bookings/:bookingId` - Cập nhật booking
8. **POST** `/api/bookings/:bookingId/cancel` - Hủy booking
9. **POST** `/api/bookings/:bookingId/invoice` - Tạo hóa đơn

### 🏨 Rooms (9 endpoints)
10. **GET** `/api/rooms` - Lấy tất cả phòng
11. **GET** `/api/rooms/:roomId` - Lấy phòng theo ID
12. **POST** `/api/rooms` - Tạo phòng (Manager)
13. **PUT** `/api/rooms/:roomId` - Cập nhật thông tin phòng (Manager)
14. **PUT** `/api/rooms/:roomId/status` - Cập nhật trạng thái phòng
15. **GET** `/api/rooms/available` - Tìm phòng trống (Receptionist)
16. **GET** `/api/rooms/cleaning` - Lấy phòng cần dọn (Housekeeper)
17. **GET** `/api/rooms/maintenance` - Lấy phòng bảo trì
18. **GET** `/api/rooms/status/realtime` - Trạng thái phòng realtime

### 👥 Guests (4 endpoints)
19. **GET** `/api/guests` - Lấy tất cả khách
20. **GET** `/api/guests/:guestId` - Lấy khách theo ID
21. **POST** `/api/guests` - Tạo khách mới
22. **PUT** `/api/guests/:guestId` - Cập nhật khách

### 🚪 Check-in/Check-out (2 endpoints)
23. **POST** `/api/checkin` - Check-in (Receptionist)
24. **POST** `/api/checkout` - Check-out (Receptionist)

### 💰 Payments (2 endpoints)
25. **POST** `/api/payments` - Ghi nhận thanh toán
26. **GET** `/api/transactions` - Lịch sử giao dịch

### 📄 Invoices (4 endpoints)
27. **GET** `/api/invoices` - Lấy tất cả hóa đơn
28. **GET** `/api/invoices/:invoiceId` - Lấy hóa đơn theo ID
29. **GET** `/api/invoices/guest/:bookingId` - Xem hóa đơn khách
30. **GET** `/api/invoices/financial/:bookingId` - Xem hóa đơn tài chính (Accountant)

### 🔧 Maintenance (5 endpoints)
31. **POST** `/api/maintenance/issues` - Báo cáo sự cố
32. **GET** `/api/maintenance/requests` - Lấy tất cả yêu cầu
33. **GET** `/api/maintenance/requests/:requestId` - Lấy yêu cầu theo ID
34. **PUT** `/api/maintenance/:requestId` - Cập nhật yêu cầu
35. **PUT** `/api/maintenance/:requestId/complete` - Hoàn thành

### 📊 Reports (5 endpoints)
36. **GET** `/api/reports/occupancy` - Tạo báo cáo tỷ lệ lấp đầy
37. **GET** `/api/reports/revenue` - Tạo báo cáo doanh thu
38. **GET** `/api/reports` - Danh sách báo cáo
39. **GET** `/api/reports/:reportId` - Lấy báo cáo theo ID
40. **GET** `/api/reports/comprehensive/export` - Xuất báo cáo tổng hợp

### 🏷️ Room Types (5 endpoints)
41. **GET** `/api/room-types` - Lấy tất cả loại phòng
42. **GET** `/api/room-types/:id` - Lấy loại phòng theo ID
43. **POST** `/api/room-types` - Tạo loại phòng (Manager)
44. **PUT** `/api/room-types/:id` - Cập nhật loại phòng (Manager)
45. **DELETE** `/api/room-types/:id` - Xóa loại phòng (Manager)

### 👨‍💼 Employees (5 endpoints)
46. **GET** `/api/employees` - Lấy tất cả nhân viên (Manager)
47. **POST** `/api/employees` - Tạo nhân viên (Manager)
48. **GET** `/api/employees/:id` - Lấy nhân viên theo ID (Manager)
49. **PUT** `/api/employees/:id` - Cập nhật nhân viên (Manager)
50. **DELETE** `/api/employees/:id` - Xóa nhân viên (Manager)

### 📈 Dashboard (1 endpoint)
51. **GET** `/api/dashboard/revenue` - Doanh thu dashboard (Manager)

**Tổng cộng: 51 endpoints**

---

## 📝 Input/Output Chi Tiết

Xem file `API_ENDPOINTS_COMPLETE.md` để biết chi tiết input/output của từng endpoint.

---

## 🧪 Test Flow Mẫu

### 1. Login
```
POST /api/auth/login
Body: {
  "email": "manager@hotel.com",
  "password": "123456"
}
→ Lưu token tự động
```

### 2. Lấy Room Types
```
GET /api/room-types
→ Lấy roomTypeId
```

### 3. Tạo Room
```
POST /api/rooms
Body: {
  "roomNumber": "101",
  "roomTypeId": "ROOM_TYPE_ID",
  "floor": "1",
  "status": "available"
}
→ Lấy roomId
```

### 4. Tạo Guest
```
POST /api/guests
Body: {
  "fullName": "Nguyen Van A",
  "phoneNumber": "0901234567",
  "email": "guest@example.com"
}
→ Lấy guestId
```

### 5. Tạo Booking
```
POST /api/bookings
Body: {
  "customerId": "GUEST_ID",
  "roomId": "ROOM_ID",
  "checkInDate": "2025-12-01",
  "checkOutDate": "2025-12-05",
  "numberOfGuests": 2
}
→ Lấy bookingId
```

### 6. Check-in
```
POST /api/checkin
Body: {
  "bookingId": "BOOKING_ID"
}
```

### 7. Check-out
```
POST /api/checkout
Body: {
  "bookingId": "BOOKING_ID"
}
→ Tự động tạo invoice
```

### 8. Thanh toán
```
POST /api/payments
Body: {
  "invoiceId": "INVOICE_ID",
  "paymentMethod": "cash"
}
```

---

## ⚠️ Lưu Ý

1. **Token tự động:** Sau khi login, token sẽ tự động lưu và dùng cho tất cả request
2. **Thay ID:** Nhớ thay các placeholder ID (`ROOM_ID_HERE`, etc.) bằng ID thực tế
3. **Role permissions:** Một số endpoint chỉ dành cho role cụ thể
4. **Date format:** Sử dụng `YYYY-MM-DD` hoặc ISO format
5. **Backend phải chạy:** Đảm bảo backend đang chạy trên port 5000

---

## 🔍 Troubleshooting

### Lỗi 401 Unauthorized
- Token đã hết hạn hoặc không hợp lệ
- Chạy lại request Login để lấy token mới

### Lỗi 403 Forbidden
- Role của bạn không có quyền truy cập endpoint này
- Đăng nhập bằng account có role phù hợp

### Lỗi 404 Not Found
- ID không tồn tại
- Kiểm tra lại ID trong URL

### Lỗi Connection Refused
- Backend chưa chạy
- Kiểm tra backend đang chạy trên port 5000

