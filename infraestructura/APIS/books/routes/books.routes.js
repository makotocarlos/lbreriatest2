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
router.get('/', ShowBooks); 
router.post('/', AddBook); 
router.get('/:id', ShowBook); 
router.put('/:id', EditBook); 
router.delete('/:id', DeleteBook); 

module.exports = router;
