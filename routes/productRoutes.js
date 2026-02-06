const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/blobController'); // Importa el nuevo controlador
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

// Configura multer para manejar archivos en memoria (no en disco)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware para manejar la subida de imágenes y actualización de productos
const handleImageUpload = async (req, res, next) => {
    if (!req.file) return next(); // Si no hay archivo, continuar

    try {
        const uploadResponse = await uploadFile(req, res);

        if (uploadResponse.statusCode !== 200) {
            return res.status(uploadResponse.statusCode).json(uploadResponse.body);
        }

        req.body.image = uploadResponse.body.url;
        next();
    } catch (error) {
        console.error('Image processing error:', error);
        return res.status(500).json({ error: 'Image processing failed' });
    }
};

// CRUD routes modificadas
router.post('/', authMiddleware.authenticate, upload.single('image'), handleImageUpload, productController.createProduct);
router.patch('/:id', authMiddleware.authenticate, upload.single('image'), handleImageUpload, productController.updateProduct);
router.get('/', authMiddleware.authenticate, productController.getProducts);
router.get('/:id', authMiddleware.authenticate, productController.getProductById);
router.delete('/:id', authMiddleware.authenticate, productController.deleteProduct);

module.exports = router;