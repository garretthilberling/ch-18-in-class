const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  // Add these four attributes to your schema: username, password, email, userCreated
  // YOUR CODE HERE
  //
  username: {
    type: String,
    trim: true,
    required: 'Username is required!'
  },
  password: {
    type: String,
    required: 'Password is required!',
    minLength: 6
  },
  email: {
    type: String,
    match: /\S+@\S+\.\S+/,
    unique: true,
    required: 'Email is required!'
  },
  userCreated: {
    type: Date,
    default: Date.now
  }
});

const User = model('User', UserSchema);

module.exports = User;
