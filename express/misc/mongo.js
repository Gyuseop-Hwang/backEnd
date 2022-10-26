const { Schema } = require('mongoose');


const { Types: { ObjectId } } = Schema;

const UserSchema = new Schema({
  test: {
    type: ObjectId,
    ref: 'User',
  }
})

const test = async (id) => {
  const instance = await Model.findById(id)
  const data = await Model.populate(instance, { path: 'test' })
}

const normal = async (id) => {
  const data = await Model.findById(id).populate('test') // 두번째 인자로 펼치길 원하는 property도 가능.
}