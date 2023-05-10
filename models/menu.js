const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    image: { 
        type: String 
    },
        title: String,
        desc: String,
        price: Number,
    vendorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor"
    },
    
        stockStatus:{
            inStock: String,
        }
},
{timestamps:true}
)

module.exports = mongoose.model('Menu', menuSchema)