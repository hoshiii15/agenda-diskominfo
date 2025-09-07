const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
    agendaId: { type: String, required: true, unique: true },
    judul: { type: String, required: true },
    deskripsi: { type: String },
    kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori', required: true },
    tanggal: { type: Date, required: true },
    lokasi: { type: String },
    dokumentasi: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Agenda', agendaSchema);
