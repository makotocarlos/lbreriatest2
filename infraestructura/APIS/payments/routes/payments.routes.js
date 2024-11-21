/**
 * @author carlos
 * @version 1.0.0
 * 
 * Rutas de pagos
 * Este archivo define las rutas para gestionar los pagos
 */

const { Router } = require('express');
const router = Router();

// Importa el controlador correctamente
const { createPayment, getPayments } = require('../controllers/payments.controller');  // Asegúrate de importar ambas funciones

// Ruta para crear un nuevo pago
router.post('/', createPayment);

// Ruta para obtener los pagos (todos o un pago específico)
router.get('/:paymentId?', getPayments);  // La ruta acepta un parámetro opcional `paymentId`

module.exports = router;
