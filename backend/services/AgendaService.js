const Agenda = require('../models/AgendaModel');
const Kategori = require('../models/KategoriModel');
const path = require('path');
const fs = require('fs');
const { agendaToDTO, agendaListToDTO } = require('../utils/agendaDTO');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

exports.getAllAgenda = async () => {
    const agendas = await Agenda.find();
    const withFormattedDate = agendas.map(agenda => {
        const formatted = dayjs(agenda.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm');
        return {
            ...agenda._doc,
            tanggal: formatted
        };
    });
    return agendaListToDTO(withFormattedDate);
};

exports.createAgenda = async (data) => {
    const lastAgenda = await Agenda.findOne({}).sort({ agendaId: -1 }).exec();
    let newIdNumber = 1;

    if (lastAgenda && lastAgenda.agendaId) {
        const lastNumber = parseInt(lastAgenda.agendaId.split('-')[1]);
        newIdNumber = lastNumber + 1;
    }

    const formattedId = `AGD-${newIdNumber.toString().padStart(3, '0')}`;
    const tanggalLokal = dayjs(data.tanggal).tz('Asia/Jakarta').toDate();

    const kategori = await Kategori.findOne({ nama: data.kategori });
    if (!kategori) throw new Error('Kategori tidak ditemukan');

    const newAgenda = new Agenda({
        agendaId: formattedId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        kategori: kategori._id,
        tanggal: tanggalLokal,
        lokasi: data.lokasi,
    });

    const saved = await newAgenda.save();
    return agendaToDTO(saved);
};

exports.updateAgenda = async (agendaId, data) => {
    const updateData = {
        judul: data.judul,
        deskripsi: data.deskripsi,
        lokasi: data.lokasi,
    };
    if (data.tanggal) {
        updateData.tanggal = dayjs(data.tanggal).tz('Asia/Jakarta').toDate();
    }

    const updated = await Agenda.findOneAndUpdate(
        { agendaId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!updated) throw new Error('Agenda tidak ditemukan');
    return agendaToDTO(updated);
};

exports.deleteAgenda = async (agendaId) => {
    const deleted = await Agenda.findOneAndDelete({ agendaId });
    if (!deleted) throw new Error('Agenda tidak ditemukan');

    if (deleted.dokumentasi) {
        const filePath = path.join(__dirname, '..', deleted.dokumentasi);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    return { message: 'Agenda berhasil dihapus' };
};

exports.uploadDokumentasi = async (agendaId, filePath) => {
    const agenda = await Agenda.findOne({ agendaId });
    if (!agenda) throw new Error('Agenda tidak ditemukan');

    agenda.dokumentasi = filePath;
    await agenda.save();

    return agenda;
};

exports.getDokumentasiFilename = async (agendaId) => {
    const agenda = await Agenda.findOne({ agendaId });
    if (!agenda || !agenda.dokumentasi) {
        throw new Error('Dokumentasi tidak ditemukan');
    }
    return agenda.dokumentasi;
};

exports.gantiDokumentasi = async (agendaId, newFilePath) => {
    const agenda = await Agenda.findOne({ agendaId });
    if (!agenda) throw new Error('Agenda tidak ditemukan');

    if (agenda.dokumentasi) {
        const oldPath = path.join(__dirname, '..', agenda.dokumentasi);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }

    agenda.dokumentasi = newFilePath;
    await agenda.save();

    return agenda;
};

exports.getAgendaForCalendar = async () => {
    const agendas = await Agenda.find();

    return agendas.map((agenda) => ({
        id: agenda.agendaId,
        title: agenda.judul,
        start: agenda.tanggal,
        description: agenda.deskripsi,
        kategori: agenda.kategori,
        location: agenda.lokasi,
    }));
};
