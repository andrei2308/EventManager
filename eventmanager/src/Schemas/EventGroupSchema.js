const eventGroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const EventGroup = mongoose.model('EventGroup', eventGroupSchema);
module.exports = EventGroup;
