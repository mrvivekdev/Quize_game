const User = require('../models/User');

// @desc    Submit quiz score - award 10 coins per correct answer
// @route   POST /api/users/submit-score
// @access  Protected
const submitScore = async (req, res) => {
    try {
        const { correctAnswers, totalQuestions, category } = req.body;

        if (typeof correctAnswers !== 'number' || correctAnswers < 0) {
            return res.status(400).json({ message: 'Invalid correctAnswers value' });
        }

        const total = totalQuestions || 10;
        const wrongAnswers = Math.max(0, total - correctAnswers);
        
        const coinsEarned = (correctAnswers * 5) - (wrongAnswers * 2);

        const user = await User.findById(req.user._id);

        if (!user) {
            console.error(`User ${req.user._id} not found in DB during score submission`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Apply reward/penalty
        user.coins = Math.max(0, user.coins + coinsEarned);
        user.totalScore += correctAnswers;

        // Record History
        if (!user.coinHistory) user.coinHistory = [];
        user.coinHistory.push({
            amount: Math.abs(coinsEarned),
            type: coinsEarned >= 0 ? 'earn' : 'loss',
            category: category || 'Quiz',
            date: new Date()
        });
        
        // Keep only last 50 entries
        if (user.coinHistory.length > 50) {
            user.coinHistory.shift();
        }

        await user.save();

        res.status(200).json({
            message: `Quiz submitted! ${coinsEarned >= 0 ? 'You earned' : 'Penalty of'} ${Math.abs(coinsEarned)} coins.`,
            coinsEarned,
            totalCoins: user.coins,
            totalScore: user.totalScore,
        });
    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).json({ message: 'Server error while submitting score' });
    }
};

// @desc    Get current user's coin history
// @route   GET /api/users/coin-history
// @access  Protected
const getCoinHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('coinHistory');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const historyData = user.coinHistory || [];
        // Return latest first
        const history = [...historyData].sort((a, b) => b.date - a.date);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error while fetching history' });
    }
};

// @desc    Get current user's profile (coins, score, etc.)
// @route   GET /api/users/me
// @access  Protected
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            guestId: user.guestId,
            isGuest: user.isGuest,
            coins: user.coins,
            totalScore: user.totalScore,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error while fetching user' });
    }
};

module.exports = { submitScore, getMe, getCoinHistory };
