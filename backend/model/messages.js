// models/Message.js

const mongoose = require('mongoose');
 
const messageSchema = new mongoose.Schema({
  sender: {
    type: Object,
    required: true
  },
  receiver: {
    type: Object,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
