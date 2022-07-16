const Mensaje = require('../models/mensaje')
const Usuario = require('../models/usuario')



const usuarioConectado = async(uid, conectado=false) => {

  const usuario = await Usuario.findById(uid)
  usuario.online = conectado
  await usuario.save()

  return usuario

}

const getUsuarios = async() => {

  const usuarios = await Usuario
    .find()
    .sort('-online')

  return usuarios

}

const guardarMensaje = async(payload) => {

  try {

    const mensaje = new Mensaje(payload)
    await mensaje.save()
    
    return mensaje

  } catch (error) {
    console.log(error);
    return false
  }

}



module.exports = {
  usuarioConectado,
  getUsuarios,
  guardarMensaje,
}