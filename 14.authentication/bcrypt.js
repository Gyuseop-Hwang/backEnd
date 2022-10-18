const bcrypt = require('bcrypt');

// bcrypt는 promise를 지원한다


const hashPassword = async (pw) => {
  // const salt = await bcrypt.genSalt(12)
  // const hash = await bcrypt.hash(pw, salt)
  // console.log(salt);
  const hash = await bcrypt.hash(pw, 12);
  console.log(hash);
}

const login = async (inputPW, hashedPW) => {
  const result = await bcrypt.compare(inputPW, hashedPW)
  if (result) {
    console.log('Logged you in! successful match')
  } else {
    console.log('Incorrect')
  }
}



// genSalt salt 생성. 매개변수 -> saltRound(해시 난이도, 해시 난이도가 올라가면 해시를 계산하는데 걸리는 시간이 증가함.)
// hashPassword('monkey');
login('monkey', "$2b$12$KcOWuIoHwbOPkBzqPoTrmujveDfKwwnGRQ/1n.riP6zH28KXZ55qC")