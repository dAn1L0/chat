const { Schema, model } = require('mongoose')

const MensajeSchema = Schema({
    de:{ // quien envía 
        type:Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true,
    },
    para:{ // para quién se envía
      type:Schema.Types.ObjectId,
      ref: 'Usuario',
      required:true,
    },
    mensaje:{
        type:String,
        required:true,
    },
}, {
  timestamps: true
});

MensajeSchema.method('toJSON', function () {
  const { __v,...object} = this.toObject()
  return object
})

module.exports = model('Mensaje', MensajeSchema);