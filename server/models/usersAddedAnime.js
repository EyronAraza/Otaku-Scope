// Import modules
const mongoose = require('mongoose')

// Create schema to add the database's collection)
const animeSchema = new mongoose.Schema({
    username: String,
    animeTitle: String,
    animeId: String,
    status: {
        type: String,
        default: "Plan to Watch"
    },
    episode: {
        type: Number,
        default: 1
    }
})

// Put schema to the newly created model
// This create a new model/collection in the database
const addedAnimeModel = mongoose.model("users-added-animes", animeSchema)

// Export module
module.exports = addedAnimeModel