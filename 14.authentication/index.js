const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const path = require('path')
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb://localhost:27017/authDemo')
  .then(() => {
    console.log('mongo connected')
  })
  .catch(err => {
    console.log(err)
  })

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'notagoodsecreet', resave: false, saveUninitialized: false }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
}


app.get('/', (req, res) => {
  res.send('This is the hompage');
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // const hashedPW = await bcrypt.hash(password, 12);
  // const user = new User({ username, password: hashedPW });
  const user = new User({ username, password })
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login')
})

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user) throw new Error('username is not proper');
//   const result = await bcrypt.compare(password, user.password);
//   if (!result) throw new Error('password is not proper');
//   res.send('login succeeded');
// })

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // const user = await User.findOne({ username });
  // const validPassword = await bcrypt.compare(password, user.password);
  const foundUser = await User.findAndValidate(username, password)
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect('/secret')
  } else {
    res.redirect('/login')
  }
})

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  // req.session.destroy() -> session을 아예 파괴하는 것도 가능.
  // user에 대해 session에 정보가 많이 쌓였는데 제거해야할 때, 일일이 하느니 그냥 destory해버리면 됨.
  res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
  // if (!req.session.user_id) {
  //   return res.redirect('/login');
  // }
  // res.send('THIS IS SECRET! YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN')
  res.render('secret');
})

app.get('/topsecret', requireLogin, (req, res) => {
  res.send('TOP SECRET!!')
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})