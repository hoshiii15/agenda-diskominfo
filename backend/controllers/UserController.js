const userService = require('../services/UserService');

exports.registerUser = async (req, res) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        await userService.verifyCode(req.body);
        res.status(200).json({ message: 'Verifikasi berhasil.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({ message: 'Login berhasil.', ...result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUserByNoWa = async (req, res) => {
    try {
        await userService.deleteByNoWa(req.params.no_wa);
        res.status(200).json({ message: `User dengan no_wa ${req.params.no_wa} berhasil dihapus` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const result = await userService.sendResetCode(req.body.no_wa);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        await userService.resetPassword(req.body);
        res.status(200).json({ message: 'Password berhasil direset.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.setKategori = async (req, res) => {
    try {
        const { username, kategori } = req.body;
        const user = await userService.setKategoriToUser(username, kategori);

        res.status(200).json({ message: 'Kategori berhasil diset', user });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menetapkan kategori', error: error.message });
    }
};
