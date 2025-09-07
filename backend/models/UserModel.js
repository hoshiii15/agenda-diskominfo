const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    no_wa: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: null
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
