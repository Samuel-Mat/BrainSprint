const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  owner: {
    required: false,
    type: Array,
  },
  added: {
    required: false,
    type: Array,
  },
  currentlyPlaying: {
    required: false,
    type: Array,
  },
});

module.exports = mongoose.model("User", dataSchema);
