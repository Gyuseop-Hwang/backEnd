const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Product } = require('./models/product');
const methodOverride = require('method-override');
const AppError = require('./AppError');

mongoose.connect('mongodb://localhost:27017/farmStand4')
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


function wrapAsync(func) {
  return function (req, res, next) {
    func(req, res).catch(err => next(err))
  }
}

app.get('/products', wrapAsync(async (req, res, next) => {

  const { category } = req.query
  const products = category ? await Product.find({ category }) : await Product.find();
  res.render('products/index', { category, products });


}))

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products/new', (req, res) => {
  // throw new AppError(401, "Not Allowed")
  res.render('products/new', { categories })
})

app.get('/products/:id', wrapAsync(async (req, res, next) => {
  // throw new AppError(404, "test"); // 이것도 안 된다... 그냥 async 함수 내에서는 안 되는 걸로..

  const { id } = req.params;
  // id 형태를 자릿수로 파악. 우선 id가 들어올 수 있는 형태의 자릿수이면 못 찾으면 error X
  // id 형식이 틀려버리면 (EX ID의 자릿수) mongoose error
  const foundProduct = await Product.findById(id); // mongoose는 못 찾는다고 error를 발생시키지는 않음. 그냥 foundProduct가 undefined가 됨.
  // console.log(foundProduct)
  // res.send('success')
  if (!foundProduct) {
    throw new AppError(404, 'Product Not Found') // next는 다음으로 pass만 해주지. 코드 전체를 중단하지는 않음.
  }// early return으로 처리한다.
  res.render('products/show', { foundProduct });


}))

app.post('/products', wrapAsync(async (req, res, next) => {
  // const data = await Product.create(req.body)
  // console.log(data)
  // res.send('Making your product')

  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`)


}))

// app.get('/products/new', (req, res) => {

//   res.render('products/new')
// })

app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError(404, 'Product Not Found')
  }
  res.render('products/edit', { product, categories })


}))

app.put('/products/:id', wrapAsync(async (req, res, next) => {

  const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`);


}))

// app.patch('/products/:id', async (req, res) => {
//   const foundProduct = await Product.findById(req.params.id);
//   const { name, price, category } = req.body;
//   foundProduct.name = name;
//   await foundProduct.save()
//   console.log(foundProduct);
//   res.redirect(`/products/${foundProduct._id}`);
// })

app.delete('/products/:id', wrapAsync(async (req, res, next) => {

  const deletedData = await Product.findByIdAndDelete(req.params.id);
  console.log(deletedData);
  res.redirect('/products');

}))

const handleValidationError = err => {
  console.log(err);
  return new AppError(400, `Validation failed...${err.message}`)
}

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === 'ValidationError') err = handleValidationError(err);
  next(err);
})

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send(message);
})

app.use((req, res, next) => {
  res.status(404).send('Not found');
})

// app.all(path, (req, res, next) => {
//   res.status(404).send('Not found'); => app.all 메소드는 경로 지정이 무조건 필요 
// })

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})