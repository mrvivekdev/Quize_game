const express = require('express');
const router = express.Router();
const { submitScore, getMe, getCoinHistory } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/users/submit-score  — award 10 coins per correct answer
router.post('/submit-score', protect, submitScore);

// GET /api/users/me  — get current user profile + coins
router.get('/me', protect, getMe);

// GET /api/users/coin-history — get transaction history
router.get('/coin-history', protect, getCoinHistory);

module.exports = router;
