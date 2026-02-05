const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:9000',
        process.env.ADMIN_URI
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Aumenta el límite para imágenes

// Conexión a MongoDB (mantén esto igual)
const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/mydb';
mongoose.connect(uri)
    .then(() => console.log('✅ Conectado correctamente'))
    .catch(err => {
        console.error('❌ Error de conexión:', err.message);
        console.log('URI usada:', uri);
    });

// Configuración de rutas (mantén esto)
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const logRoutes = require('./routes/logRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prod_info_logs', logRoutes);
app.get('/api', (req, res) => {
    res.json({ message: '¡API funcionando!' });
});

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;