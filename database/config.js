const mongoose = require('mongoose')

const dbConnection = async() => {
  try {

    await mongoose.connect(process.env.DB_CNN_URL)
    console.log('DB online!');
    
  } catch (error) {
    console.log(error);
    throw new Error('Comunicar al administrador')
  }
}

module.exports = {
  dbConnection
}