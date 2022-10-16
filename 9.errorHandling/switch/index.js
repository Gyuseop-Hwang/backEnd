// 미들웨어
// 요청 - 응답 생명주기 내에서 실행되는 함수
// express에 요청이 전달되고 코드가 처리를 완료하고 응답이 전달될 때까지 실행
// !!(요청과 응답 사이에 요청 객체, 응답 객체에도 접근 가능) => route handler에 가기 전에 decorate가 가능하다.

// morgan -> HTTP 요청을 터미널에 로그로 남겨준다.
const express = require('express');
const morgan = require('morgan')
const AppError = require('./AppError')

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
  throw new AppError('Password Required', 401)
  // res.send('Sorry you need a password')
  // res.status(401)
  // throw new Error('Password required') // error가 던져지면 express default error handler가 처리한다.
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

app.get('/error', (req, res) => {
  chicken.fly(); // syntax error도 express 내장 default 오류 핸들러가 처리한다.
})

app.get('/dogs', (req, res) => {
  console.log(`REQUEST DATE : ${req.requestTime}`);
  res.send('woof')
})

app.get('/secret', verifyPassword, (req, res) => {
  res.send('Welcome');
})

app.get('/admin', (req, res) => {
  throw new AppError('Your not an admin', 403);
})

app.use((req, res) => {
  res.status(404).send('Not Found')
})

// 사용자 오류 핸들러 => 이제 syntax 오류, router handler 오류, mongoose 에러 등 모든 에러 오류 처리 미들웨어가 처리한다.
// app.use((err, req, res, next) => {
//   console.log("***********************")
//   console.log("*********error*********")
//   console.log("***********************")
//   console.log(err)
//   next(err)
//   // res.status(err)
//   // res.status(401).send(err);
//   // res.status(500).send('Oh boy, we got an error') // 응답하면 next 실행 안 함.
//   // next(err); // express default 오류 핸들러가 req, res 생명주기의 함수스택 끝에 있기때문에 default 오류 핸들러가 오류 처리함.
// })

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong', stack } = err;
  res.status(status).send(stack)
})

// next에 err를 전달해주면, 현재 요청을 오류로 간주하고, 남아있는 오류 처리 이외의 라우팅과 미들웨어 함수를 건너뛴다.

app.listen(3000, () => {
  console.log('listening on port 3000')
})