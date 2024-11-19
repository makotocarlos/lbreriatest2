const CryptoJS = require("crypto-js");

/**
 * Cifra los datos de un libro utilizando AES.
 * @param {string} data - Datos del libro a cifrar (puede ser cualquier string, como título, descripción, etc.).
 * @returns {string} - Datos cifrados.
 */
const EncryptBookData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(data, process.env.AUTH_AES_SECRET_KEY).toString();
    return ciphertext;
};

/**
 * Descifra los datos de un libro utilizando AES.
 * @param {string} data - Datos cifrados del libro.
 * @returns {string} - Datos originales descifrados.
 */
const DecryptBookData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, process.env.AUTH_AES_SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

module.exports = {
    EncryptBookData,
    DecryptBookData
};