const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    cart: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'food',
          required: true
        },
        image: { 
            type: String 
        },
            title: String,
            desc: String,
            price: Number,
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  });

module.exports = mongoose.model('Cart', cartSchema)