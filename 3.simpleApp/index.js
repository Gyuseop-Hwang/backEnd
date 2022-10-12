const express = require('express');
const path = require('path');
const redditData = require('./data.json');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));

// process.cwd() + path.sep + 'views'
// path.join(process.cwd(), 'views');
app.set('view engine', 'ejs');

// default path.join(process.cwd(), 'views')을 변경
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  // res.send('Hi')
  res.render('home')
  // .ejs 생략 가능 -> view engine이 'ejs'로 설정
  // res.render는 default가 path.join(process.cwd(), 'views')로 되어있음
})

app.get('/cats', (req, res) => {
  const cats = [
    'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
  ]

  res.render('cats', { cats })
})

app.get('/r/:subreddit', (req, res) => {
  const { subreddit } = req.params;
  const data = redditData[subreddit]
  if (data) {
    res.render('subreddit', { ...data })
  } else {
    res.render('notfound', { subreddit })
  }
})

app.get('/rand', (req, res) => {
  const num = Math.floor(Math.random() * 10) + 1;
  res.render('random', { rand: num });
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})