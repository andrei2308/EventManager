const attendanceSchema = mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    confirmed_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
