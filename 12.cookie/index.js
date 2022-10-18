const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

app.use(cookieParser('thisismysecret'))

app.get('/greet', (req, res) => {
  // console.log(req.cookies)
  const { name = 'anonymous' } = req.cookies;
  res.send(`HEY THERE, ${name}`)
})

app.get('/setname', (req, res) => {
  res.cookie('name', 'henrietta');
  res.cookie('animal', 'harliquin shirimp')
  res.send('Ok sent you a cookie')
})

app.get('/getsignedcookie', (req, res) => {
  res.cookie('fruit', 'grape', { signed: true })
  res.send('Ok sent you a signed cookie')
})

app.get('/verifyfruit', (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies)
  res.send(req.signedCookies);
})

app.listen(3000, () => {
  console.log('SERVING')
})