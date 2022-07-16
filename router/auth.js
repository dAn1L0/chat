/*
  path: api/login
*/

const { Router } = require('express')
const { check } = require('express-validator')
const { crearUsuario, login, renovarToken } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.post('/new',[
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña debe contener cinco caracteres mínimo').isLength({min: 5}).not().isEmpty(),
  validarCampos
], crearUsuario)

router.post('/',[
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login)

router.get('/renew',validarJWT, renovarToken)

module.exports = router