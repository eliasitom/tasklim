const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    require: true,
    type: String
  },
  password: {
    require: true,
    type: String
  }
});

module.exports = model("user", userSchema);
