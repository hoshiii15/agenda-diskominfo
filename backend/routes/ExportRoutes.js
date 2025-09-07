const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authmiddleware');
const exportController = require('../controllers/ExportController');

router.get('/pdf', verifyToken, isAdmin, exportController.downloadAgendaReport);

module.exports = router;
