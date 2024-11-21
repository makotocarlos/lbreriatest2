/**
 * @author carlos
 * @version 1.0.0
 * 
 * Servidor de express para gestionar pagos
 * Esta clase llama a los métodos necesarios para instanciar un servidor
 */

/**
 * Importando variables
 */
const express = require('express');
const cors = require('cors');

/**
 * @class PaymentServer
 * Clase servidor que inicia el servicio de express para pagos
 */
class PaymentServer {

    constructor() {
        this.app = express();
        this.port = 3005; // Cambia el puerto para pagos, por ejemplo, 3003
        this.path = '/api/';  // Define el prefijo de las rutas
        this.middlewares();
        this.routes();
    }

    // Configura middlewares
    middlewares() {
        this.app.use(cors()); // Habilita CORS
        this.app.use(express.json()); // Permite el manejo de datos JSON
    }

    // Define las rutas
    routes() {
        this.app.use('/payments', require('../routes/payments.routes')); // Rutas de pagos
    }

    // Inicia el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor de pagos funcionando en el puerto: ${this.port}`);
        });
    }
}

module.exports = PaymentServer;
