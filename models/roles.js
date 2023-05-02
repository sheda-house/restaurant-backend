const mongoose = require('mongoose')

const rolesSchema = new mongoose.Schema({
    Name:String
})
module.exports = mongoose.model("Role", rolesSchema)