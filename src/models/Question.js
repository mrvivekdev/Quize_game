const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: true,
        },
        options: {
            type: [String],
            required: true,
            validate: {
                validator: function(v) {
                    return v && v.length >= 2;
                },
                message: 'A question must have at least 2 options.'
            }
        },
        correctAnswer: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'General',
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
