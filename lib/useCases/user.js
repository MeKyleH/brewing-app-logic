const entities = require('../entities')
const utils = require('../../utils')

const createUser = _createUser => {
  return (userName, hashedPassword) => {

    if(typeof _createUser !== 'function'){
      throw new TypeError(utils.constructErrorMessage('_createUser', 'function', _createUser))
    }

    const user = entities.userEntity(userName, hashedPassword)
    try {
      _createUser(user)
    } catch(e) {
      throw new Error("createUser failed!")
    }
    return user
  }
}

module.exports = {
  createUser
}