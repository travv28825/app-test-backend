const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    uid: {
        type: Number,
        required: true,
        unique: true
    },
    vendor: {
        type: String,
        required: true
    },
    created: { type: Date, default: Date.now },
    status: {
        type: String,
        required: true
    }
});

DeviceSchema.pre('save', next => {
    now = new Date();
    if (!this.created) {
        this.created = now;
    }
    next();
});

module.exports = mongoose.model('Device', DeviceSchema);