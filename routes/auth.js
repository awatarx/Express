// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const multer = require('multer');
const jwt = require('jsonwebtoken');


var upload = multer();

const router = express.Router();

router.post('/register', upload.array(), async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/login', upload.array(), async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Username.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log(password);
        console.log(user.password); 

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign({ userId: user._id }, 'Awatar', { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
