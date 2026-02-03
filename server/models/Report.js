const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    description: {
        type: String,
        required: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleNo: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['Minor', 'Major', 'Critical'],
        default: 'Minor'
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'False'],
        default: 'Pending'
    },
    photos: [{
        type: String // URLs or Base64 (for now)
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
