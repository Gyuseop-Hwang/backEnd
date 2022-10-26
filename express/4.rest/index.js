const express = require('express');
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
// request body를 URL 암호화 데이터로 분석할 미들웨어를 사용해야 함.(form url data)
app.use(express.json())
// request body가 json이면 parsing해줌.
app.use(methodOverride('_method'))

let comments = [
  {
    username: 'Todd',
    comment: 'lol that is so funny!',
    id: uuidv4(),
  },
  {
    username: 'Skyler',
    comment: 'I like to go birdwatching with my dog',
    id: uuidv4(),
  },
  {
    username: 'Sk8erBoi',
    comment: 'Plz delete your account, Todd',
    id: uuidv4(),
  },
  {
    username: 'onlysaywoof',
    comment: 'woof woof woof',
    id: uuidv4(),
  }
]

app.get('/comments', (req, res) => {
  res.render('comments/index', { comments })
})

app.get('/comments/new', (req, res) => {
  res.render('comments/new')
})

app.post('/comments', (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment, id: uuidv4() })
  res.redirect('/comments')
  // res.send('It worked')
})

app.get('/comments/:id', (req, res) => {
  const { id } = req.params;
  const comment = comments.find(x => x.id === id);
  res.render('comments/show', { comment })
})

app.get('/comments/:id/edit', (req, res) => {
  const { id } = req.params
  const foundComment = comments.find(x => x.id === id);
  res.render('comments/edit', { foundComment })
})

app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const newComment = req.body;
  const foundIndex = comments.findIndex(x => x.id === id);
  comments[foundIndex] = newComment;
  res.redirect('/comments')
})

app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  comments = comments.filter(x => x.id !== id);
  res.redirect('/comments')
})

app.get('/tacos', (req, res) => {
  res.send('GET /tacos response')
})

app.post('/tacos', (req, res) => {
  const { meat, qty } = (req.body)
  res.send(`OK. here are your ${qty} ${meat}`)
  // reqeust body -> 기본적으로 undefined, express.json(), express.urlencoded등과 함께 사용되어야 body가 읽어짐. 
  // res.send('POST /tacos response')
})

app.listen(3000, () => {
  console.log('On port 3000')
})