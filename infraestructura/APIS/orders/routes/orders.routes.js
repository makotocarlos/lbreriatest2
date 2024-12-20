/**
 * @author carlos
 * @version 1.0.0
 * 
 * Rutas de órdenes
 * Este archivo define las rutas para gestionar las órdenes
 */

const { Router } = require('express');
const { createOrder, getOrder, getOrders, getOrdersByUser } = require('../controllers/orders.controller');

const router = Router();

// Ruta para crear una nueva orden
router.post('/', createOrder);

// Ruta para obtener todas las órdenes
router.get('/', getOrders);

// Ruta para obtener una orden específica
router.get('/:id', getOrder);

// Ruta para obtener las órdenes de un usuario específico
router.get('/user', getOrdersByUser);

module.exports = router;
