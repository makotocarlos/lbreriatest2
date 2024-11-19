/**
 * @author carlos
 * @version 1.0.0
 * 
 * Servidor de express para gestionar órdenes
 * Esta clase llama a los métodos necesarios para instanciar un servidor
 */

/**
 * Importando variables
 */
const express = require('express');
const cors = require('cors');

/**
 * @class OrderServer
 * clase servidor que inicia el servicio de express para órdenes
 */
class OrderServer {

    constructor() {
        this.app = express();
        this.port = 3002; // Puedes cambiar el puerto si es necesario
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
        this.app.use('/orders', require('../routes/orders.routes')); // Rutas de órdenes
    }

    // Inicia el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor de órdenes funcionando en el puerto: ${this.port}`);
        });
    }
}

module.exports = OrderServer;