const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo POST permitido' });
    }

    try {
        const file = req.file; // Asumiendo que usas multer

        if (!file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        const { url } = await put(`uploads/${Date.now()}-${file.originalname}`, file.buffer, {
            access: 'public',
        });

        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir: ' + error.message });
    }
};