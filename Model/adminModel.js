const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
})

module.exports = mongoose.model('admin', adminSchema)