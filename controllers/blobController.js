const { put } = require('@vercel/blob');

exports.uploadFile = async (req) => {
    try {
        if (!req.file) {
            return { statusCode: 400, body: { error: 'No file uploaded' } };
        }

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return { statusCode: 500, body: { error: 'Missing BLOB_READ_WRITE_TOKEN' } };
        }

        const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const { url } = await put(
            `products/${Date.now()}-${safeName}`,
            req.file.buffer,
            { access: 'public', contentType: req.file.mimetype }
        );

        return { statusCode: 200, body: { url } };
    } catch (error) {
        console.error('Upload error:', error);
        const message = error?.message || 'Upload failed';
        return { statusCode: 500, body: { error: message } };
    }
};