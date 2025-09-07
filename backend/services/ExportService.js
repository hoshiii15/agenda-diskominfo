const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
const Agenda = require('../models/AgendaModel');
const Kategori = require('../models/KategoriModel');

exports.generateAgendaReportPDF = async () => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const filename = `Laporan-Agenda-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '..', 'exports', filename);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Laporan Agenda', { align: 'center' });
    doc.moveDown();

    const agendas = await Agenda.find().populate('kategori').sort({ tanggal: -1 });

    for (const agenda of agendas) {
        doc.fontSize(14).text(`Judul      : ${agenda.judul}`);
        doc.fontSize(12).text(`Deskripsi  : ${agenda.deskripsi || '-'}`);
        doc.text(`Tanggal    : ${dayjs(agenda.tanggal).format('DD MMM YYYY HH:mm')}`);
        doc.text(`Kategori   : ${agenda.kategori?.nama || '-'}`);
        doc.text(`Lokasi     : ${agenda.lokasi || '-'}`);
        doc.moveDown(0.5);

        if (agenda.dokumentasi) {
            const imgPath = path.join(__dirname, '..', agenda.dokumentasi);
            if (fs.existsSync(imgPath)) {
                doc.image(imgPath, { width: 250 });
                doc.moveDown(1);
            }
        }

        doc.moveDown(1).moveTo(30, doc.y).lineTo(570, doc.y).stroke();
        doc.moveDown(1);
    }

    doc.end();
    return filename;
};
