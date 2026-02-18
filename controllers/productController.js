const Product = require('../models/Product');
const { del } = require('@vercel/blob'); // Importamos las funciones de Vercel Blob
const Log = require('../models/Log');

const logAction = async (action, productId, productName, user, details = {}) => {
    try {
        await Log.create({
            action,
            productId,
            productName,
            user,
            details
        });
    } catch (error) {
        console.error('Error logging action:', error);
    }
};

// Get all products (no cambia)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const transformedProducts = products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            amount: product.amount,
            image: product.image,
            visible: product.visible,
            location: product.location,
            createdAt: product.createdAt
        }));
        res.status(200).json({ success: true, data: transformedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single product by ID (no cambia)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const transformedProduct = {
            id: product._id,
            name: product.name,
            price: product.price,
            amount: product.amount,
            image: product.image,
            visible: product.visible,
            location: product.location,
            createdAt: product.createdAt
        };
        res.status(200).json({ success: true, data: transformedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Crear un nuevo producto (modificado)
exports.createProduct = async (req, res) => {
    try {
        const { name, price, amount, visible, location } = req.body;

        // La imagen ahora viene como URL desde el middleware handleImageUpload
        const image = req.body.image || null;

        const product = await Product.create({ name, price, amount, visible, location, image });

        const transformedProduct = {
            id: product._id,
            name: product.name,
            price: product.price,
            amount: product.amount,
            image: product.image,
            visible: product.visible,
            location: product.location,
            createdAt: product.createdAt
        };
        await logAction('creado', product._id, name, req.user?.id || 'Admin', { name, price, amount, visible, location });

        res.status(201).json({ success: true, data: transformedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Actualizar producto (modificado)
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, amount, visible, location } = req.body;

        // Si hay una nueva imagen, viene en req.body.image desde el middleware
        const updateData = { name, price, amount, visible, location };
        if (req.body.image) updateData.image = req.body.image;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const transformedProduct = {
            id: product._id,
            name: product.name,
            price: product.price,
            amount: product.amount,
            image: product.image,
            visible: product.visible,
            location: product.location,
            createdAt: product.createdAt
        };
        await logAction('actualizado', product._id, product.name, req.user?.id || 'Admin', { name, price, amount, visible, location });
        res.status(200).json({ success: true, data: transformedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Eliminar producto (modificado)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Eliminar imagen solo si es de Vercel Blob
        if (product.image?.includes('blob.vercel-storage.com')) {
            try {
                await del(product.image);
            } catch (err) {
                console.error('Blob deletion error:', err);
            }
        }

        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};