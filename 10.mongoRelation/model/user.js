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
  first: String,
  last: String,
  addresses: [
    {
      _id: { id: false },
      street: String,
      city: String,
      state: String,
      country: String,
    }
  ]
})

const User = mongoose.model('User', userSchema)

const makeUser = async () => {
  const u = new User({
    first: 'harry',
    last: 'porter'
  })

  u.addresses.push({
    street: '123 Sesame St.',
    city: 'New York',
    state: 'NY',
    country: 'USA'
  })

  const res = await u.save();
  console.log(res);

}

const addAddress = async (id) => {
  const user = await User.findById(id)
  user.addresses.push({
    street: '99 3rd St.',
    city: 'New York',
    state: 'NY',
    country: 'USA'
  })

  const res = await user.save();
  console.log(res)
}

// makeUser();
addAddress("634d6dac2aea6c7f8b2f79e4")