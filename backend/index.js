// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const userRoutes = require('./routes/UserRoutes');
const agendaRoutes = require('./routes/AgendaRoutes');
const kategoriRoutes = require('./routes/KategoriRoutes');
const exportRoutes = require('./routes/ExportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Simple logger (opsional)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection failed:', err));

app.use('/api/agenda', agendaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/export', exportRoutes);

// Scheduler
require('./services/AgendaScheduler');

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
