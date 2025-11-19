# 🚀 Quick Fix cho lỗi 403 - Accountant Dashboard

## ⚡ Các bước nhanh để sửa:

### 1. Chạy script fix role (QUAN TRỌNG NHẤT)
```bash
cd backend
npm run fix-accountant
```

Script này sẽ:
- ✅ Kiểm tra role của accountant
- ✅ Tự động sửa role nếu sai
- ✅ Tạo user mới nếu chưa có

### 2. XÓA TOKEN CŨ trong browser (BẮT BUỘC)
**Cách 1: Dùng Developer Tools**
1. Mở browser, nhấn **F12**
2. Vào tab **Application** (Chrome) hoặc **Storage** (Firefox)
3. Tìm **Local Storage** → `http://localhost:3000`
4. **XÓA** các key:
   - `token`
   - `user`
5. **Đóng và mở lại tab** (hoặc refresh)

**Cách 2: Dùng Console (Nhanh hơn)**
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Chạy lệnh:
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
location.reload();
```

### 3. Khởi động lại backend
```bash
cd backend
# Dừng server (Ctrl+C nếu đang chạy)
npm start
```

### 4. Đăng nhập lại
1. Vào `http://localhost:3000/login`
2. Đăng nhập với:
   - Email: `accountant@hotel.com`
   - Password: `123456`

### 5. Test lại
1. Vào tab **Transactions** trong Accountant Dashboard
2. Kiểm tra backend console để xem logs

## 🔍 Kiểm tra logs

### Backend console sẽ hiển thị:
```
[PROTECT] User authenticated: accountant@hotel.com, Role: accountant
[TRANSACTIONS_ROUTE] Middleware check - User: accountant@hotel.com, Role: accountant
[AUTHORIZE] User: accountant@hotel.com
[AUTHORIZE] User role (normalized): 'accountant'
[AUTHORIZE] Allowed roles (normalized): [accountant, manager]
[AUTHORIZE] ✅ Access granted for role: accountant
```

### Frontend console sẽ hiển thị:
```
[TransactionsTab] User role test result: { user: { role: 'accountant', ... } }
[API_CALL] GET http://localhost:5000/api/transactions
[API_CALL] Response status: 200
```

## 🧪 Test endpoints

### Test 1: Kiểm tra user role
```bash
# Sau khi đăng nhập, mở browser console và chạy:
fetch('http://localhost:5000/api/test-user', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)
```

### Test 2: Kiểm tra authorization
```bash
fetch('http://localhost:5000/api/test-transactions-auth', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)
```

Nếu test 2 trả về `{ success: true }` → Authorization hoạt động đúng!

## ❌ Nếu vẫn lỗi:

1. **Kiểm tra backend logs** - Xem role thực tế là gì
2. **Chạy lại seed**:
   ```bash
   cd backend
   npm run seed
   ```
3. **Xóa token và đăng nhập lại** (Bước 2)
4. **Gửi logs từ backend console** để được hỗ trợ

## 📝 Lưu ý quan trọng:

- ⚠️ **PHẢI xóa token cũ** sau khi fix role trong database
- ⚠️ **PHẢI đăng nhập lại** để lấy token mới
- ⚠️ Token cũ chứa user ID của user có role cũ → sẽ không hoạt động

