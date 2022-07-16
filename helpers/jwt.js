const jwt = require('jsonwebtoken')


const generarJWT = (uid) => {

  return new Promise( (resolve, reject) => {

    const payload = { uid }
    
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { 
      expiresIn: "1h" 
    }, (err, token) => {

      if (err) {
        console.log(err);
        reject('Error al generar token')
      } else {
        resolve(token)
      }

    });

  })

}

const comprobarJWT = (token='') => {

  try {
    const {uid} = jwt.verify(token,process.env.JWT_SECRET_KEY)

    return [true,uid]
  } catch (error) {
    console.log(error);
    return [false,null]
  }

}

module.exports = {
  generarJWT,
  comprobarJWT
}