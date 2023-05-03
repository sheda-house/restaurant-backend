const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    FirstName : String,
    LastName : String,
    Email: {
        type: String,
        unique : true
    },
    PhoneNumber: {
        type: String,
        unique: true
    },
    Password: String,
    cPassword: String,
    RoleId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role"
    }
})

module.exports = mongoose.model("Users", userSchema)