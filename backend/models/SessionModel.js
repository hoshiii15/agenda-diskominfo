// models/SessionModel.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        lastActivity: { type: Date, default: Date.now },
        revoked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
