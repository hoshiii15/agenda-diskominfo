const path = require('path');
const fs = require('fs');
const AgendaService = require('../services/AgendaService');
const { sendWhatsAppMessage } = require('../services/whatsappService');

exports.getAllAgenda = async (req, res) => {
    try {
        const data = await AgendaService.getAllAgenda();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAgenda = async (req, res) => {
    try {
        const data = await AgendaService.createAgenda(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateAgenda = async (req, res) => {
    try {
        const data = await AgendaService.updateAgenda(req.params.agendaId, req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAgenda = async (req, res) => {
    try {
        const result = await AgendaService.deleteAgenda(req.params.agendaId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.uploadDokumentasi = async (req, res) => {
    try {
        const { agendaId } = req.params;
        const filePath = path.posix.join('uploads', 'agenda_docs', req.file.filename);
        const updatedAgenda = await AgendaService.uploadDokumentasi(agendaId, filePath);
        res.status(200).json({ message: 'Dokumentasi berhasil diunggah.', dokumentasi: updatedAgenda.dokumentasi });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.gantiDokumentasi = async (req, res) => {
    try {
        const { agendaId } = req.params;
        const filePath = path.posix.join('uploads', 'agenda_docs', req.file.filename);
        const updatedAgenda = await AgendaService.gantiDokumentasi(agendaId, filePath);
        res.status(200).json({ message: 'Dokumentasi berhasil diganti.', dokumentasi: updatedAgenda.dokumentasi });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDokumentasi = async (req, res) => {
    try {
        const { agendaId } = req.params;
        const fileName = await AgendaService.getDokumentasiFilename(agendaId);
        const filePath = path.join(__dirname, '..', fileName);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File tidak ditemukan' });
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAgendaForCalendar = async (req, res) => {
    try {
        const events = await AgendaService.getAgendaForCalendar();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.kirimNotifikasiAgenda = async (req, res) => {
    try {
        const { nomorWa, judul, tanggal } = req.body;
        const pesan = `Pengingat Agenda:\nJudul: ${judul}\nTanggal: ${tanggal}`;
        const result = await sendWhatsAppMessage(nomorWa, pesan);
        res.status(200).json({ message: 'Notifikasi terkirim', result });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengirim notifikasi', error: error.message });
    }
};
