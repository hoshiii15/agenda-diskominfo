const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/KategoriController');
const { verifyToken, isAdmin } = require('../middleware/authmiddleware');

router.get('/public', kategoriController.ambilSemuaKategori);
router.post('/', verifyToken, isAdmin, kategoriController.tambahKategori);
router.put('/:nama', verifyToken, isAdmin, kategoriController.editKategori);
router.delete('/:nama', verifyToken, isAdmin, kategoriController.hapusKategori);
router.get('/', verifyToken, isAdmin, kategoriController.ambilSemuaKategori);
router.post('/kirim-pesan', verifyToken, isAdmin, kategoriController.kirimPesanKategori);

module.exports = router;