const cron = require('node-cron');
const Agenda = require('../models/AgendaModel');
const User = require('../models/UserModel');
const { sendWhatsAppMessage } = require('./whatsappService');

const kirimPengingatAgenda = async () => {
    try {
        const sekarang = new Date();
        const besok = new Date(sekarang);
        besok.setDate(besok.getDate() + 1);

        const agendas = await Agenda.find({
            tanggal: {
                $gte: new Date(besok.setHours(0, 0, 0, 0)),
                $lt: new Date(besok.setHours(23, 59, 59, 999))
            }
        }).populate('kategori');

        for (const agenda of agendas) {
            if (agenda.tanggal < new Date()) continue;

            const kategori = agenda.kategori;
            if (!kategori) continue;

            const users = await User.find({
                kategori: kategori._id,
                no_wa: { $ne: null },
                isVerified: true
            });

            for (const user of users) {
                const message = `📌 *Pengingat Agenda*\n\nJudul: ${agenda.judul}\nDeskripsi: ${agenda.deskripsi}\nTanggal: ${agenda.tanggal.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\nLokasi: ${agenda.lokasi}`;
                await sendWhatsAppMessage(user.no_wa, message);
                console.log(`✅ Pesan terkirim ke ${user.username} (${user.no_wa})`);
            }
        }
    } catch (err) {
        console.error('❌ Gagal mengirim pengingat agenda:', err.message);
    }
};

(async () => {
    console.log('🚀 Menjalankan pengingat agenda saat server dinyalakan');
    await kirimPengingatAgenda();
})();

cron.schedule(
    '0 7 * * *',
    () => {
        console.log('🔔 Menjalankan jadwal pengingat agenda...');
        kirimPengingatAgenda();
    },
    {
        timezone: 'Asia/Jakarta'
    }
);
