const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Product } = require('./models/product');
const methodOverride = require('method-override');
const AppError = require('./AppError');

mongoose.connect('mongodb://localhost:27017/farmStand2')
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

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(err => next(err))
  }
}

app.get('/products', wrapAsync(async (req, res, next) => {

  const { category } = req.query
  const products = category ? await Product.find({ category }) : await Product.find();
  res.render('products/index', { category, products });

  // next(err);


}))

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products/new', (req, res) => {
  // throw new AppError('Not Allowed', 401)
  // 비동기가 아니여서 express가 그냥 error를 잡을 수 있다. next(err) 필요없음.
  res.render('products/new', { categories })
})

app.get('/products/:id', wrapAsync(async (req, res, next) => {

  const { id } = req.params;
  const foundProduct = await Product.findById(id);
  // console.log(foundProduct)
  // res.send('success')
  // if (!foundProduct) {
  //   return next(new AppError('Product Not Found', 404)) // 라우트 핸들러와 미들웨어에 의해 발동된 에러의 경우 다음 함수로 next해서 전달해줘야 함
  // }
  if (!foundProduct) { // try, catch로 해결할 때는 그냥 error를 throw
    throw new AppError('Product Not Found', 404) // 라우트 핸들러와 미들웨어에 의해 발동된 에러의 경우 다음 함수로 next해서 전달해줘야 함
  }
  // return해줘야 함. next() 안에 뭘 전달해주면 오류 처리 핸들러로, next()는 그냥 다음 미들웨어 아무거나(route handler 포함)
  // 대신 next는 코드 실행 정지를 의미하지는 않음. 함수 내 next의 다음 코드줄들이 next해서 다음 미들웨어에서 코드가 실행된 후에
  // 뒤이어 실행된다.
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

app.get('/products/new', (req, res) => {
  res.render('products/new')
})

app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product Not Found', 404))
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

app.delete('/products/:id', wrapAsync(async (req, res) => {
  const deletedData = await Product.findByIdAndDelete(req.params.id);
  console.log(deletedData);
  res.redirect('/products');
}))

const handleValidationError = err => {
  console.dir(err);
  return new AppError(`Validation Failed...${err.message}`, 400)
}

app.use((err, req, res, next) => {
  // console.log(err.name)
  if (err.name === 'ValidationError') err = handleValidationError(err);
  next(err)
})


app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).send(message);
  // 보통은 페이지 만들어서 res.status(status).redirect('/...')한다.
})

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})