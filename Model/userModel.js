const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }, 
    image: {
        type: String
    }
})

module.exports = mongoose.model('Users', userSchema)