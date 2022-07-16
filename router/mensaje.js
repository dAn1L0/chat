/*
  path: api/mensajes
*/
const { Router } = require('express')
const { check } = require('express-validator')
const { obtenerChat } = require('../controllers/mensaje')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.get('/:para',[
  check('para', 'ID no es válido').isMongoId(),
  validarJWT,
  validarCampos
], obtenerChat)


module.exports = router
