const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Product = require('./product');

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Farm must have a name!']
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email required']
  },
  produces: [
    { type: Schema.Types.ObjectId, ref: 'Product' }
  ]
})

// farmSchema.pre('findOneAndDelete', async function (data) {
//   console.log("PRE MIDDLEWARE")
//   console.log(data)
// })

farmSchema.post('findOneAndDelete', async function (farm) {
  if (farm.produces.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.produces } })
    console.log(res)
  }

})


module.exports = new mongoose.model('Farm', farmSchema)