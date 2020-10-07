const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please write and email'],
      unique: [true, 'This email is already register'],
    },

    password: {
      type: String,
      required: [true, 'Please type a password'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
