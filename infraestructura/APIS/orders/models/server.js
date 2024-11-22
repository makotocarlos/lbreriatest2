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
        this.port = 3002; 
        this.path = '/api/';  
        this.middlewares();
        this.routes();
    }

    // Configura middlewares
    middlewares() {
        this.app.use(cors()); 
        this.app.use(express.json()); 
    }

    // Define las rutas
    routes() {
        this.app.use('/orders', require('../routes/orders.routes')); 
    }

    // Inicia el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor de órdenes funcionando en el puerto: ${this.port}`);
        });
    }
}

module.exports = OrderServer;