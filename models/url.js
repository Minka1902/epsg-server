const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: false,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('urls', urlSchema);
