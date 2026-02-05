const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['creado', 'actualizado']
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    user: {
        type: String, // Or ObjectId if you have a User model
        default: 'Admin'
    },
    details: {
        type: Object, // Store additional details about the action
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;