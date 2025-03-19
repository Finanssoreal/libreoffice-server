const express = require("express");
const multer = require("multer"); //subir archivos
const fs = require("fs"); // interactuar con los archivos
const { exec } = require("child_process");
const rateLimit = require('express-rate-limit'); // Importar rateLimit

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(express.json());
// Función para manejar errores
const handleError = (res, errorMessage, statusCode = 500) => {
    res.status(statusCode).json({ error: errorMessage });
};
// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limitar a 100 solicitudes por IP
    message: "Demasiadas solicitudes desde esta IP, por favor intente más tarde."
});
// Aplicar el rate limiter a todas las rutas
app.use(limiter);
// Ruta para subir archivos y convertirlos a PDF
app.post("/convert", upload.single("file"), (req, res) => {
    const checkFile = req.file;
    if (!checkFile) {
        return handleError(res, "No se envió ningún archivo", 400);
    }
    const inputPath = checkFile.path;
    const outputPath = `converted/${checkFile.filename}.pdf`;

    // Ejecutar el proceso de conversión sin usar if explícito
    exec(`libreoffice --headless --convert-to pdf ${inputPath} --outdir converted`, (error, stdout, stderr) => {
        if (error || stderr) {
            const conversionErrorMessage = `Error al convertir el archivo: ${stderr || error.message}`;
            return handleError(res, conversionErrorMessage);  // Detener la ejecución aquí si hay error
        }
        // Enviar el archivo convertido al cliente
        res.download(outputPath, "documento.pdf", (err) => {
            if (err) {
                return handleError(res, "Error al enviar el archivo");
            }
            // Eliminar archivos temporales después de la descarga
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

