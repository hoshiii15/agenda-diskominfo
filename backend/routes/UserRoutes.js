// routes/UserRoutes.js
const express = require('express');
const router = express.Router();

const {
    registerUser,
    verifyCode,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUserByNoWa,
    setKategori
} = require('../controllers/UserController');

const { verifyToken, isAdmin } = require('../middleware/authmiddleware');

// Tambahan service untuk logout
const { logout } = require('../services/UserService');

router.post('/register', registerUser);
router.post('/verify', verifyCode);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// LOGOUT → butuh token aktif; akan langsung revoke sesi
router.post('/logout', verifyToken, async (req, res) => {
    try {
        await logout(req.session._id);
        return res.json({ message: 'Logout berhasil. Token sudah tidak berlaku.' });
    } catch (e) {
        return res.status(500).json({ message: 'Gagal logout', detail: e.message });
    }
});

router.get('/', verifyToken, isAdmin, getAllUsers);
router.delete('/:no_wa', verifyToken, isAdmin, deleteUserByNoWa);
router.post('/set-kategori', verifyToken, isAdmin, setKategori);

module.exports = router;
