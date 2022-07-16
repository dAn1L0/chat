const { usuarioConectado, getUsuarios, guardarMensaje } = require('../controllers/sockets');
const { comprobarJWT } = require('../helpers/jwt');


class Sockets {

  constructor(io){

    this.io = io

    this.socketEvents();

  }

  socketEvents(){

    this.io.on('connection', async(socket) => {

      //comprobar el jwt, desconectar si el token no es válido
      const token = socket.handshake.query['x-token']
      const [valido, uid] = comprobarJWT(token)
      if (!valido) {
        console.log('socket no identificado');
        return socket.disconnect()
      }

      //Saber el usuario activo mediante atributo online usando UID
      await usuarioConectado(uid, true)

      //Emitir todos los usuarios registrados ordenados conectados primero
      this.io.emit('usuarios-registrados', await getUsuarios() )
      
      //Socket join crear salas independientes para cada chat privado
      socket.join(uid)
      
      
      //Escuchar cuando un usuario envía un mensaje 'mensaje-privado'
      socket.on('mensaje-privado', async(payload) => {
        const mensaje = await guardarMensaje(payload)
        this.io.to(mensaje.para.toHexString()).emit('mensaje-privado', mensaje)
        this.io.to(mensaje.de.toHexString()).emit('mensaje-privado', mensaje)
      })

      
      //Usuario desconectado cambiar su estado online:false
      socket.on('disconnect', async() => {
        await usuarioConectado(uid)
        this.io.emit('usuarios-registrados', await getUsuarios() )
      })
    })
  }

}

module.exports = Sockets