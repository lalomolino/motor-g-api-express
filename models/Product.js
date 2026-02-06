const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    price: {
        type: String,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio debe ser mayor que 0']
    },
    amount: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        min: [0, 'La cantidad debe ser mayor que 0']
    },
    image: {
        type: String,
    },
    visible: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;