const kategoriService = require('../services/KategoriService');
const { kategoriToDTO } = require('../utils/kategoriDTO');

exports.tambahKategori = async (req, res) => {
    console.log(req.body); // <--- Tambahkan ini
    try {
        const { nama, deskripsi } = req.body;
        const kategori = await kategoriService.tambahKategoriBaru(nama, deskripsi);
        res.status(201).json({ message: 'Kategori ditambahkan', kategori: kategoriToDTO(kategori) });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menambah kategori', error: err.message });
    }
};

exports.editKategori = async (req, res) => {
    try {
        const { nama } = req.params;
        const { newNama, newDeskripsi } = req.body;

        const kategori = await kategoriService.updateKategoriByNama(nama, newNama, newDeskripsi);
        res.status(200).json({ message: 'Kategori diperbarui', kategori: kategoriToDTO(kategori) });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengedit kategori', error: err.message });
    }
};

exports.hapusKategori = async (req, res) => {
    try {
        const { nama } = req.params;

        const deleted = await kategoriService.hapusKategoriByNama(nama);
        res.status(200).json({ message: 'Kategori dihapus', deleted });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menghapus kategori', error: err.message });
    }
};

exports.ambilSemuaKategori = async (req, res) => {
    try {
        const kategoriList = await kategoriService.getSemuaKategori();
        const kategoriDTOList = kategoriList.map(kategoriToDTO);
        res.status(200).json({ kategori: kategoriDTOList });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil kategori', error: err.message });
    }
};

exports.kirimPesanKategori = async (req, res) => {
    try {
        const { namaKategori, pesan } = req.body;
        const hasil = await kategoriService.kirimPesanKeKategori(namaKategori, pesan);
        res.status(200).json({ message: 'Pesan dikirim ke kategori', hasil });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengirim pesan', error: err.message });
    }
};