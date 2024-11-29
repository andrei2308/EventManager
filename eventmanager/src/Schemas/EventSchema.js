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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventGroup'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
