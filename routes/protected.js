// routes/protected.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    console.log("Protected Route!! ")
    // res.json({ message: 'This route is protected', userId: req.userId });
});

module.exports = router;
