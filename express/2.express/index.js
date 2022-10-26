const express = require('express');

const app = express();

// console.dir(app)

// 요청이라면 다 callback을 실행한다. 주소, method 상관 없이
// app.use((req, res) => {
//   console.log("We got a new request")
//   // res.send("Hello, we got your request! this is response")
//   // res.send('<h1>This is my webpage</h1>')
//   // res.send('test')
// })

// 요청 한번에 응답 하나(무조건)

// /cats => 'meow'
// /dogs => 'woof'
// '/' => 

app.get('/', (req, res) => {
  console.log('homepage')
  res.send('Come on!!')
})

app.get('/r/:subreddit', (req, res) => {
  // console.log(req.params)
  console.log(req.params);
  const { subreddit } = req.params;
  res.send(`<h1>Browsing the ${subreddit} subreddit`)
})

app.get('/r/:subreddit/:postId', (req, res) => {
  console.log(req.params);
  const { subreddit, postId } = req.params;
  res.send(`<h1>Browsing the ${subreddit} + ${postId} subreddit`)
})

app.post('/cats', (req, res) => {
  res.send('POST REQUEST TO /CATS!!!')
})

app.get('/cats', (req, res) => {

  console.log('cats responded')
  res.send('meow')
  // 응답하는 콘텐츠를 내보낼 때 사용 이 경우 HTML로 변환
})

app.get('/dogs', (req, res) => {
  console.log('dogs responded')
  res.send('woof')
})

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.send('Nothing found if nothing searched')
    return;
  }
  res.send(`<h1>Serach results for : ${q}</h1>`)
})


app.get('*', (req, res) => {
  res.send("I don't know that path")
})



const port = 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
