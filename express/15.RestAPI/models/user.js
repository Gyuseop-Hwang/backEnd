const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { types: { ObjectId } } = Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'I am new'
  },
  posts: [
    {
      type: ObjectId,
      ref: 'Post'
    }
  ]
})

module.exports = mongoose.model('User', UserSchema);