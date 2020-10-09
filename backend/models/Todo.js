const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please write a Title'],
      unique: [true, 'This task is already register'],
    },

    date: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
