require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// 1. Configuración
const MONGODB_URI = process.env.MONGODB_URI;
const INITIAL_USERS = [
    {
        username: 'admin',
        email: 'admin@motorg.com',
        password: 'Admin123' // Cambia esto en producción
    }
];

// 2. Función principal
async function seedUsers() {
    try {
        console.log('🔃 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conexión exitosa');

        // Limpiar colección existente (opcional)
        // await User.deleteMany({});

        const createdUsers = [];

        for (const userData of INITIAL_USERS) {
            // Verificar si el usuario ya existe
            const exists = await User.findOne({ email: userData.email });
            if (exists) {
                console.log(`⚠️  Usuario ${userData.email} ya existe`);
                continue;
            }

            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(userData.password, 12);

            // Crear usuario
            const user = await User.create({
                username: userData.username,
                email: userData.email,
                password: hashedPassword
            });

            createdUsers.push({
                username: user.username,
                email: user.email,
                id: user._id
            });
        }

        // Resultados
        if (createdUsers.length > 0) {
            console.log('✅ Usuarios creados:');
            console.table(createdUsers);
        } else {
            console.log('ℹ️  Todos los usuarios ya existían');
        }

    } catch (error) {
        console.error('❌ Error durante el seeding:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

// 3. Ejecutar
seedUsers();