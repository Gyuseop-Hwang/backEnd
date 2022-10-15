const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/shopApp')
  .then(success => {
    // console.log(success);
    console.log('database 연결 성공')
  })
  .catch(err => {
    console.log(err.name);
    console.log('database 연결 실패')
  })

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 20,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive'],
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  categories: [String],

  qty: {
    online: {
      type: Number,
      default: 0,
    },
    inStore: {
      type: Number,
      default: 0,
    }
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L']
  }
})

// mongoose Model의 instance 메소드() -> Schema.methods.원하는 메소드 형태로 instance 메소드 추가
// instance 메소드면 this가 instance 자신(일반 함수 기준)
productSchema.methods.greet = function () {
  console.log('Hello!! Hi!! Howdy!!')
  console.log(`- from ${this.name}`)
}

productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale;
  return this.save();
}

productSchema.methods.addCategory = function (newCategory) {
  this.categories.push(newCategory);
  return this.save()
}


// mongoose Model 정적 메소드
// static 메소드면 this가 Model 그 자체
productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true, price: 0 })
}


const Product = mongoose.model('Product', productSchema);


// Product 모델(class)의 인스턴스 메소드
const findProduct = async () => {
  const foundProduct = await Product.findOne({ name: 'Bike Helmet' })
  // foundProduct.onSale = !foundProduct.onSale;
  // foundProduct.save()
  console.log(foundProduct)
  await foundProduct.toggleOnSale();
  console.log(foundProduct);
  await foundProduct.addCategory('Outdoors');
  console.log(foundProduct);
}

// findProduct();

// Product 모델(class)의 정적 메소드
Product.fireSale().then(res => console.log(res))

const bike = new Product({ name: 'Cycling Judge', price: 28.50, categories: ['Cycling'], size: 'XS' })
// 전해주는 type이 casting이 되서 number는 '123'같은 것이 허용됨. 본질적으로 string이지만 type casting이 됨.
// 전해주는 string은 123도 허용됨. 본질적으로 number지만 type casting이 됨.

// bike.save()
//   .then(data => {
//     console.log('It worked');
//     console.log(data)
//   })
//   .catch(err => {
//     console.log('Oh no error');
//     console.log(err)
//   })


// mongoose 유효성 검사의 제약조건을 유지하도록 하려면, {runValidators : true} option을 줘야한다.
// Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: -19 }, { new: true, runValidators: true })
//   .then(data => {
//     console.log('Update 성공')
//     console.log(data)
//   })
//   .catch(err => {
//     console.log(err.message)
//   })