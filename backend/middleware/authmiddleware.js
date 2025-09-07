// middleware/authmiddleware.js
const jwt = require('jsonwebtoken');
const Session = require('../models/SessionModel');
require('dotenv').config();

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 menit

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Harus ada sid (session id) di payload
        if (!decoded.sid) {
            return res.status(403).json({ message: 'Token tidak valid: sid hilang' });
        }

        // Cek session: tidak revoked & belum idle timeout
        const session = await Session.findById(decoded.sid);
        if (!session) {
            return res.status(403).json({ message: 'Sesi tidak ditemukan' });
        }
        if (session.revoked) {
            return res.status(403).json({ message: 'Sesi telah di-logout' });
        }

        const now = Date.now();
        const last = session.lastActivity ? session.lastActivity.getTime() : 0;
        if (now - last > IDLE_TIMEOUT_MS) {
            return res.status(401).json({ message: 'Sesi kedaluwarsa karena idle' });
        }

        // Perbarui lastActivity saat request valid
        session.lastActivity = new Date();
        await session.save();

        // Lampirkan info user & session
        req.user = { userId: decoded.userId, role: decoded.role };
        req.session = session;

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
};

exports.isUser = (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
};
