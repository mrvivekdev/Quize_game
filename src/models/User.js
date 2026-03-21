const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        isGuest: {
            type: Boolean,
            default: true,
        },
        guestId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values for non-guests
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // For future Google Auth implementation
        },
        name: {
            type: String,
            required: true,
            default: 'Guest Player',
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        totalScore: {
            type: Number,
            default: 0,
        },
        coins: {
            type: Number,
            default: 0,
        },
        coinHistory: [
            {
                amount: { type: Number, required: true },
                type: { type: String, enum: ['earn', 'loss', 'bonus', 'penalty'], default: 'earn' },
                category: { type: String, default: 'General' },
                date: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
