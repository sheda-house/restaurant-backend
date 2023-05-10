const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema({
    BusinessName:{
        type:String,
        required:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        min:8
    },
    Location:{
        type:String
    },
    PhoneNumber:{
        type:String
    }
})

module.exports = mongoose.model('Vendor', VendorSchema)