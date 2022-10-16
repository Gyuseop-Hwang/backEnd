// 미들웨어
// 요청 - 응답 생명주기 내에서 실행되는 함수
// express에 요청이 전달되고 코드가 처리를 완료하고 응답이 전달될 때까지 실행
// !!(요청과 응답 사이에 요청 객체, 응답 객체에도 접근 가능) => route handler에 가기 전에 decorate가 가능하다.

// morgan -> HTTP 요청을 터미널에 로그로 남겨준다.
const express = require('express');
const morgan = require('morgan')

const app = express();

app.use(morgan('tiny'))

// morgan과 비슷한 내가 만든 미들웨어

app.use((req, res, next) => {
  console.log(req.method, req.path);
  // req.method = 'GET'
  req.requestTime = Date.now();
  // console.log(req.requestTime)
  next();
})

// 미들웨어도 path 지정 가능하다.
app.use('/dogs', (req, res, next) => {
  console.log('I love dogs')
  next();
})

const verifyPassword = (req, res, next) => {
  const password = req.query.password;
  if (password === 'chickennugget') {
    return next();
  }
  res.send('Sorry you need a password')
}
// 라우트 핸들러에 callback을 여러 개 전달할 수 있다.(보통 middleware 함수 전달)


// app.use('/secret', (req, res, next) => {
//   const password = req.query.password;
//   if (password === 'chickennugget') {
//     return next();
//   }
//   res.send('Sorry you need a password')
// })

// app.use((req, res, next) => {
//   console.log('This is my first middleware');
//   return next();
//   console.log('This is my first middleware - after next()')
// })

// app.use((req, res, next) => {
//   console.log('This is my second middleware')
//   next();
// })

// app.use((req, res, next) => {
//   console.log('This is my third middleware')
//   next();
// })

app.get('/', (req, res) => {
  console.log(`REQUEST DATE : ${req.requestTime}`);
  res.send('homepage')
})

app.get('/dogs', (req, res) => {
  console.log(`REQUEST DATE : ${req.requestTime}`);
  res.send('woof')
})

app.get('/secret', verifyPassword, (req, res) => {
  res.send('Welcome');
})

app.use((req, res) => {
  res.status(404).send('Not Found')
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})