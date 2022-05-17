const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    uid: {
        type: Number,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('User', DeviceSchema);