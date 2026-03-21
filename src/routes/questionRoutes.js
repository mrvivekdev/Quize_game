const express = require('express');
const router = express.Router();
const { getQuestions, getCategories } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/questions/categories
router.get('/categories', protect, getCategories);

// GET /api/questions
router.get('/', protect, getQuestions);

module.exports = router;
