const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  title: String,
  body: String,
  color: {
    type: Number,
    default: 0
  }
});

module.exports = model("note", noteSchema);
