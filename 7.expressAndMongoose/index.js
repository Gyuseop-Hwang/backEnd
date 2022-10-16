const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Product } = require('./models/product');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/farmStand')
  .then(() => {
    console.log('mongo connection opened')
  })
  .catch((err) => {
    console.log('mongo connection failed')
    console.log(err)
  })


const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.get('/products', async (req, res) => {
  const { category } = req.query
  const products = category ? await Product.find({ category }) : await Product.find();
  res.render('products/index', { category, products });
})

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products/new', (req, res) => {
  res.render('products/new', { categories })
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const foundProduct = await Product.findById(id);
  // console.log(foundProduct)
  // res.send('success')
  res.render('products/show', { foundProduct });
})

app.post('/products', async (req, res) => {
  // const data = await Product.create(req.body)
  // console.log(data)
  // res.send('Making your product')
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/new', (req, res) => {
  res.render('products/new')
})

app.get('/products/:id/edit', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
  const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`);
})

app.patch('/products/:id', async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);
  const { name, price, category } = req.body;
  foundProduct.name = name;
  await foundProduct.save()
  console.log(foundProduct);
  res.redirect(`/products/${foundProduct._id}`);
})

app.delete('/products/:id', async (req, res) => {
  const deletedData = await Product.findByIdAndDelete(req.params.id);
  console.log(deletedData);
  res.redirect('/products');
})


const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})