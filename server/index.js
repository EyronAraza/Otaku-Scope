// Import modules
require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')

// ENV variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Import mongodb Models
const userModel = require('./models/user')
const addedAnimeModel = require('./models/usersAddedAnime')

// Client URL
const client_url = "https://otaku-scope.vercel.app"

// Create express app
const app = express()
app.use(express.json()) // To parse JSON request bodies (e.g. to use "req.body" allowing you to access this data sent via form)
app.use(cors({ // cors is to allow cross origin (allows your server to accept requests from different origins)
    origin: [client_url],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    // exposedHeaders: ["set-cookie"]
}
))
app.use(cookieParser()) // parse cookie

// Connect to mongo database
mongoose.connect(MONGO_URI)

// Server response test
app.get('/', (req, res) => {
    res.json("Connected to Express. Hello World!")
})

// Handle POST requests for Register
app.post('/register', (req, res) => {
    // Check if name or email exists in database
    userModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
        .then(existingUser => {
            // Check if user exist in database, otherwise create new account for user
            if (existingUser) {
                res.json("Username or email already exists!")
            } else {
                const { username, email, password } = req.body
                bcrypt.hash(password, 10) // hash password
                    .then(hash => {
                        // Add registered users to the database
                        userModel.create({ username, email, password: hash })
                        res.json("Registered")
                            .then(user => res.json(`USER CREATED! -> ${user}`))
                            .catch(err => res.json(err))
                    }).catch(err => console.log(err.message))
            }
        })
        .catch(err => res.status(500).json(err))
})

// Handle requests for Login
app.post('/login', (req, res) => {
    const { username, password } = req.body
    // After user logins with a username OR email, it will try to find either of those in the database
    userModel.findOne({ $or: [{ username: username }, { email: username }] })
        .then(user => {
            // Check if user or email exists
            if (user) {
                // Compare input password with database's user password
                bcrypt.compare(password, user.password, (err, response) => {
                    // check if password is correct
                    if (response) {
                        // Create web token (do not share secret key!)
                        const token = jwt.sign({ username: user.username }, JWT_SECRET_KEY, { expiresIn: "1d" })
                        res.cookie("token", token, { // store token into cookie
                            secure: true,
                            path: '/',
                            sameSite: 'none',
                        })

                        // Combine messages into a single object
                        const responseMessages = {
                            status: "Success",
                            message: "Login successful"
                        }

                        // Send combined messages as a single response
                        res.json(responseMessages);
                    } else {
                        res.json("wrong password")
                    }
                })
            } else { // check if email doesnt exists
                res.json("No record existed")
            }
        })
})

// Middleware to verify if user is logged in
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) {
        return res.json("Token not available. User not logged in.")
    } else {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.json("Token is wrong.")

            // Decode token
            req.user = decoded;

            // Continue next code
            next()
        })
    }
}

// Handle GET requests for Home page
app.get('/home', verifyUser, (req, res) => {
    // Access the username from token
    const currentUser = req.user;

    // Combine messages into a single object
    const responseMessages = {
        status: "Token Success",
        user: currentUser.username
    };

    return res.json(responseMessages);
})

// Handle POST requests for added anime item
app.post('/animeitem', (req, res) => {
    // Add anime item to the database
    const { username, animeId, animeTitle } = req.body
    addedAnimeModel.create({ username, animeId, animeTitle })
        .then(item => res.json(`Anime is posted to database. ${item}"`))
        .catch(err => res.json(err))
})

// Handle DELETE requests for removing added anime item from database 
app.delete('/animeitem/:username/:animeId', async (req, res) => {
    const { username, animeId } = req.params;

    try {
        // Find and delete the specific item for the given username and itemName
        await addedAnimeModel.findOneAndDelete({ username, animeId });

        res.json({ message: `Anime "${animeId}" for user ${username} has been deleted.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Handle GET requests to check if an added anime item is in user's list (returns bool)
app.get('/animeitem/status', async (req, res) => {
    const { username, animeId } = req.query;

    if (!username || !animeId) {
        return res.status(400).send({ message: "Username and item name are required" });
    }

    try {
        // Adjust the query to find items matching both username and anime item
        const items = await addedAnimeModel.find({ username, animeId });
        const isInList = items.length > 0;
        res.send({ isInList });
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// Handle GET requests to check for any added anime items by the user
app.get('/animeItem/items', async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: "Username is required" });
    }
    try {
        // Look for added cart items by a user
        const items = await addedAnimeModel.find({ username });
        res.send(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.put('/update-anime-item', async (req, res) => {
    const { animeId, status, episode } = req.body;

    try {
        const result = await addedAnimeModel.updateOne(
            { animeId },
            { $set: { status, episode } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Anime item not found' });
        }

        res.status(200).json({ message: 'Anime item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})

// Run port aka running the server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})