const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  link: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      default: 0,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createsAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("card", cardSchema);
