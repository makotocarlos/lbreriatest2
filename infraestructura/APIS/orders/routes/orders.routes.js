/**
 * @author carlos
 * @version 1.0.0
 * 
 * Rutas de órdenes
 * Este archivo define las rutas para gestionar las órdenes
 */

const { Router } = require('express');
const router = Router();

// Importa el controlador correctamente
const { createOrder, getOrders } = require('../controllers/orders.controller');  // Asegúrate de importar ambas funciones

// Ruta para crear una nueva orden
router.post('/', createOrder);

// Ruta para obtener las órdenes (todas o una específica)
router.get('/:orderId?', getOrders);  // La ruta acepta un parámetro opcional `orderId`

module.exports = router;
