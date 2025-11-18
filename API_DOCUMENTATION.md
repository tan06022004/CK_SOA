# API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require authentication header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication APIs

### 1. Login
**POST** `/api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "manager@hotel.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Manager",
  "email": "manager@hotel.com",
  "role": "manager",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Email hoặc mật khẩu không hợp lệ"
}
```

---

### 2. Get Profile
**GET** `/api/auth/profile`

**Access:** Protected (All authenticated users)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Manager",
  "email": "manager@hotel.com",
  "role": "manager"
}
```

---

### 3. Logout
**POST** `/api/auth/logout`

**Access:** Protected (All authenticated users)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Đăng xuất thành công"
}
```

---

## 📅 Booking APIs

### 4. Create Booking
**POST** `/api/bookings`

**Access:** Protected (Receptionist, Manager)

**Request Body:**
```json
{
  "customerId": "507f1f77bcf86cd799439011",  // Optional: existing guest ID
  "guestInfo": {                              // Optional: new guest info (if no customerId)
    "fullName": "Nguyen Van A",
    "phoneNumber": "0901234567",
    "email": "guest@example.com"
  },
  "roomId": "507f1f77bcf86cd799439012",
  "checkInDate": "2025-12-01",
  "checkOutDate": "2025-12-05",
  "numberOfGuests": 2
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "guest": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyen Van A",
    "phoneNumber": "0901234567"
  },
  "room": {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101",
    "roomType": {
      "typeName": "Deluxe",
      "basePrice": 500000
    }
  },
  "checkInDate": "2025-12-01T00:00:00.000Z",
  "checkOutDate": "2025-12-05T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 2000000,
  "status": "confirmed",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439010",
    "name": "Receptionist"
  },
  "createdAt": "2025-11-15T10:30:00.000Z"
}
```

---

### 5. Get All Bookings
**GET** `/api/bookings`

**Access:** Protected (Receptionist, Manager, Accountant)

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`)
- `customerId` (optional): Filter by guest ID
- `roomId` (optional): Filter by room ID
- `fromDate` (optional): Filter from date (ISO format)
- `toDate` (optional): Filter to date (ISO format)

**Example:**
```
GET /api/bookings?status=confirmed&fromDate=2025-12-01
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "guest": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "Nguyen Van A",
      "phoneNumber": "0901234567"
    },
    "room": {
      "_id": "507f1f77bcf86cd799439012",
      "roomNumber": "101"
    },
    "checkInDate": "2025-12-01T00:00:00.000Z",
    "checkOutDate": "2025-12-05T00:00:00.000Z",
    "status": "confirmed",
    "totalPrice": 2000000
  }
]
```

---

### 6. Get Booking by ID
**GET** `/api/bookings/:bookingId`

**Access:** Protected (Receptionist, Manager, Accountant)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "guest": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Nguyen Van A",
    "phoneNumber": "0901234567",
    "email": "guest@example.com"
  },
  "room": {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101",
    "roomType": {
      "_id": "507f1f77bcf86cd799439014",
      "typeName": "Deluxe",
      "basePrice": 500000,
      "capacity": 2
    }
  },
  "checkInDate": "2025-12-01T00:00:00.000Z",
  "checkOutDate": "2025-12-05T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 2000000,
  "status": "confirmed"
}
```

---

### 7. Update Booking
**PUT** `/api/bookings/:bookingId`

**Access:** Protected (Receptionist, Manager)

**Request Body:**
```json
{
  "numberOfGuests": 3,
  "status": "confirmed"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "numberOfGuests": 3,
  "status": "confirmed",
  ...
}
```

---

### 8. Cancel Booking
**POST** `/api/bookings/:bookingId/cancel`

**Access:** Protected (Receptionist, Manager)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "cancelled",
  ...
}
```

---

### 9. Generate Invoice for Booking
**POST** `/api/bookings/:bookingId/invoice`

**Access:** Protected (Receptionist, Manager, Accountant)

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "invoiceId": "INV_1234567890",
  "booking": "507f1f77bcf86cd799439013",
  "totalAmount": 2000000,
  "paymentStatus": "pending",
  "issueDate": "2025-11-15T10:30:00.000Z"
}
```

---

## 🏨 Room APIs

### 10. Get All Rooms
**GET** `/api/rooms`

**Access:** Protected (All authenticated users)

**Query Parameters:**
- `status` (optional): Filter by status (`available`, `occupied`, `dirty`, `cleaning`, `maintenance`)
- `roomTypeId` (optional): Filter by room type ID
- `floor` (optional): Filter by floor

**Example:**
```
GET /api/rooms?status=available&floor=1
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101",
    "floor": "1",
    "status": "available",
    "roomType": {
      "_id": "507f1f77bcf86cd799439014",
      "typeName": "Deluxe",
      "basePrice": 500000,
      "capacity": 2
    },
    "createdAt": "2025-11-01T00:00:00.000Z"
  }
]
```

---

### 11. Get Room by ID
**GET** `/api/rooms/:roomId`

**Access:** Protected (All authenticated users)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "roomNumber": "101",
  "floor": "1",
  "status": "available",
  "roomType": {
    "_id": "507f1f77bcf86cd799439014",
    "typeName": "Deluxe",
    "basePrice": 500000,
    "capacity": 2,
    "amenities": ["wifi", "tv", "ac"]
  }
}
```

---

### 12. Create Room
**POST** `/api/rooms`

**Access:** Protected (Manager only)

**Request Body:**
```json
{
  "roomNumber": "201",
  "roomTypeId": "507f1f77bcf86cd799439014",
  "floor": "2",
  "status": "available"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "roomNumber": "201",
  "floor": "2",
  "status": "available",
  "roomType": {
    "_id": "507f1f77bcf86cd799439014",
    "typeName": "Deluxe"
  }
}
```

---

### 13. Update Room Info
**PUT** `/api/rooms/:roomId`

**Access:** Protected (Manager only)

**Request Body:**
```json
{
  "roomNumber": "201",
  "roomTypeId": "507f1f77bcf86cd799439014",
  "floor": "2"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "roomNumber": "201",
  "floor": "2",
  "roomType": { ... }
}
```

---

### 14. Update Room Status
**PUT** `/api/rooms/:roomId/status`

**Access:** Protected (Receptionist, Housekeeper, Maintenance)

**Request Body:**
```json
{
  "status": "dirty"
}
```

**Valid statuses:** `available`, `occupied`, `dirty`, `cleaning`, `maintenance`

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "status": "dirty",
  ...
}
```

---

### 15. Search Available Rooms
**GET** `/api/rooms/available`

**Access:** Protected (Receptionist only)

**Query Parameters:**
- `checkInDate` (required): Check-in date (ISO format)
- `checkOutDate` (required): Check-out date (ISO format)
- `roomTypeId` (optional): Filter by room type
- `capacity` (optional): Minimum capacity

**Example:**
```
GET /api/rooms/available?checkInDate=2025-12-01&checkOutDate=2025-12-05&capacity=2
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101",
    "roomType": {
      "typeName": "Deluxe",
      "capacity": 2,
      "basePrice": 500000
    },
    "status": "available"
  }
]
```

---

### 16. Get Cleaning Rooms
**GET** `/api/rooms/cleaning`

**Access:** Protected (Housekeeper only)

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101",
    "floor": "1",
    "status": "dirty",
    "roomType": {
      "typeName": "Deluxe"
    }
  }
]
```

---

### 17. Get Maintenance Rooms
**GET** `/api/rooms/maintenance`

**Access:** Protected (Maintenance, Receptionist)

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101",
    "status": "maintenance",
    "roomType": {
      "typeName": "Deluxe"
    }
  }
]
```

---

### 18. Get Realtime Room Status
**GET** `/api/rooms/status/realtime`

**Access:** Protected (Receptionist, Manager)

**Response (200 OK):**
```json
{
  "totalRooms": 50,
  "statsByStatus": [
    { "_id": "available", "count": 20 },
    { "_id": "occupied", "count": 15 },
    { "_id": "dirty", "count": 10 },
    { "_id": "maintenance", "count": 5 }
  ]
}
```

---

## 👥 Guest APIs

### 19. Get All Guests
**GET** `/api/guests`

**Access:** Protected (Receptionist, Manager)

**Query Parameters:**
- `name` (optional): Search by name (partial match)
- `phoneNumber` (optional): Search by phone number

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "customerId": "CUST_1234567890",
    "fullName": "Nguyen Van A",
    "phoneNumber": "0901234567",
    "email": "guest@example.com",
    "address": "123 Main St"
  }
]
```

---

### 20. Get Guest by ID
**GET** `/api/guests/:guestId`

**Access:** Protected (Receptionist, Manager)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "customerId": "CUST_1234567890",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0901234567",
  "email": "guest@example.com",
  "address": "123 Main St"
}
```

---

### 21. Create Guest
**POST** `/api/guests`

**Access:** Protected (Receptionist, Manager)

**Request Body:**
```json
{
  "fullName": "Nguyen Van A",
  "phoneNumber": "0901234567",
  "email": "guest@example.com",
  "address": "123 Main St"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "customerId": "CUST_1234567890",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0901234567",
  "email": "guest@example.com",
  "address": "123 Main St"
}
```

---

### 22. Update Guest
**PUT** `/api/guests/:guestId`

**Access:** Protected (Receptionist, Manager)

**Request Body:**
```json
{
  "fullName": "Nguyen Van A Updated",
  "phoneNumber": "0901234567",
  "email": "newemail@example.com",
  "address": "456 New St"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "Nguyen Van A Updated",
  ...
}
```

---

## 🚪 Check-in/Check-out APIs

### 23. Check-in
**POST** `/api/checkin`

**Access:** Protected (Receptionist only)

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "checked_in",
  "guest": { ... },
  "room": { ... }
}
```

---

### 24. Check-out
**POST** `/api/checkout`

**Access:** Protected (Receptionist only)

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "message": "Check-out thành công, đã tạo hóa đơn.",
  "booking": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "checked_out"
  },
  "invoice": {
    "_id": "507f1f77bcf86cd799439015",
    "invoiceId": "INV_1234567890",
    "totalAmount": 2000000,
    "paymentStatus": "pending"
  }
}
```

---

## 💰 Payment APIs

### 25. Record Payment
**POST** `/api/payments`

**Access:** Protected (Receptionist, Accountant)

**Request Body:**
```json
{
  "invoiceId": "507f1f77bcf86cd799439015",
  "paymentMethod": "cash"
}
```

**Valid payment methods:** `cash`, `card`, `bank_transfer`, `online`

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "invoiceId": "INV_1234567890",
  "totalAmount": 2000000,
  "paymentStatus": "paid",
  "paymentMethod": "cash"
}
```

---

### 26. Get Transaction History
**GET** `/api/transactions`

**Access:** Protected (Accountant, Manager)

**Query Parameters:**
- `fromDate` (optional): Filter from date
- `toDate` (optional): Filter to date
- `method` (optional): Filter by payment method

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "invoiceId": "INV_1234567890",
    "totalAmount": 2000000,
    "paymentStatus": "paid",
    "paymentMethod": "cash",
    "booking": {
      "guest": {
        "fullName": "Nguyen Van A"
      }
    },
    "updatedAt": "2025-11-15T10:30:00.000Z"
  }
]
```

---

## 📄 Invoice APIs

### 27. Get All Invoices
**GET** `/api/invoices`

**Access:** Protected (Receptionist, Manager, Accountant)

**Query Parameters:**
- `status` (optional): Filter by payment status (`pending`, `paid`, `cancelled`)
- `bookingId` (optional): Filter by booking ID
- `fromDate` (optional): Filter from date
- `toDate` (optional): Filter to date

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "invoiceId": "INV_1234567890",
    "booking": {
      "guest": {
        "fullName": "Nguyen Van A"
      },
      "room": "101",
      "checkInDate": "2025-12-01T00:00:00.000Z",
      "checkOutDate": "2025-12-05T00:00:00.000Z"
    },
    "totalAmount": 2000000,
    "paymentStatus": "pending",
    "issueDate": "2025-11-15T10:30:00.000Z"
  }
]
```

---

### 28. Get Invoice by ID
**GET** `/api/invoices/:invoiceId`

**Access:** Protected (Receptionist, Manager, Accountant)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "invoiceId": "INV_1234567890",
  "booking": {
    "guest": { ... },
    "room": {
      "roomNumber": "101",
      "roomType": { ... }
    }
  },
  "totalAmount": 2000000,
  "paymentStatus": "pending",
  "paymentMethod": "cash",
  "issueDate": "2025-11-15T10:30:00.000Z"
}
```

---

### 29. Get Guest Invoice View
**GET** `/api/invoices/guest/:bookingId`

**Access:** Protected (Receptionist, Manager, Accountant)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "invoiceId": "INV_1234567890",
  "booking": {
    "guest": { ... },
    "room": { ... }
  },
  "totalAmount": 2000000,
  "paymentStatus": "pending"
}
```

---

### 30. Get Financial Invoice View
**GET** `/api/invoices/financial/:bookingId`

**Access:** Protected (Accountant only)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "invoiceId": "INV_1234567890",
  "booking": { ... },
  "totalAmount": 2000000,
  "paymentStatus": "paid",
  "paymentMethod": "card"
}
```

---

## 🔧 Maintenance APIs

### 31. Report Maintenance Issue
**POST** `/api/maintenance/issues`

**Access:** Protected (Housekeeper, Receptionist, Manager)

**Request Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439012",
  "description": "Điều hòa không hoạt động",
  "priority": "high"
}
```

**Valid priorities:** `low`, `medium`, `high`

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "room": {
    "_id": "507f1f77bcf86cd799439012",
    "roomNumber": "101"
  },
  "issueDescription": "Điều hòa không hoạt động",
  "priority": "high",
  "status": "reported",
  "reportedBy": {
    "_id": "507f1f77bcf86cd799439010",
    "name": "Receptionist"
  },
  "createdAt": "2025-11-15T10:30:00.000Z"
}
```

---

### 32. Get All Maintenance Requests
**GET** `/api/maintenance/requests`

**Access:** Protected (Maintenance, Manager)

**Query Parameters:**
- `status` (optional): Filter by status (`reported`, `in_progress`, `completed`, `cancelled`)
- `roomId` (optional): Filter by room ID
- `assignedToUserId` (optional): Filter by assigned user ID

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "room": {
      "_id": "507f1f77bcf86cd799439012",
      "roomNumber": "101",
      "floor": "1"
    },
    "issueDescription": "Điều hòa không hoạt động",
    "priority": "high",
    "status": "reported",
    "reportedBy": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Receptionist"
    },
    "assignedTo": null,
    "createdAt": "2025-11-15T10:30:00.000Z"
  }
]
```

---

### 33. Get Maintenance Request by ID
**GET** `/api/maintenance/requests/:requestId`

**Access:** Protected (Maintenance, Manager)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "room": { ... },
  "issueDescription": "Điều hòa không hoạt động",
  "priority": "high",
  "status": "reported",
  "reportedBy": { ... },
  "assignedTo": null
}
```

---

### 34. Update Maintenance Request
**PUT** `/api/maintenance/:requestId`

**Access:** Protected (Maintenance, Manager)

**Request Body:**
```json
{
  "status": "in_progress",
  "assignedTo": "507f1f77bcf86cd799439018"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "status": "in_progress",
  "assignedTo": {
    "_id": "507f1f77bcf86cd799439018",
    "name": "Maintenance Staff"
  },
  ...
}
```

---

### 35. Complete Maintenance Task
**PUT** `/api/maintenance/:requestId/complete`

**Access:** Protected (Maintenance, Manager)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439017",
  "status": "completed",
  "completedAt": "2025-11-15T12:00:00.000Z",
  ...
}
```

---

## 📊 Report APIs

### 36. Generate Occupancy Report
**GET** `/api/reports/occupancy`

**Access:** Protected (Manager, Accountant)

**Query Parameters:**
- `fromDate` (required): Start date (ISO format)
- `toDate` (required): End date (ISO format)

**Example:**
```
GET /api/reports/occupancy?fromDate=2025-11-01&toDate=2025-11-30
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439019",
  "reportId": "REP_1234567890",
  "reportType": "occupancy",
  "reportName": "Báo cáo Tỷ lệ lấp đầy 2025-11-01 - 2025-11-30",
  "startDate": "2025-11-01T00:00:00.000Z",
  "endDate": "2025-11-30T00:00:00.000Z",
  "data": {
    "totalRooms": 50,
    "statsByStatus": [
      { "_id": "available", "count": 20 },
      { "_id": "occupied", "count": 15 }
    ]
  },
  "generatedBy": {
    "_id": "507f1f77bcf86cd799439010",
    "name": "Manager"
  },
  "generatedDate": "2025-11-15T10:30:00.000Z"
}
```

---

### 37. Generate Revenue Report
**GET** `/api/reports/revenue`

**Access:** Protected (Manager, Accountant)

**Query Parameters:**
- `fromDate` (required): Start date (ISO format)
- `toDate` (required): End date (ISO format)

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "reportId": "REP_1234567891",
  "reportType": "revenue",
  "reportName": "Báo cáo Doanh thu 2025-11-01 - 2025-11-30",
  "startDate": "2025-11-01T00:00:00.000Z",
  "endDate": "2025-11-30T00:00:00.000Z",
  "data": {
    "totalRevenue": 50000000,
    "dailyBreakdown": [
      {
        "_id": "2025-11-01",
        "totalRevenue": 2000000,
        "count": 4
      }
    ]
  },
  "generatedBy": { ... },
  "generatedDate": "2025-11-15T10:30:00.000Z"
}
```

---

### 38. List Generated Reports
**GET** `/api/reports`

**Access:** Protected (Manager, Accountant)

**Query Parameters:**
- `type` (optional): Filter by report type (`revenue`, `occupancy`, `maintenance`, `guest`)

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439019",
    "reportId": "REP_1234567890",
    "reportType": "occupancy",
    "reportName": "Báo cáo Tỷ lệ lấp đầy 2025-11-01 - 2025-11-30",
    "generatedBy": {
      "name": "Manager"
    },
    "generatedDate": "2025-11-15T10:30:00.000Z"
  }
]
```

---

### 39. Get Generated Report by ID
**GET** `/api/reports/:reportId`

**Access:** Protected (Manager, Accountant)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439019",
  "reportId": "REP_1234567890",
  "reportType": "occupancy",
  "reportName": "Báo cáo Tỷ lệ lấp đầy 2025-11-01 - 2025-11-30",
  "startDate": "2025-11-01T00:00:00.000Z",
  "endDate": "2025-11-30T00:00:00.000Z",
  "data": { ... },
  "generatedBy": { ... },
  "generatedDate": "2025-11-15T10:30:00.000Z"
}
```

---

### 40. Export Comprehensive Report
**GET** `/api/reports/comprehensive/export`

**Access:** Protected (Manager only)

**Response (501 Not Implemented):**
```json
{
  "message": "Chưa cài đặt (Not Implemented)"
}
```

---

## 🏷️ Room Type APIs

### 41. Get All Room Types
**GET** `/api/room-types`

**Access:** Protected (Manager, Receptionist)

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "roomTypeId": "RT_1234567890",
    "typeName": "Deluxe",
    "description": "Phòng deluxe với view đẹp",
    "basePrice": 500000,
    "capacity": 2,
    "amenities": ["wifi", "tv", "ac", "bathtub"]
  }
]
```

---

### 42. Get Room Type by ID
**GET** `/api/room-types/:id`

**Access:** Protected (Manager, Receptionist)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "roomTypeId": "RT_1234567890",
  "typeName": "Deluxe",
  "description": "Phòng deluxe với view đẹp",
  "basePrice": 500000,
  "capacity": 2,
  "amenities": ["wifi", "tv", "ac", "bathtub"]
}
```

---

### 43. Create Room Type
**POST** `/api/room-types`

**Access:** Protected (Manager only)

**Request Body:**
```json
{
  "typeName": "Suite",
  "description": "Phòng suite cao cấp",
  "basePrice": 1000000,
  "capacity": 4,
  "amenities": ["wifi", "tv", "ac", "bathtub", "minibar"]
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "roomTypeId": "RT_1234567891",
  "typeName": "Suite",
  "description": "Phòng suite cao cấp",
  "basePrice": 1000000,
  "capacity": 4,
  "amenities": ["wifi", "tv", "ac", "bathtub", "minibar"]
}
```

---

### 44. Update Room Type
**PUT** `/api/room-types/:id`

**Access:** Protected (Manager only)

**Request Body:**
```json
{
  "typeName": "Suite Premium",
  "basePrice": 1200000,
  "capacity": 4
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "typeName": "Suite Premium",
  "basePrice": 1200000,
  ...
}
```

---

### 45. Delete Room Type
**DELETE** `/api/room-types/:id`

**Access:** Protected (Manager only)

**Response (200 OK):**
```json
{
  "message": "Đã xóa loại phòng"
}
```

**Error (400):**
```json
{
  "message": "Không thể xóa. Loại phòng đang được sử dụng."
}
```

---

## 👨‍💼 Employee APIs

### 46. Get All Employees
**GET** `/api/employees`

**Access:** Protected (Manager only)

**Query Parameters:**
- `role` (optional): Filter by role

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439010",
    "name": "Receptionist",
    "email": "receptionist@hotel.com",
    "role": "receptionist"
  }
]
```

---

### 47. Create Employee
**POST** `/api/employees`

**Access:** Protected (Manager only)

**Request Body:**
```json
{
  "name": "New Employee",
  "email": "newemployee@hotel.com",
  "password": "123456",
  "role": "receptionist"
}
```

**Valid roles:** `receptionist`, `housekeeper`, `maintenance`, `accountant`, `manager`

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "name": "New Employee",
  "email": "newemployee@hotel.com",
  "role": "receptionist"
}
```

---

### 48. Get Employee by ID
**GET** `/api/employees/:id`

**Access:** Protected (Manager only)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "name": "New Employee",
  "email": "newemployee@hotel.com",
  "role": "receptionist"
}
```

---

### 49. Update Employee
**PUT** `/api/employees/:id`

**Access:** Protected (Manager only)

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@hotel.com",
  "role": "accountant"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "name": "Updated Name",
  "email": "updated@hotel.com",
  "role": "accountant"
}
```

---

### 50. Delete Employee
**DELETE** `/api/employees/:id`

**Access:** Protected (Manager only)

**Response (200 OK):**
```json
{
  "message": "Nhân viên đã được xóa"
}
```

---

## 📈 Dashboard APIs

### 51. Get Revenue Dashboard
**GET** `/api/dashboard/revenue`

**Access:** Protected (Manager only)

**Query Parameters:**
- `fromDate` (optional): Start date (ISO format)
- `toDate` (optional): End date (ISO format)

**Response (200 OK):**
```json
{
  "totalRevenue": 50000000,
  "totalInvoices": 100
}
```

---

## 🔒 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get the token by logging in via `/api/auth/login`.

---

## 📝 Error Responses

All errors follow this format:

```json
{
  "message": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with cURL

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@hotel.com","password":"123456"}'
```

### Example: Get Rooms (with token)
```bash
curl -X GET http://localhost:5000/api/rooms \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example: Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "guestInfo": {
      "fullName": "Nguyen Van A",
      "phoneNumber": "0901234567"
    },
    "roomId": "ROOM_ID_HERE",
    "checkInDate": "2025-12-01",
    "checkOutDate": "2025-12-05",
    "numberOfGuests": 2
  }'
```

---

## 📚 Postman Collection

You can import these endpoints into Postman for easier testing. All endpoints are documented with:
- Request method
- URL
- Headers
- Body (if applicable)
- Expected response
