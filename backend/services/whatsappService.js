const axios = require('axios');
require('dotenv').config();

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

exports.sendWhatsAppMessage = async (to, message) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://api.fonnte.com/send',
            headers: {
                Authorization: FONNTE_TOKEN
            },
            data: {
                target: to,
                message: message
            }
        });

        return response.data;
    } catch (error) {
        console.error('Gagal mengirim WhatsApp:', error.response?.data || error.message);
        throw error;
    }
};
