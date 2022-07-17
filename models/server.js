const express = require('express');
const http = require('http');
const socket_io = require('socket.io');
const path = require('path');
const Sockets = require('./sockets');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

  constructor(){
    this.app = express();
    this.port = process.env.PORT;

    // Conectar a DB
    dbConnection()
    
    //? Http Server
    this.server = http.createServer(this.app);
    
    //? Configuración socketIO
    this.io = socket_io(this.server, {
      // configuración
    });
  }

  middleware() {
    this.app.use(express.static(path.resolve(__dirname,'../public')) )
    
    this.app.use( cors() )

    //parse of body
    this.app.use(express.json())

    //? Configuración Endpoints
    this.app.use('/api/login', require('../router/auth')) 
    this.app.use('/api/mensajes', require('../router/mensaje')) 
    
  }

  socketsIO(){
    new Sockets(this.io)
  }

  execute() {

    this.middleware();

    this.socketsIO();

    this.server.listen( this.port, () => {
      console.log('Servidor corriendo en puerto: ', this.port);
    })
  }

}

module.exports = Server