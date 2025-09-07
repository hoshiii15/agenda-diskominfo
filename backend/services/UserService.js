// services/UserService.js
const User = require('../models/UserModel');
const Kategori = require('../models/KategoriModel');
const Session = require('../models/SessionModel');
const { userListToDTO } = require('../utils/userDTO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendWhatsAppMessage } = require('./whatsappService');

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 menit

const generateVerificationCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async ({ username, no_wa, password }) => {
    const existingUser = await User.findOne({ no_wa });
    if (existingUser) throw new Error('Nomor WhatsApp sudah terdaftar.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const newUser = new User({
        username,
        no_wa,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
    });

    await newUser.save();

    const pesan = `📩 *Kode Verifikasi*\n\nKode verifikasi akun Anda adalah: *${verificationCode}*\nSilakan masukkan kode ini di halaman verifikasi.`;
    await sendWhatsAppMessage(no_wa, pesan);

    return { message: 'Akun terdaftar. Kode verifikasi telah dikirim ke WhatsApp.' };
};

exports.verifyCode = async ({ no_wa, kodeVerifikasi }) => {
    const user = await User.findOne({ no_wa });
    if (!user) throw new Error('User tidak ditemukan.');
    if (user.isVerified) throw new Error('User sudah terverifikasi.');
    if (user.verificationCode !== kodeVerifikasi)
        throw new Error('Kode verifikasi salah.');

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    return { message: 'Akun berhasil diverifikasi.' };
};

exports.login = async ({ no_wa, password }) => {
    const user = await User.findOne({ no_wa });
    if (!user) throw new Error('User tidak ditemukan.');
    if (!user.isVerified) throw new Error('Akun belum diverifikasi.');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Password salah.');

    // Buat session baru
    const session = await Session.create({
        user: user._id,
        lastActivity: new Date(),
        revoked: false,
    });

    // Token boleh panjang (mis. 1 hari); idle timeout kita enforce via Session
    const token = jwt.sign(
        { userId: user._id, role: user.role, sid: session._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            no_wa: user.no_wa,
            role: user.role,
        },
    };
};

exports.logout = async (sessionId) => {
    const session = await Session.findById(sessionId);
    if (session && !session.revoked) {
        session.revoked = true;
        await session.save();
    }
};

exports.touchSession = async (sessionId) => {
    // Update lastActivity → dipanggil dari middleware saat request valid
    await Session.findByIdAndUpdate(sessionId, { lastActivity: new Date() });
};

exports.isSessionActive = async (sessionId) => {
    const session = await Session.findById(sessionId);
    if (!session) return { active: false, reason: 'Sesi tidak ditemukan' };
    if (session.revoked) return { active: false, reason: 'Sesi telah di-logout' };

    const now = Date.now();
    const last = session.lastActivity ? session.lastActivity.getTime() : 0;
    if (now - last > IDLE_TIMEOUT_MS) {
        return { active: false, reason: 'Sesi kedaluwarsa karena idle' };
    }
    return { active: true, session };
};

exports.getAllUsers = async () => {
    const users = await User.find()
        .select('-password -verificationCode')
        .populate('kategori');
    return userListToDTO(users);
};

exports.deleteByNoWa = async (no_wa) => {
    const deleted = await User.findOneAndDelete({ no_wa });
    if (!deleted) throw new Error('User tidak ditemukan');
};

exports.sendResetCode = async (no_wa) => {
    const user = await User.findOne({ no_wa });
    if (!user) throw new Error('User tidak ditemukan.');

    const resetCode = generateVerificationCode();
    user.verificationCode = resetCode;
    await user.save();

    const pesan = `🔐 *Reset Password*\n\nKode untuk reset password Anda adalah: *${resetCode}*\nGunakan kode ini untuk mengatur ulang password akun Anda.`;
    await sendWhatsAppMessage(no_wa, pesan);

    return { message: 'Kode reset telah dikirim ke WhatsApp.' };
};

exports.resetPassword = async ({ no_wa, kodeVerifikasi, newPassword }) => {
    const user = await User.findOne({ no_wa });
    if (!user) throw new Error('User tidak ditemukan.');
    if (user.verificationCode !== kodeVerifikasi)
        throw new Error('Kode verifikasi salah.');

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    await user.save();
};

exports.setKategoriToUser = async (username, kategoriName) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    let kategori = await Kategori.findOne({ nama: kategoriName });
    if (!kategori) {
        kategori = new Kategori({ nama: kategoriName });
        await kategori.save();
    }

    user.kategori = kategori._id;
    await user.save();

    return user;
};
