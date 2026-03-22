const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { admin, initializeFirebaseAdmin } = require('../config/firebase-admin');

// Initialize on load
initializeFirebaseAdmin();

const generateToken = require('../utils/generateToken');

// @desc    Login or register a guest user
// @route   POST /api/auth/guest
// @access  Public
const loginGuest = async (req, res) => {
    try {
        const { guestId } = req.body;
        let user;

        // If a guestId is provided, try to find an existing user
        if (guestId) {
            user = await User.findOne({ guestId });
        }

        // If no user was found, create a new guest user
        if (!user) {
            try {
                // Generate a new guestId if one wasn't provided or if the provided one was invalid
                const newGuestId = guestId || uuidv4();
                
                user = await User.create({
                    isGuest: true,
                    guestId: newGuestId,
                    name: 'Guest Player ' + Math.floor(1000 + Math.random() * 9000), // Random default name like "Guest Player 4123"
                });
            } catch (createError) {
                // Handle race condition: if another request created the user with the same guestId
                // between our findOne and create calls.
                if (createError.code === 11000 && guestId) {
                    console.log(`Race condition hit for guestId: ${guestId}. Fetching existing user.`);
                    user = await User.findOne({ guestId });
                    if (!user) {
                        throw createError; // Rethrow if we still can't find it or it's a different duplicate
                    }
                } else {
                    throw createError;
                }
            }
        }

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'none',  // REQUIRED for cross-origin
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // Send response (still sending token for backward compatibility if needed, but cookies are preferred)
        res.status(200).json({
            _id: user._id,
            name: user.name,
            guestId: user.guestId,
            isGuest: user.isGuest,
            token: token,
        });
    } catch (error) {
        console.error('Error logging in guest:', error);
        res.status(500).json({ message: 'Server error during guest validation' });
    }
};

const loginGoogle = async (req, res) => {
    try {
        const { idToken, guestId } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'No ID token provided' });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // 1. Find or create the Google User
        let user = await User.findOne({ 
            $or: [
                { googleId: uid },
                { email: email }
            ]
        });

        let guestUser = null;
        if (guestId) {
            guestUser = await User.findOne({ guestId, isGuest: true });
        }

        if (!user) {
            // Create new user from Google data
            user = await User.create({
                isGuest: false,
                googleId: uid,
                email: email,
                name: name || 'Google Player',
                avatar: picture || '',
                // Transfer data if guest found
                coins: guestUser ? guestUser.coins : 0,
                totalScore: guestUser ? guestUser.totalScore : 0,
                coinHistory: guestUser ? guestUser.coinHistory : [],
            });
            
            // Delete guest after merging
            if (guestUser) await User.findByIdAndDelete(guestUser._id);

        } else if (user.isGuest) {
            // This case handles if the guestId provided is actually the same user we found
            user.isGuest = false;
            user.googleId = uid;
            user.email = email;
            if (!user.avatar) user.avatar = picture || '';
            await user.save();

        } else if (guestUser) {
            // Existing Google user + existing Guest user -> Merge coins
            user.coins += guestUser.coins;
            user.totalScore += guestUser.totalScore;
            
            // Merge History: Combine both, sort by newest, limit to 50
            const mergedHistory = [...(user.coinHistory || []), ...(guestUser.coinHistory || [])];
            user.coinHistory = mergedHistory
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 50);

            await user.save();
            
            // Delete guest after merging
            await User.findByIdAndDelete(guestUser._id);
            console.log(`Merged guest ${guestId} into Google user ${uid}`);
        }

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',  // REQUIRED for cross-origin
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            googleId: user.googleId,
            email: user.email,
            isGuest: user.isGuest,
            coins: user.coins,
            avatar: user.avatar,
            token: token,
        });
    } catch (error) {
        console.error('Error in Google login:', error);
        res.status(401).json({ message: 'Invalid or expired Google token' });
    }
};

const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    loginGuest,
    loginGoogle,
    logout,
};
