const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
        unique: true
    },
    deskripsi: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Kategori', kategoriSchema);
