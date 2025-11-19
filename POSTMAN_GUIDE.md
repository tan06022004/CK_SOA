# Postman API Testing Guide

Base URL: `http://localhost:5000/api`

---

## 🔑 Bước 1: Lấy Token (Login)

### Request
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "manager@hotel.com",
    "password": "123456"
  }
  ```

### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Manager",
  "email": "manager@hotel.com",
  "role": "manager",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**📌 Lưu token này để dùng cho các request sau!**

---

## 🔐 Authentication APIs

### 1. Get Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Response:**
  ```json
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Manager",
    "email": "manager@hotel.com",
    "role": "manager"
  }
  ```

### 2. Logout
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/logout`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Response:**
  ```json
  {
    "message": "Đăng xuất thành công"
  }
  ```

---

## 📅 Booking APIs

### 3. Create Booking
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/bookings`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "guestInfo": {
      "fullName": "Nguyen Van A",
      "phoneNumber": "0901234567",
      "email": "guest@example.com"
    },
    "roomId": "ROOM_ID_HERE",
    "checkInDate": "2025-12-01",
    "checkOutDate": "2025-12-05",
    "numberOfGuests": 2
  }
  ```
  **Hoặc dùng customerId nếu guest đã tồn tại:**
  ```json
  {
    "customerId": "GUEST_ID_HERE",
    "roomId": "ROOM_ID_HERE",
    "checkInDate": "2025-12-01",
    "checkOutDate": "2025-12-05",
    "numberOfGuests": 2
  }
  ```

### 4. Get All Bookings
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/bookings`
- **Query Params (optional):**
  - `status`: `confirmed`, `checked_in`, `checked_out`, `cancelled`
  - `customerId`: Guest ID
  - `roomId`: Room ID
  - `fromDate`: `2025-12-01`
  - `toDate`: `2025-12-31`
- **Example:** `http://localhost:5000/api/bookings?status=confirmed`

### 5. Get Booking by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/bookings/:bookingId`
- **Replace `:bookingId` với ID thực tế**

### 6. Update Booking
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/bookings/:bookingId`
- **Body:**
  ```json
  {
    "numberOfGuests": 3,
    "status": "confirmed"
  }
  ```

### 7. Cancel Booking
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/bookings/:bookingId/cancel`

### 8. Generate Invoice
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/bookings/:bookingId/invoice`

---

## 🏨 Room APIs

### 9. Get All Rooms
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/rooms`
- **Query Params (optional):**
  - `status`: `available`, `occupied`, `dirty`, `cleaning`, `maintenance`
  - `roomTypeId`: Room Type ID
  - `floor`: Floor number
- **Example:** `http://localhost:5000/api/rooms?status=available`

### 10. Get Room by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/rooms/:roomId`

### 11. Create Room (Manager only)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/rooms`
- **Body:**
  ```json
  {
    "roomNumber": "201",
    "roomTypeId": "ROOM_TYPE_ID_HERE",
    "floor": "2",
    "status": "available"
  }
  ```

### 12. Update Room Info (Manager only)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/rooms/:roomId`
- **Body:**
  ```json
  {
    "roomNumber": "201",
    "roomTypeId": "ROOM_TYPE_ID_HERE",
    "floor": "2"
  }
  ```

### 13. Update Room Status
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/rooms/:roomId/status`
- **Body:**
  ```json
  {
    "status": "dirty"
  }
  ```
  **Valid statuses:** `available`, `occupied`, `dirty`, `cleaning`, `maintenance`

### 14. Search Available Rooms (Receptionist only)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/rooms/available`
- **Query Params (required):**
  - `checkInDate`: `2025-12-01`
  - `checkOutDate`: `2025-12-05`
  - `roomTypeId` (optional)
  - `capacity` (optional)
- **Example:** `http://localhost:5000/api/rooms/available?checkInDate=2025-12-01&checkOutDate=2025-12-05`

### 15. Get Cleaning Rooms (Housekeeper only)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/rooms/cleaning`

### 16. Get Maintenance Rooms
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/rooms/maintenance`

### 17. Get Realtime Room Status
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/rooms/status/realtime`

---

## 👥 Guest APIs

### 18. Get All Guests
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/guests`
- **Query Params (optional):**
  - `name`: Search by name
  - `phoneNumber`: Search by phone
- **Example:** `http://localhost:5000/api/guests?name=Nguyen`

### 19. Get Guest by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/guests/:guestId`

### 20. Create Guest
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/guests`
- **Body:**
  ```json
  {
    "fullName": "Nguyen Van A",
    "phoneNumber": "0901234567",
    "email": "guest@example.com",
    "address": "123 Main St"
  }
  ```

### 21. Update Guest
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/guests/:guestId`
- **Body:**
  ```json
  {
    "fullName": "Nguyen Van A Updated",
    "phoneNumber": "0901234567",
    "email": "newemail@example.com",
    "address": "456 New St"
  }
  ```

---

## 🚪 Check-in/Check-out APIs

### 22. Check-in (Receptionist only)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/checkin`
- **Body:**
  ```json
  {
    "bookingId": "BOOKING_ID_HERE"
  }
  ```

### 23. Check-out (Receptionist only)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/checkout`
- **Body:**
  ```json
  {
    "bookingId": "BOOKING_ID_HERE"
  }
  ```

---

## 💰 Payment APIs

### 24. Record Payment
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/payments`
- **Body:**
  ```json
  {
    "invoiceId": "INVOICE_ID_HERE",
    "paymentMethod": "cash"
  }
  ```
  **Valid payment methods:** `cash`, `card`, `bank_transfer`, `online`

### 25. Get Transaction History
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/transactions`
- **Query Params (optional):**
  - `fromDate`: `2025-12-01`
  - `toDate`: `2025-12-31`
  - `method`: `cash`, `card`, etc.
- **Example:** `http://localhost:5000/api/transactions?fromDate=2025-12-01&toDate=2025-12-31`

---

## 📄 Invoice APIs

### 26. Get All Invoices
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/invoices`
- **Query Params (optional):**
  - `status`: `pending`, `paid`, `cancelled`
  - `bookingId`: Booking ID
  - `fromDate`: `2025-12-01`
  - `toDate`: `2025-12-31`

### 27. Get Invoice by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/invoices/:invoiceId`

### 28. Get Guest Invoice View
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/invoices/guest/:bookingId`

### 29. Get Financial Invoice View (Accountant only)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/invoices/financial/:bookingId`

---

## 🔧 Maintenance APIs

### 30. Report Maintenance Issue
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/maintenance/issues`
- **Body:**
  ```json
  {
    "roomId": "ROOM_ID_HERE",
    "description": "Điều hòa không hoạt động",
    "priority": "high"
  }
  ```
  **Valid priorities:** `low`, `medium`, `high`

### 31. Get All Maintenance Requests
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/maintenance/requests`
- **Query Params (optional):**
  - `status`: `reported`, `in_progress`, `completed`, `cancelled`
  - `roomId`: Room ID
  - `assignedToUserId`: User ID

### 32. Get Maintenance Request by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/maintenance/requests/:requestId`

### 33. Update Maintenance Request
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/maintenance/:requestId`
- **Body:**
  ```json
  {
    "status": "in_progress",
    "assignedTo": "USER_ID_HERE"
  }
  ```

### 34. Complete Maintenance Task
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/maintenance/:requestId/complete`

---

## 📊 Report APIs

### 35. Generate Occupancy Report
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/reports/occupancy`
- **Query Params (required):**
  - `fromDate`: `2025-12-01`
  - `toDate`: `2025-12-31`
- **Example:** `http://localhost:5000/api/reports/occupancy?fromDate=2025-12-01&toDate=2025-12-31`

### 36. Generate Revenue Report
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/reports/revenue`
- **Query Params (required):**
  - `fromDate`: `2025-12-01`
  - `toDate`: `2025-12-31`

### 37. List Generated Reports
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/reports`
- **Query Params (optional):**
  - `type`: `revenue`, `occupancy`, `maintenance`, `guest`

### 38. Get Generated Report by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/reports/:reportId`

### 39. Export Comprehensive Report
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/reports/comprehensive/export`
- **Note:** Returns 501 Not Implemented

---

## 🏷️ Room Type APIs

### 40. Get All Room Types
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/room-types`

### 41. Get Room Type by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/room-types/:id`

### 42. Create Room Type (Manager only)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/room-types`
- **Body:**
  ```json
  {
    "typeName": "Suite",
    "description": "Phòng suite cao cấp",
    "basePrice": 1000000,
    "capacity": 4,
    "amenities": ["wifi", "tv", "ac", "bathtub", "minibar"]
  }
  ```

### 43. Update Room Type (Manager only)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/room-types/:id`
- **Body:**
  ```json
  {
    "typeName": "Suite Premium",
    "basePrice": 1200000,
    "capacity": 4,
    "amenities": ["wifi", "tv", "ac", "bathtub", "minibar"]
  }
  ```

### 44. Delete Room Type (Manager only)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/room-types/:id`

---

## 👨‍💼 Employee APIs (Manager only)

### 45. Get All Employees
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/employees`
- **Query Params (optional):**
  - `role`: Filter by role

### 46. Create Employee
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/employees`
- **Body:**
  ```json
  {
    "name": "New Employee",
    "email": "newemployee@hotel.com",
    "password": "123456",
    "role": "receptionist"
  }
  ```
  **Valid roles:** `receptionist`, `housekeeper`, `maintenance`, `accountant`, `manager`

### 47. Get Employee by ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/employees/:id`

### 48. Update Employee
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/employees/:id`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "email": "updated@hotel.com",
    "role": "accountant"
  }
  ```

### 49. Delete Employee
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/employees/:id`

---

## 📈 Dashboard APIs

### 50. Get Revenue Dashboard (Manager only)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/dashboard/revenue`
- **Query Params (optional):**
  - `fromDate`: `2025-12-01`
  - `toDate`: `2025-12-31`

---

## 📝 Cách sử dụng Postman

### Bước 1: Tạo Environment Variable cho Token

1. Click vào **Environments** (bên trái)
2. Click **+** để tạo environment mới
3. Thêm biến:
   - **Variable:** `token`
   - **Initial Value:** (để trống)
   - **Current Value:** (sẽ tự động cập nhật)

### Bước 2: Setup Auto Token

1. Tạo request **Login**
2. Trong tab **Tests**, thêm script:
   ```javascript
   if (pm.response.code === 200) {
       const jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
       console.log("Token saved:", jsonData.token);
   }
   ```
3. Sau khi chạy Login, token sẽ tự động lưu

### Bước 3: Sử dụng Token trong các Request

1. Vào tab **Authorization**
2. Chọn type: **Bearer Token**
3. Trong Token field, nhập: `{{token}}`
4. Hoặc trong Headers, thêm:
   ```
   Authorization: Bearer {{token}}
   ```

### Bước 4: Tạo Collection

1. Click **New** → **Collection**
2. Đặt tên: "Hotel Management API"
3. Thêm các request vào collection
4. Set Authorization cho cả collection:
   - Vào collection settings
   - Tab **Authorization**
   - Type: **Bearer Token**
   - Token: `{{token}}`

---

## 🧪 Test Flow Example

### 1. Login
```
POST /api/auth/login
→ Lưu token
```

### 2. Get Rooms
```
GET /api/rooms
→ Lấy roomId
```

### 3. Get Room Types
```
GET /api/room-types
→ Lấy roomTypeId
```

### 4. Create Guest
```
POST /api/guests
→ Lấy guestId
```

### 5. Create Booking
```
POST /api/bookings
→ Lấy bookingId
```

### 6. Check-in
```
POST /api/checkin
Body: { "bookingId": "..." }
```

### 7. Check-out
```
POST /api/checkout
Body: { "bookingId": "..." }
→ Tự động tạo invoice
```

### 8. Record Payment
```
POST /api/payments
Body: { "invoiceId": "...", "paymentMethod": "cash" }
```

---

## ⚠️ Lưu ý

1. **Tất cả endpoints (trừ login) đều cần token**
2. **Thay `:id`, `:bookingId`, `:roomId` bằng ID thực tế**
3. **Kiểm tra role permissions trước khi test**
4. **Date format:** `YYYY-MM-DD` hoặc ISO format
5. **Response codes:**
   - `200` - Success
   - `201` - Created
   - `400` - Bad Request
   - `401` - Unauthorized
   - `403` - Forbidden
   - `404` - Not Found

---

## 📋 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| manager@hotel.com | 123456 | Manager |
| receptionist@hotel.com | 123456 | Receptionist |
| accountant@hotel.com | 123456 | Accountant |
| housekeeper@hotel.com | 123456 | Housekeeper |
| maintenance@hotel.com | 123456 | Maintenance |

