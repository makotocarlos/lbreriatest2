/**
 * @author carlos
 * @version 1.0.0
 * 
 * Rutas de libros
 * Este archivo define las rutas de libros
 */

const { Router } = require('express');

const router = Router();

/**
 * Importando los métodos
 */
const { ShowBooks, AddBook, ShowBook, EditBook, DeleteBook } = require('../controllers/books.controller');

/**
 * Rutas
 */
router.get('/', ShowBooks); // Obtener todos los libros
router.post('/', AddBook); // Agregar un libro
router.get('/:id', ShowBook); // Obtener un libro específico
router.put('/:id', EditBook); // Editar un libro
router.delete('/:id', DeleteBook); // Eliminar un libro

module.exports = router;
