const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const agendaToDTO = (agendaDoc) => {
    return {
        agendaId: agendaDoc.agendaId,
        judul: agendaDoc.judul,
        deskripsi: agendaDoc.deskripsi,
        kategori: agendaDoc.kategori,
        tanggal: dayjs(agendaDoc.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm'),
        lokasi: agendaDoc.lokasi,
        dokumentasi: agendaDoc.dokumentasi ? agendaDoc.dokumentasi.replace(/\\/g, '/') : null,
    };
};

const agendaListToDTO = (agendaList) => {
    return agendaList.map(agendaToDTO);
};

module.exports = {
    agendaToDTO,
    agendaListToDTO
};
