/**
 * @author daferarte
 * @version 1.0.0
 * 
 * Rutas de libros
 * Este archivo define las rutas de libros
 */

const { Router } = require('express');

const router = Router();

// Ejemplo de ruta para obtener todos los libros
router.get('/', (req, res) => {
  res.json({
    message: "Lista de libros",
    books: [
      { id: 1, title: "Book 1", author: "Author 1" },
      { id: 2, title: "Book 2", author: "Author 2" }
    ]
  });
});

// Puedes agregar más rutas aquí, como agregar, eliminar, etc.

module.exports = router;
