const express = require('express');
const router = express.Router();
const { loginGuest, loginGoogle } = require('../controllers/authController');

// Guest Authentication Route
router.post('/guest', loginGuest);

// Google Authentication Route
router.post('/google', loginGoogle);

module.exports = router;
