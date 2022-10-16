const mongoose = require('mongoose');
const { Product } = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand2')
  .then(() => {
    console.log('mongo connection opened')
  })
  .catch((err) => {
    console.log('mongo connection failed')
    console.log(err)
  })

const p = new Product({ name: 'Ruby Grapefruit', price: 1.99, category: 'fruit' })

// p.save()
// .then(data =>{
//   console.log(data)
// })
// .catch(err => {
//   console.log(err)
// })
const seedProducts = [
  {
    name: 'Fairy Eggplant',
    price: 1.00,
    category: 'vegetable',
  },
  {
    name: 'Organic Goddess Melon',
    price: 4.99,
    category: 'fruit'
  },
  {
    name: 'Organic Mini Seedless Watermelon',
    price: 3.99,
    category: 'fruit'
  },
  {
    name: 'Organic Celery',
    price: 1.50,
    category: 'vegetable'
  },
  {
    name: 'Chocolate Whole Milk',
    price: 2.69,
    category: 'dairy'
  }
]

// 하나라도 유효성 검사를 실패하면 데이터 삽입 X -> 모두 실패
Product.insertMany(seedProducts)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err)
  })