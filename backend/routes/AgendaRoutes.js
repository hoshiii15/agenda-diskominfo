const express = require('express');
const router = express.Router();

const { verifyToken, isUser, isAdmin } = require('../middleware/authmiddleware');
const agendaController = require('../controllers/AgendaController');
const upload = require('../middleware/uploadmiddleware');

router.get('/', agendaController.getAllAgenda);
router.post('/', verifyToken, isUser, agendaController.createAgenda);
router.put('/:agendaId', verifyToken, isUser, agendaController.updateAgenda);
router.delete('/:agendaId', verifyToken, isAdmin, agendaController.deleteAgenda);
router.post('/:agendaId/upload', verifyToken, isUser, upload.single('file'), agendaController.uploadDokumentasi);
router.put('/:agendaId/ganti-dokumentasi', verifyToken, isUser, upload.single('file'), agendaController.gantiDokumentasi);
router.get('/:agendaId/dokumentasi', verifyToken, isUser, agendaController.getDokumentasi);
router.get('/calendar/events', agendaController.getAgendaForCalendar);
router.post('/kirim-notifikasi', verifyToken, isAdmin, agendaController.kirimNotifikasiAgenda);

module.exports = router;
