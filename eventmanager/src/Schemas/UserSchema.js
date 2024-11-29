
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['organizer', 'participant'],
        default: 'participant'
    },
    organizedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    participatedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;