// Import modules
const mongoose = require('mongoose')

// Create schema to add the database's collection)
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

// Put schema to the newly created model
// This create a new model/collection in the database
const userModel = mongoose.model("users", userSchema)

// Export module
module.exports = userModel