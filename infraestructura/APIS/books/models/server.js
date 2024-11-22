/**
 * @author carlos
 * @version 1.0.0
 * 
 * Servidor de express para gestionar libros
 * Esta clase llama a los métodos necesarios para instanciar un servidor
 */

/**
 * Importando variables
 */
const express = require('express');
const cors = require('cors');

/**
 * @class Server
 * clase servidor que inicia el servicio de express para libros
 */
class Server {

    constructor() {
        this.app = express();
        this.port = 3001;
        this.path = '/api/';  
        this.middlewares();
        this.routes();
    }

    
    middlewares() {
        this.app.use(cors()); 
        this.app.use(express.json()); 
    }

    
    routes() {
        this.app.use('/books', require('../routes/books.routes'));
    }

    
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor funcionando en el puerto: ${this.port}`);
        });
    }
}

module.exports = Server;