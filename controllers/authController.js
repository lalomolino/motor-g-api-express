const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración JWT
const JWT_CONFIG = {
    expiresIn: '1h',
    issuer: 'mi-api'
};

// Generador de token reutilizable
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        JWT_CONFIG
    );
};

// Controlador de Registro
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validación básica
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar usuario existente
        if (await User.findOne({ email })) {
            return res.status(409).json({ error: 'El email ya está registrado' });
        }

        // Hash de contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Respuesta exitosa
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            error: 'Error en el servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Controlador de Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'No se encontró el user' });
        }

        // 3. Comparación con validación estricta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 4. Generar token (sin enviar el hash)
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        const token = generateToken(user._id);
        res.json({ ...userWithoutPassword, token });

    } catch (error) {
        console.error('Error en login:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Controlador de Ruta Protegida
exports.protectedRoute = async (req, res) => {
    try {
        // El middleware auth ya validó el token y añadió req.user
        const user = await User.findById(req.user.id)
            .select('-password -__v'); // Excluir campos sensibles

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            message: 'Acceso autorizado',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en ruta protegida:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};