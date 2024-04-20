const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: String,
    description: String
})

module.exports = Role = mongoose.model('Role', roleSchema)