const Kategori = require('../models/KategoriModel');
const User = require('../models/UserModel');
const { sendWhatsAppMessage } = require('./whatsappService');

exports.tambahKategoriBaru = async (nama, deskripsi) => {
    const existing = await Kategori.findOne({ nama });
    if (existing) throw new Error('Kategori sudah ada');
    const kategori = new Kategori({ nama, deskripsi });
    return await kategori.save();
};

exports.updateKategoriByNama = async (namaParam, newNama, newDeskripsi) => {
    const decodedNama = decodeURIComponent(namaParam).trim();

    const kategori = await Kategori.findOne({ nama: decodedNama });
    if (!kategori) throw new Error('Kategori tidak ditemukan');

    kategori.nama = newNama || kategori.nama;
    kategori.deskripsi = newDeskripsi || kategori.deskripsi;

    return await kategori.save();
};


exports.hapusKategoriByNama = async (namaParam) => {
    const decodedNama = decodeURIComponent(namaParam).trim();

    const kategori = await Kategori.findOneAndDelete({ nama: decodedNama });
    if (!kategori) throw new Error('Kategori tidak ditemukan');

    return kategori;
};

exports.getSemuaKategori = async () => {
    return await Kategori.find().sort({ createdAt: -1 });
};

exports.kirimPesanKeKategori = async (namaKategori, pesan) => {
    const kategori = await Kategori.findOne({ nama: namaKategori });
    if (!kategori) throw new Error('Kategori tidak ditemukan');

    const users = await User.find({ kategori: kategori._id, no_wa: { $ne: null } });

    if (users.length === 0) throw new Error('Tidak ada user dalam kategori ini');

    const hasil = [];

    for (const user of users) {
        try {
            const kirim = await sendWhatsAppMessage(user.no_wa, pesan);
            hasil.push({ nama: user.username, status: 'Terkirim', respons: kirim });
        } catch (err) {
            hasil.push({ nama: user.username, status: 'Gagal', error: err.message });
        }
    }

    return hasil;
};
