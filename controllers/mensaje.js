const { response } = require('express');
const Mensaje = require('../models/mensaje');


const obtenerChat = async(req, res=response) => {

  // quien está conectado (de)
  const miId = req.uid
  // para quien fue, los mensajes
  const mensajesPara = req.params.para

  const last = await Mensaje.find({
    $or:[
      {de: miId, para:mensajesPara},
      {de: mensajesPara, para:miId}
    ]
  })
  .sort({createdAt: 'asc'})
  // .limit(30)

  res.json({
    ok: true,
    mensajes: last
  })
}

module.exports = {
  obtenerChat,
}