# API Quick Reference

## 🔑 Get Token First

```bash
# Login to get token
POST http://localhost:5000/api/auth/login
Body: {
  "email": "manager@hotel.com",
  "password": "123456"
}
```

Save the `token` from response for all protected endpoints.

---

## 📋 All Endpoints Summary

| # | Method | Endpoint | Access | Description |
|---|--------|----------|--------|-------------|
| 1 | POST | `/api/auth/login` | Public | Login |
| 2 | GET | `/api/auth/profile` | Protected | Get profile |
| 3 | POST | `/api/auth/logout` | Protected | Logout |
| 4 | POST | `/api/bookings` | R, M | Create booking |
| 5 | GET | `/api/bookings` | R, M, A | Get all bookings |
| 6 | GET | `/api/bookings/:id` | R, M, A | Get booking |
| 7 | PUT | `/api/bookings/:id` | R, M | Update booking |
| 8 | POST | `/api/bookings/:id/cancel` | R, M | Cancel booking |
| 9 | POST | `/api/bookings/:id/invoice` | R, M, A | Generate invoice |
| 10 | GET | `/api/rooms` | All | Get all rooms |
| 11 | GET | `/api/rooms/:id` | All | Get room |
| 12 | POST | `/api/rooms` | M | Create room |
| 13 | PUT | `/api/rooms/:id` | M | Update room |
| 14 | PUT | `/api/rooms/:id/status` | R, H, M | Update room status |
| 15 | GET | `/api/rooms/available` | R | Search available rooms |
| 16 | GET | `/api/rooms/cleaning` | H | Get cleaning rooms |
| 17 | GET | `/api/rooms/maintenance` | M, R | Get maintenance rooms |
| 18 | GET | `/api/rooms/status/realtime` | R, M | Get realtime status |
| 19 | GET | `/api/guests` | R, M | Get all guests |
| 20 | GET | `/api/guests/:id` | R, M | Get guest |
| 21 | POST | `/api/guests` | R, M | Create guest |
| 22 | PUT | `/api/guests/:id` | R, M | Update guest |
| 23 | POST | `/api/checkin` | R | Check-in |
| 24 | POST | `/api/checkout` | R | Check-out |
| 25 | POST | `/api/payments` | R, A | Record payment |
| 26 | GET | `/api/transactions` | A, M | Get transactions |
| 27 | GET | `/api/invoices` | R, M, A | Get all invoices |
| 28 | GET | `/api/invoices/:id` | R, M, A | Get invoice |
| 29 | GET | `/api/invoices/guest/:bookingId` | R, M, A | Get guest invoice |
| 30 | GET | `/api/invoices/financial/:bookingId` | A | Get financial invoice |
| 31 | POST | `/api/maintenance/issues` | H, R, M | Report issue |
| 32 | GET | `/api/maintenance/requests` | M, M | Get requests |
| 33 | GET | `/api/maintenance/requests/:id` | M, M | Get request |
| 34 | PUT | `/api/maintenance/:id` | M, M | Update request |
| 35 | PUT | `/api/maintenance/:id/complete` | M, M | Complete task |
| 36 | GET | `/api/reports/occupancy` | M, A | Generate occupancy report |
| 37 | GET | `/api/reports/revenue` | M, A | Generate revenue report |
| 38 | GET | `/api/reports` | M, A | List reports |
| 39 | GET | `/api/reports/:id` | M, A | Get report |
| 40 | GET | `/api/reports/comprehensive/export` | M | Export report |
| 41 | GET | `/api/room-types` | M, R | Get room types |
| 42 | GET | `/api/room-types/:id` | M, R | Get room type |
| 43 | POST | `/api/room-types` | M | Create room type |
| 44 | PUT | `/api/room-types/:id` | M | Update room type |
| 45 | DELETE | `/api/room-types/:id` | M | Delete room type |
| 46 | GET | `/api/employees` | M | Get employees |
| 47 | POST | `/api/employees` | M | Create employee |
| 48 | GET | `/api/employees/:id` | M | Get employee |
| 49 | PUT | `/api/employees/:id` | M | Update employee |
| 50 | DELETE | `/api/employees/:id` | M | Delete employee |
| 51 | GET | `/api/dashboard/revenue` | M | Get revenue dashboard |

**Legend:**
- R = Receptionist
- M = Manager
- A = Accountant
- H = Housekeeper
- M = Maintenance (in maintenance routes)

---

## 🧪 Test in Browser Console

After logging in, save token:
```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'manager@hotel.com', password: '123456'})
});
const loginData = await loginResponse.json();
const token = loginData.token;
localStorage.setItem('token', token);
console.log('Token:', token);

// 2. Get Rooms
const roomsResponse = await fetch('http://localhost:5000/api/rooms', {
  headers: {'Authorization': `Bearer ${token}`}
});
const rooms = await roomsResponse.json();
console.log('Rooms:', rooms);

// 3. Get Bookings
const bookingsResponse = await fetch('http://localhost:5000/api/bookings', {
  headers: {'Authorization': `Bearer ${token}`}
});
const bookings = await bookingsResponse.json();
console.log('Bookings:', bookings);
```

---

## 📝 Common Request Examples

### Create Booking
```json
POST /api/bookings
{
  "guestInfo": {
    "fullName": "Nguyen Van A",
    "phoneNumber": "0901234567",
    "email": "guest@example.com"
  },
  "roomId": "ROOM_ID",
  "checkInDate": "2025-12-01",
  "checkOutDate": "2025-12-05",
  "numberOfGuests": 2
}
```

### Check-in
```json
POST /api/checkin
{
  "bookingId": "BOOKING_ID"
}
```

### Record Payment
```json
POST /api/payments
{
  "invoiceId": "INVOICE_ID",
  "paymentMethod": "cash"
}
```

### Update Room Status
```json
PUT /api/rooms/ROOM_ID/status
{
  "status": "dirty"
}
```

---

See `API_DOCUMENTATION.md` for complete details with all request/response formats.
