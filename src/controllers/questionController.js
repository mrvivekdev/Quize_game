const Question = require('../models/Question');

// @desc    Fetch questions by category and/or difficulty
// @route   GET /api/questions
// @access  Public (or protected if you want)
const getQuestions = async (req, res) => {
    try {
        const { category, difficulty, limit = 10 } = req.query;

        // Build the query object conditionally based on what is provided
        const query = {};
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') }; // Case-insensitive match
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Fetch questions from DB
        // We use .aggregate([ { $sample: { size: limit } } ]) to grab random questions
        let questions;
        if (Object.keys(query).length > 0) {
            // First match our condition, then take a random sample
            questions = await Question.aggregate([
                { $match: query },
                { $sample: { size: parseInt(limit) } }
            ]);
        } else {
            // If no filters just grab random
             questions = await Question.aggregate([
                { $sample: { size: parseInt(limit) } }
            ]);
        }

        // Send response
        // Remove 'createdAt' / 'updatedAt' for a cleaner payload
        const cleanedQuestions = questions.map(q => {
            // Randomize the order of the options
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            return {
                id: q._id,
                questionText: q.questionText,
                options: shuffledOptions,
                correctAnswer: q.correctAnswer,
                category: q.category,
                difficulty: q.difficulty
            }
        });

        res.status(200).json(cleanedQuestions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error while fetching questions' });
    }
};

// @desc    Get all available categories
// @route   GET /api/questions/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Question.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
};

module.exports = {
    getQuestions,
    getCategories
};
