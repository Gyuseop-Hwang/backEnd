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

const personSchema = new mongoose.Schema({
  first: String,
  last: String,
})

// this는 인스턴스 참조함.
personSchema.virtual('fullName').get(function () {
  return `${this.first} ${this.last}`
})

personSchema.pre('save', async function () {
  this.first = 'YO'
  this.last = 'MAMA'
  console.log('ABOUT TO SAVE')
})

personSchema.post('save', async function () {
  console.log('JUST SAVE')
})

const Person = new mongoose.model('Person', personSchema);