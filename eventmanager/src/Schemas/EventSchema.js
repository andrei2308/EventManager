const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['CLOSED', 'OPEN'],
        default: 'CLOSED'
    },
    access_code: {
        type: String,
        required: true,
        unique: true
    },
    group: {
        type: String,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
