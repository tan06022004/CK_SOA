# 🔧 Hướng dẫn sửa lỗi 403 cho Accountant Dashboard

## Vấn đề
Accountant không thể truy cập `/api/transactions` với lỗi 403 (Forbidden).

## Nguyên nhân có thể
1. User trong database có role khác với 'accountant'
2. Token cũ được lưu trước khi seed lại database
3. User chưa được tạo đúng trong database

## Cách sửa

### Bước 1: Kiểm tra và sửa role của accountant
```bash
cd backend
npm run fix-accountant
```

Script này sẽ:
- Kiểm tra role của accountant user
- Tự động sửa role nếu không đúng
- Tạo user mới nếu chưa tồn tại
- Hiển thị tất cả users trong database

**Hoặc kiểm tra role:**
```bash
cd backend
npm run check-role
```

### Bước 2: Nếu vẫn không được, chạy lại seed
```bash
cd backend
npm run seed
```

### Bước 3: Xóa token cũ trong browser
1. Mở Developer Tools (F12)
2. Vào tab **Application** (Chrome) hoặc **Storage** (Firefox)
3. Tìm **Local Storage** → `http://localhost:3000`
4. Xóa các key:
   - `token`
   - `user`

### Bước 4: Đăng nhập lại
1. Đăng nhập với `accountant@hotel.com` / `123456`
2. Kiểm tra console để xem logs:
   - Frontend: `[TransactionsTab] User role test: {...}`
   - Backend: `[PROTECT] User authenticated: accountant@hotel.com, Role: accountant`
   - Backend: `[AUTHORIZE] ✅ Access granted for role: accountant`

### Bước 5: Test endpoint transactions
Sau khi đăng nhập lại, mở tab Transactions trong Accountant Dashboard.

## Debug thông tin

### Test endpoint mới
Tôi đã thêm endpoint test: `GET /api/test-user`

Endpoint này sẽ trả về thông tin chi tiết về user hiện tại:
- Role (raw)
- Role (normalized)
- So sánh với 'accountant'

### Xem logs
**Backend console sẽ hiển thị:**
```
[PROTECT] User authenticated: accountant@hotel.com, Role: accountant
[TRANSACTIONS_ROUTE] Middleware check - User: accountant@hotel.com, Role: accountant
[TRANSACTIONS_ROUTE] Role type: string
[TRANSACTIONS_ROUTE] Role normalized: accountant
[AUTHORIZE] User: accountant@hotel.com
[AUTHORIZE] User role (normalized): 'accountant'
[AUTHORIZE] Allowed roles (normalized): [accountant, manager]
[AUTHORIZE] ✅ Access granted for role: accountant
[GET_TRANSACTIONS] Request received: {...}
[GET_TRANSACTIONS] Found X transactions
```

**Frontend console sẽ hiển thị:**
```
[TransactionsTab] User role test: { user: { role: 'accountant', ... } }
[API_CALL] GET http://localhost:5000/api/transactions
[API_CALL] Response status: 200 [...]
```

## Nếu vẫn lỗi

1. **Kiểm tra backend logs** để xem:
   - User role thực tế là gì
   - Có lỗi gì trong authorization không

2. **Kiểm tra frontend console** để xem:
   - User role test result
   - Error message chi tiết

3. **Gửi logs** từ cả backend và frontend để được hỗ trợ thêm.

