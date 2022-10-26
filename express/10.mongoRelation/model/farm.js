const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo')
  .then(() => {
    console.log('mongo connected')
  })
  .catch(err => {
    console.log('mongo connection failed')
    console.log(err)
  })


const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Fall', 'Winter']
  }
})

const farmSchema = new mongoose.Schema({
  name: String,
  city: String,
  produce: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ]
})

const Product = mongoose.model('Product', productSchema);
const Farm = mongoose.model('Farm', farmSchema)

// Product.insertMany([
//   { name: 'Goddess Melon', price: 4.99, season: 'Summer' },
//   { name: 'Sugar Baby Watermelon', price: 7.50, season: 'Summer' },
//   { name: 'Asparagus', price: 3.99, season: 'Spring' },
// ])

const makeFarm = async () => {
  const farm = new Farm({ name: 'Full Belly Farms', city: 'Guinda, CA' })
  const melon = await Product.findOne({ name: 'Goddess Melon' })
  farm.produce.push(melon);
  await farm.save();
  console.log(farm);
}

// makeFarm();

const addProduce = async () => {
  const farm = await Farm.findOne({ name: 'Full Belly Farms' });
  const watermelon = await Product.findOne({ name: 'Sugar Baby Watermelon' })
  farm.produce.push(watermelon);
  await farm.save();
  console.log(farm);
}

// addProduce();





Farm.findOne({ name: 'Full Belly Farms' }).populate('produce').then(farm => console.log(farm))