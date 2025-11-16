const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import các routes
const authRoutes = require('./routes/api/authRoutes');
const userRoutes = require('./routes/api/userRoutes');
const bookingRoutes = require('./routes/api/bookingRoutes');
const roomRoutes = require('./routes/api/roomRoutes'); 
const roomTypeRoutes = require('./routes/api/roomTypeRoutes');
const guestRoutes = require('./routes/api/guestRoutes');
const invoiceRoutes = require('./routes/api/invoiceRoutes');
const maintenanceRoutes = require('./routes/api/maintenanceRoutes');
const reportRoutes = require('./routes/api/reportRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Định nghĩa các API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes); 
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportRoutes);

// Sử dụng Middleware xử lý lỗi (Phải đặt ở CUỐI CÙNG)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));