const jwt = require('jsonwebtoken');

/**
 * Genera un JSON Web Token (JWT) para un libro.
 * @param {Object} data - Datos del libro.
 * @param {number} data.id - ID del libro.
 * @param {string} data.title - Título del libro.
 * @returns {string} - Token generado.
 */
const CreateBookJWT = (data) => {
    const { id, title } = data;
    const token = jwt.sign(
        {
            id,
            title
        },
        process.env.AUTH_JW_SECRET_KEY // Llave secreta definida en el archivo .env
    );
    return token;
};

module.exports = {
    CreateBookJWT
};
