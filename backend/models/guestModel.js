const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true,
        default: () => `CUST_${Date.now()}`
    },
    fullName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        lowercase: true, 
        trim: true 
    },
    address: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);