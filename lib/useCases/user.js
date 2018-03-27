const entities = require('../entities')
const utils = require('../../utils')

const createUser = isUserNameUnique => {

  if(typeof isUserNameUnique !== 'function'){
    throw new TypeError(utils.constructErrorMessage('isUserNameUnique', 'function', isUserNameUnique))
  }

  return _createUser => {
    return hashPassword => {
      return (userName, password) => {

        if(typeof _createUser !== 'function'){
          throw new TypeError(utils.constructErrorMessage('_createUser', 'function', _createUser))
        }

        if(typeof password !== 'string'){
          throw new TypeError(utils.constructErrorMessage('password', 'string', password))
        }

        if(!isUserNameUnique(userName)){
          throw new Error
        }

        const hashedPassword = hashPassword(password)
        const user = entities.userEntity(userName, hashedPassword)
        try {
          _createUser(user)
        } catch(e) {
          throw new Error("createUser failed!")
        }
        return user
      }
    }
  }
}

const updateUser = findUserById => {

  if(typeof findUserById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findUserById', 'function', findUserById))
  }

  return saveUser => {

    if(typeof saveUser !== 'function'){
      throw new TypeError(utils.constructErrorMessage('saveUser', 'function', saveUser))
    }

    return (userId, updatePropsObj) => {

      if(typeof userId !== 'string'){
        throw new TypeError(utils.constructErrorMessage('userId', 'string', userId))
      }

      if(typeof updatePropsObj !== 'object'){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
      } else if(updatePropsObj instanceof Array){
        throw new TypeError('updatePropsObject must be of type object! Got type array.')
      }

      if(updatePropsObj.id){
        throw new Error("Cannot directly edit user Id!")
      }

      const user = findUserById(userId)

      const userProps = Object.keys(user)
      const updatePropsObjKeys = Object.keys(updatePropsObj)
      if(updatePropsObjKeys.some(key => !userProps.includes(key))){
        throw new Error('Cannot update props that dont exist on on the user!')
      }

      updatePropsObjKeys.forEach(key => {
        if(typeof updatePropsObj[key] !== typeof user[key]){
          throw new TypeError(utils.constructErrorMessage(`items in the updatePropsObj must match type on the user. typeof updatePropsObject[${key}]: ${typeof updatePropsObj[key]} typeof user[${key}]: ${typeof user[key]}`))
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