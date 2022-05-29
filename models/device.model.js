const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
  uid: {
    type: Number,
    required: true,
    unique: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
