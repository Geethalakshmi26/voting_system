const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./database');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'voting-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// 🔹 User Signup
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please log in.' });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.redirect('/login.html');
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: 'Signup failed.' });
    }
});

// 🔹 User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = user;
    res.json({ success: true, redirect: "/voting.html" });  // ✅ Change here (match filename)
});

// 🔹 Handle Vote
app.post('/vote', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ message: 'Unauthorized. Please login.' });
    }

    const { candidate } = req.body;

    try {
        // ✅ Check if the user has already voted
        const user = await User.findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.voted) {
            return res.status(400).json({ message: 'You already voted.' });
        }

        // ✅ Update vote and set voted to true
        user.vote = candidate;
        user.voted = true;
        await user.save();

        // ✅ Destroy session
        req.session.destroy();

        // ✅ Send response
        res.json({ message: `Your vote for ${candidate} was submitted successfully.` });

    } catch (err) {
        console.error("Vote error:", err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error("MongoDB connection error:", err));

// 🔹 Results Page - Send Sorted Vote Counts
app.get('/results', async (req, res) => {
    try {
        const candidates = [
            { name: "DR.C.Jayapratha", image: "/images/mad.png" },
            { name: "DR.A.B.Hajira Be", image: "/images/adt.jpg" },
            { name: "MR.R.Ramasamy", image: "/images/software.png" },
            { name: "MR.Syed Raffi Ahamed", image: "/images/fullstack.jpg" },
            { name: "Mrs.J.Uma", image: "/images/cloud.jpg" },
            { name: "Mrs.Bhuvaneshwari", image: "/images/cyber.jpg" },
        ];

        const voteCounts = {};

        // Count votes
        const users = await User.find({ vote: { $exists: true } });

        users.forEach(user => {
            const candidate = user.vote;
            console.log("Voted for:", candidate); // ✅ Debug log
            if (!voteCounts[candidate]) voteCounts[candidate] = 0;
            voteCounts[candidate]++;
        });

        // Attach vote count and sort
        const resultData = candidates.map(candidate => ({
            name: candidate.name,
            image: candidate.image,
            votes: voteCounts[candidate.name] || 0
        })).sort((a, b) => b.votes - a.votes); // sort descending

        res.json(resultData);
    } catch (err) {
        console.error("Error getting results:", err);
        res.status(500).json({ message: 'Error loading results' });
    }
});
