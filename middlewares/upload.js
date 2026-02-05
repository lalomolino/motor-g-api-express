const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads')); // Directory to save images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
        cb(null, filename); // Solo el nombre del archivo (sin ruta)
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log('File being uploaded:', file.originalname, file.mimetype);
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

module.exports = upload;