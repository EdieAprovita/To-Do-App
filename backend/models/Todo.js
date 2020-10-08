const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please write a Title'],
      unique: [true, 'This task is already register'],
    },

    content: {
      type: String,
      required: [true, 'Write the content of the task'],
    },

    author: {
      type: String,
      required: [true, 'Add and author'],
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
