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

const updateUser = findUserById => {

  if(typeof findUserById !== 'function'){
    throw new TypeError()
  }

  return saveUser => {

    if(typeof saveUser !== 'function'){
      throw new TypeError()
    }

    return (userId, updatePropsObj) => {

      if(typeof userId !== 'string'){
        throw new TypeError()
      }

      if(typeof updatePropsObj !== 'object'){
        throw new TypeError()
      } else if(updatePropsObj instanceof Array){
        throw new TypeError()
      }

      if(updatePropsObj.id){
        throw new Error
      }

      const user = findUserById(userId)

      const userProps = Object.keys(user)
      const updatePropsObjKeys = Object.keys(updatePropsObj)
      if(updatePropsObjKeys.some(key => !userProps.includes(key))){
        throw new Error
      }

      updatePropsObjKeys.forEach(key => {
        if(typeof updatePropsObj[key] !== typeof user[key]){
          throw new TypeError()
        }
      })

      const updatedUser = Object.assign({}, user, updatePropsObj)
      saveUser(updatedUser)
      return updatedUser
    }
  }
}

module.exports = {
  createUser,
  updateUser
}