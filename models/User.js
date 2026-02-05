const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        unique: true,
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'La contraseña debe tener mínimo 8 caracteres'],
        select: false // Oculta en las consultas por defecto
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
    // Solo hashear si el campo está modificado Y no es un hash existente
    if (!this.isModified('password') || this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Verifica si la contraseña almacenada es un hash válido
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
        throw new Error('Formato de hash inválido');
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

// Elimina datos sensibles al convertir a JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;