import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directorio donde se guardan las fotos de mecánicos
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'mecanicos');

// Crea el directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Extensiones permitidas
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        // Nombre único: timestamp + extensión original sanitizada
        const ext = path.extname(file.originalname).toLowerCase();
        const nombre = `mecanico-${Date.now()}${ext}`;
        cb(null, nombre);
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (EXTENSIONES_PERMITIDAS.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes JPG, PNG o WebP.'));
    }
};

// Límite: 5 MB por foto
export const uploadFoto = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('fotoPerfil');
