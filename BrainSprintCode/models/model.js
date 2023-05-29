//Followed the tutorial of: https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/

const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  question: {
    required: true,
    type: Array,
  },
  visibility: {
    required: true,
    type: Boolean,
  },
  views: {
    required: false,
    type: Number,
  },
});

module.exports = mongoose.model("Data", dataSchema);
