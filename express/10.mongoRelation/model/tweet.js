const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo')
  .then(() => {
    console.log('mongo connected')
  })
  .catch(err => {
    console.log('mongo connection failed')
    console.log(err)
  })


const userSchema = new mongoose.Schema({
  username: String,
  age: Number,
})

const tweetSchema = new mongoose.Schema({
  text: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const User = mongoose.model('User', userSchema);

const Tweet = mongoose.model('Tweet', tweetSchema);

const makeTweets = async () => {
  // const user = new User({ username: 'Chickenfan99', age: 31 });
  const user = await User.findOne({ username: 'Chickenfan99' });
  const tweet2 = new Tweet({ text: 'bock bock bock my chicken makes noise', likes: 9 });
  tweet2.user = user;
  // user.save();
  tweet2.save();
}

// makeTweets();




const findTweet = async () => {
  const t = await Tweet.findOne({}).populate('user', 'username');
  console.log(t);
}

findTweet();
