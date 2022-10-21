const express = require('express');
const path = require('path')

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.set("etag", false);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // 서버에 access를 허용할 URL.(특정 출처) codepen.io도 가능.. 다수의 도메인은 ,로 구분
  res.setHeader('Access-Control-Allow-Methods', "OPTIONS, GET, POST, PUT, PATCH, DELETE") // 클라이언트가 서버로 사용할 수 있는 http method를 특정
  res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authorization") // 클라이언트가 요청에 설정할 수 있는 header를 특정
  next();
}) // *로 설정 가능하지만, 명시할수도 있음. 콘텐츠 타입 설정과 인증 설정은 필수.

app.use('/feed', feedRoutes);

app.listen(8080, () => {
  console.log('Listening on port 8080')
})