exports.kategoriToDTO = (kategori) => ({
    nama: kategori.nama,
    deskripsi: kategori.deskripsi,
    dibuatPada: kategori.createdAt,
    diperbaruiPada: kategori.updatedAt,
});

exports.kategoriListToDTO = (list) => list.map(exports.kategoriToDTO);
