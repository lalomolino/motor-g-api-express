const { put } = require('@vercel/blob');

exports.uploadFile = async (req) => {
    try {
        if (!req.file) {
            return { statusCode: 400, body: { error: 'No file uploaded' } };
        }

        const { url } = await put(
            `products/${Date.now()}-${req.file.originalname}`,
            req.file.buffer,
            { access: 'public' }
        );

        return { statusCode: 200, body: { url } };
    } catch (error) {
        console.error('Upload error:', error);
        return { statusCode: 500, body: { error: 'Upload failed' } };
    }
};