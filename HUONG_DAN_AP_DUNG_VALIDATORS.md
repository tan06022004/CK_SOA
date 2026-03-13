# KIỂM TRA VÀ HƯỚNG DẪN ÁP DỤNG VALIDATORS – BACKEND

## 1. TỔNG KẾT NHANH

| Validator file           | Rules export        | Đã áp dụng? | Route cần gắn                    |
|--------------------------|---------------------|-------------|-----------------------------------|
| bookingValidators.js     | createBookingRules  | **Có**      | POST /api/bookings (đã có)        |
| roomValidators.js        | createRoomRules     | **Chưa**    | POST /api/rooms                   |
| guestValidators.js       | createGuestRules    | **Chưa**    | POST /api/guests, PUT /api/guests/:guestId |
| invoiceValidators.js     | createInvoiceRules  | **Chưa**    | Hiện không có API POST invoice từ body |

---

## 2. CHI TIẾT TỪNG FILE

### 2.1. bookingValidators.js – **ĐÃ ÁP DỤNG**

- **File:** `backend/validators/bookingValidators.js`  
  Export: `createBookingRules` (validate roomId, checkInDate, checkOutDate, numberOfGuests, guestInfo).

- **Route:** `backend/routes/api/bookingRoutes.js`  
  - POST `/` đã có: `protect, authorize(...R_M), createBookingRules, validate, createBooking`  
  → **Không cần sửa.**

---

### 2.2. roomValidators.js – **CHƯA ÁP DỤNG**

- **File:** `backend/validators/roomValidators.js`  
  Export: `createRoomRules` (roomNumber, roomTypeId, floor, status).

- **Vấn đề thêm:** Rule hiện tại sai kiểu dữ liệu:
  - `roomNumber` là **chuỗi** (số phòng) nhưng đang dùng `.isMongoId()`.
  - `roomTypeId` là **MongoId** nhưng đang dùng `.isISO8601()`.
  - `floor`, `status` đang dùng `.isISO8601()` (dùng cho ngày), không đúng.

**Bước 1 – Sửa rule trong `backend/validators/roomValidators.js`:**

Thay nội dung `createRoomRules` bằng:

```javascript
const createRoomRules = [
  body('roomNumber')
    .notEmpty().withMessage('Số phòng là bắt buộc')
    .isString().withMessage('Số phòng phải là chuỗi')
    .trim(),
  
  body('roomTypeId')
    .notEmpty().withMessage('ID loại phòng là bắt buộc')
    .isMongoId().withMessage('ID loại phòng không hợp lệ'),

  body('floor')
    .optional()
    .isString().withMessage('Tầng phải là chuỗi')
    .trim(),

  body('status')
    .optional()
    .isIn(['available', 'occupied', 'dirty', 'cleaning', 'maintenance']).withMessage('Trạng thái không hợp lệ')
];
```

**Bước 2 – Áp dụng vào route trong `backend/routes/api/roomRoutes.js`:**

- Đầu file đã có:
  - `const { createRoomRules } = require('../../validators/roomValidators');`
  - `const { validate } = require('../../middleware/validationMiddleware');`
- Tìm dòng:
  ```javascript
  router.post('/', protect, authorize('manager'), createRoom);
  ```
- Sửa thành:
  ```javascript
  router.post('/', protect, authorize('manager'), createRoomRules, validate, createRoom);
  ```

---

### 2.3. guestValidators.js – **CHƯA ÁP DỤNG**

- **File:** `backend/validators/guestValidators.js`  
  Export: `createGuestRules`.

- **Vấn đề:** Rule hiện tại sai: dùng `.isMongoId()` cho fullName, `.isISO8601()` cho phoneNumber, email, address; model Guest **không có** `city`, `country`.

**Bước 1 – Sửa rule trong `backend/validators/guestValidators.js`:**

Khớp với `guestModel` (fullName, phoneNumber, email, address). Thay toàn bộ `createGuestRules` bằng:

```javascript
const createGuestRules = [
  body('fullName')
    .notEmpty().withMessage('Họ và tên là bắt buộc')
    .isString().withMessage('Họ và tên phải là chuỗi')
    .trim(),
  
  body('phoneNumber')
    .notEmpty().withMessage('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại phải có 10–11 chữ số'),

  body('email')
    .optional()
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),

  body('address')
    .optional()
    .isString().withMessage('Địa chỉ phải là chuỗi')
    .trim()
];
```

Xóa hết các field `city`, `country` (model không có). Nếu sau này model thêm city/country thì mới thêm rule.

**Bước 2 – Thêm rule cho PUT (cập nhật guest):**

Có thể dùng chung rule cho cả POST và PUT, hoặc tách riêng. Ví dụ thêm vào cùng file:

```javascript
const updateGuestRules = [
  body('fullName')
    .notEmpty().withMessage('Họ và tên là bắt buộc')
    .isString().trim(),
  body('phoneNumber')
    .notEmpty().withMessage('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại phải có 10–11 chữ số'),
  body('email').optional().isEmail().normalizeEmail(),
  body('address').optional().isString().trim()
];

module.exports = { createGuestRules, updateGuestRules };
```

**Bước 3 – Áp dụng vào route trong `backend/routes/api/guestRoutes.js`:**

- Ở **đầu file** thêm:
  ```javascript
  const { createGuestRules, updateGuestRules } = require('../../validators/guestValidators');
  const { validate } = require('../../middleware/validationMiddleware');
  ```
- Tìm:
  ```javascript
  router.route('/')
      .get(getAllGuests)
      .post(createGuest);
  ```
  Sửa thành:
  ```javascript
  router.route('/')
      .get(getAllGuests)
      .post(createGuestRules, validate, createGuest);
  ```
- Tìm:
  ```javascript
  router.route('/:guestId')
      .get(getGuestById)
      .put(updateGuest);
  ```
  Sửa thành:
  ```javascript
  router.route('/:guestId')
      .get(getGuestById)
      .put(updateGuestRules, validate, updateGuest);
  ```

(Nếu bạn chỉ export `createGuestRules` và không tạo `updateGuestRules`, thì chỉ cần thêm `createGuestRules, validate` cho POST; PUT tạm để `updateGuest` hoặc sau này thêm `updateGuestRules`.)

---

### 2.4. invoiceValidators.js – **CHƯA ÁP DỤNG (VÀ HIỆN KHÔNG CÓ ROUTE PHÙ HỢP)**

- **File:** `backend/validators/invoiceValidators.js`  
  Export: `createInvoiceRules` (totalAmount, paymentStatus, paymentMethod).

- **Thực tế:**  
  - Invoice đang được tạo qua **POST /api/bookings/:bookingId/invoice** (generateInvoiceForBooking), không nhận body từ client.  
  - `invoiceRoutes.js` chỉ có GET, không có POST/PUT nào nhận body (totalAmount, paymentStatus, paymentMethod).  
  → Hiện **không có route nào** để gắn `createInvoiceRules`.

**Hai hướng xử lý:**

- **Cách 1 – Bỏ qua:** Giữ file validator, khi nào thêm API tạo/cập nhật invoice từ body (ví dụ PUT `/api/invoices/:id` để cập nhật paymentStatus, paymentMethod) thì áp dụng.
- **Cách 2 – Chuẩn bị sẵn:** Sửa rule cho đúng kiểu dữ liệu (totalAmount là number, paymentStatus/paymentMethod là enum), rồi khi thêm route POST/PUT invoice thì gắn `createInvoiceRules` hoặc `updateInvoiceRules` và `validate` tương tự các route trên.

**Sửa rule trong `backend/validators/invoiceValidators.js` (để sau này dùng):**

```javascript
const { body } = require('express-validator');

const createInvoiceRules = [
  body('totalAmount')
    .notEmpty().withMessage('Tổng tiền là bắt buộc')
    .isFloat({ min: 0 }).withMessage('Tổng tiền phải là số không âm'),

  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'cancelled']).withMessage('Trạng thái thanh toán không hợp lệ'),

  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'bank_transfer', 'online']).withMessage('Phương thức thanh toán không hợp lệ'),
];

module.exports = { createInvoiceRules };
```

(Khi có route POST/PUT invoice, chỉ cần thêm vào chuỗi middleware: `createInvoiceRules, validate, controller`.)

---

## 3. CHECKLIST ÁP DỤNG

- [ ] **roomValidators:** Sửa `createRoomRules` (roomNumber string, roomTypeId MongoId, floor/status optional đúng kiểu) → Gắn vào POST `/api/rooms`: `createRoomRules, validate, createRoom`.
- [ ] **guestValidators:** Sửa `createGuestRules` (fullName, phoneNumber, email, address; bỏ city/country; đúng kiểu) → Gắn vào POST `/api/guests`: `createGuestRules, validate, createGuest`. (Tùy chọn: thêm `updateGuestRules` và gắn vào PUT `/api/guests/:guestId`.)
- [ ] **invoiceValidators:** Sửa rule (totalAmount number, paymentStatus/paymentMethod enum). Khi có API tạo/sửa invoice từ body thì gắn `createInvoiceRules` hoặc `updateInvoiceRules` + `validate` vào route tương ứng.
- [ ] **bookingValidators:** Đã áp dụng, không cần thay đổi.

---

## 4. LƯU Ý CHUNG

- Mọi route có validation đều cần **hai bước:** (1) chuỗi rule (ví dụ `createRoomRules`), (2) middleware `validate` (từ `validationMiddleware.js`) để đọc `validationResult(req)` và trả 400 nếu có lỗi.
- Thứ tự middleware nên là: `protect` → `authorize` → **rules** → **validate** → controller.
- Đảm bảo `validationMiddleware.js` export `{ validate }` và trong route dùng đúng: `const { validate } = require('../../middleware/validationMiddleware');`.

Sau khi sửa xong, bạn chỉ cần gắn đúng tên rule và `validate` vào từng route như trên là validator sẽ được áp dụng đầy đủ.
