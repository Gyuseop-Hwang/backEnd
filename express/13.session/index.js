const express = require('express');
const app = express();

const session = require('express-session')


app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }))

app.get('/pagecount', (req, res) => {
  // res.send('You have views this page x times')
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send(`you have viewed this page ${req.session.count} times`)
  // res.send('test')
})

app.get('/register', (req, res) => {
  const { username = 'anonymous' } = req.query;
  req.session.username = username;
  res.redirect('/greet');
})

app.get('/greet', (req, res) => {
  const { username } = req.session;
  res.send(`Welcome back, ${username}`)
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})