const { Schema, model } = require("mongoose");

const kanbanSchema = new Schema({
  kanbanName: {
    required: true,
    type: String,
    unique: true
  },
  kanbanDescription: String,
  members: [
    {
      username: String,
      profilePicture: Number
    }
  ],
  tasks: [
    {
      createdBy: String,
      createdAt: {
        type: Date,
        default: Date.now()
      },
      body: String,
      state: {
        type: String,
        default: "to-do"
      },
      color: {
        type: Number,
        default: 0
      }
    }
  ],
  kanbanImage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  createdBy: {
    type: String,
    require: true
  }
});

module.exports = model("kanban", kanbanSchema);
