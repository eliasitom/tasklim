const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    require: true,
    type: String,
    unique: true
  },
  password: {
    require: true,
    type: String
  },
  profilePicture: {
    type: Number,
    default: Math.floor(Math.random() * 7)
  }
});

module.exports = model("user", userSchema);
