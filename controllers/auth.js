const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res=response) => {
  
  try {
    
    const {email,password} = req.body

    const existeEmail = await Usuario.findOne({ email })
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'Email registrado, por favor intente otro'
      })
    }
    
    const usuario = new Usuario(req.body)

    //encriptar contraseña
    const salt= bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    //Guardar usuario en DB
    await usuario.save()

    // generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      ok: true,
      usuario,
      token
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Comuníquese con el administrador'
    })
  }
}

const login = async(req, res=response) => {

  const {email,password} = req.body

  try {

    //* Verificar que el correo existe
    const usuarioDB = await Usuario.findOne({email})
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Verificar credenciales'
      })
    }

    //Match del password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password)
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: 'Verificar credenciales'
      })
    }

    // Generar JWT
    const token = await generarJWT(usuarioDB.id)
    
    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Comuníquese con el administrador'
    })
  }
}

const renovarToken = async(req, res=response) => {

  try {

    const uid = req.uid

    // generar jwt
    const token = await generarJWT(uid)

    // usuario por uid
    const usuario = await Usuario.findById(uid)

    res.json({
      ok: true,
      usuario,
      token
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Comuníquese con el administrador'
    })
  }
}

module.exports = {
  crearUsuario,
  login,
  renovarToken,
}