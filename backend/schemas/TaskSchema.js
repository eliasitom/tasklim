const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  body: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  state: {
    type: String,
    default: "to-do"
  },
  color: {
    type: Number,
    default: 0
  }
});

module.exports = model("task", taskSchema);
