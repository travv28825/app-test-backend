const mongoose = require('mongoose');

const GatewaySchema = mongoose.Schema({
  serial: {
    type: String,
    required: true,
    unique: true,
  },
  human: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  devices: {
    type: Array,
  },
});

module.exports = mongoose.model('Gateway', GatewaySchema);
