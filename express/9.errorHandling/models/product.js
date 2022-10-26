const mongoose = require('mongoose');

const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name cannot be blank']
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'dairy'],
    lowercase: true,
  }
})

exports.Product = new mongoose.model('Product', productSchema);