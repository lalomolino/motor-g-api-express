const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/blobController'); // Importa el nuevo controlador
const productController = require('../controllers/productController');

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
router.post('/', upload.single('image'), handleImageUpload, productController.createProduct);
router.patch('/:id',  upload.single('image'), handleImageUpload, productController.updateProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);

module.exports = router;