const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/movieApp')
  .then(() => {
    console.log('Connection opened');
  })
  .catch(err => {
    console.log('Error');
  })


// {
//   title : 'Amadeus',
//   year : 1986,
//   score : 9.2,
//   rating : 'R'
// }

// 1) Schema(TS interface 생각하면 이해가 쉽다)
// Schema class 이름 movieSchema
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});

// 2) Model(type이 movieSchema임)
// 모델 class 이름 Movie
const Movie = mongoose.model('Movie', movieSchema);
// 모델 이름 : Movie => mongoose가 모델 이름을 복수화시켜 'movies' collection을 만듬.
// => 즉 모델 class가 collections 그 자체이다. static method로 insertMany, find, updateOne 등을 가짐.

// const amadeus = new Movie({ title: 'Amadeus', year: 1986, score: 9.2, rating: 'R' })
// instance 이름 : amadeus => Movie instance 생성(모델의 메소드 사용 가능)
// => model class를 instance화시키면 javascript 객체가 됨.(Model class의 instance인)

// Movie.insertMany([
//   { title: 'Amelie', year: 2001, score: 8.3, rating: 'R' },
//   { title: 'Alien', year: 1979, score: 8.1, rating: 'R' },
//   { title: 'The Iron Giant', year: 1999, score: 7.5, rating: 'PG' },
//   { title: 'Stand By Me', year: 1986, score: 8.6, rating: 'R' },
//   { title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13' }
// ])
//   .then(data => {
//     console.log('It worked');
//     console.log(data)
//   })


// findOneAndUpdate, findByIdAndUpdate => msg 대신 변경된 data 하나를 보여줌({new : true} option 추가해야 변경사항 적용된 data)

// findOneAndDelete, findByIdAndDelete => msg 대신 삭제된 data를 보여줌

// deleteOne, deleteMany, updateOne, updateMany 등은 update, delete 성공 여부, 몇 개가 적용됬는지 등의 msg로만 보여줌
// pure update, delete 메소드는 msg임.