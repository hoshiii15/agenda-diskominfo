const path = require('path');
const exportService = require('../services/ExportService');

exports.downloadAgendaReport = async (req, res) => {
    try {
        const filename = await exportService.generateAgendaReportPDF();
        const filePath = path.join(__dirname, '..', 'exports', filename);
        res.download(filePath, filename);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengunduh laporan', error: error.message });
    }
};
