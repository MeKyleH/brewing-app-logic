const entities = require('../entities')
const utils = require('../../utils')

const createUser = isUserNameUnique => {

  if(typeof isUserNameUnique !== 'function'){
    throw new TypeError(utils.constructErrorMessage('isUserNameUnique', 'function', isUserNameUnique))
  }

  return isEmailUnique => {

    if(typeof isEmailUnique !== 'function'){
      throw new TypeError(utils.constructErrorMessage("isEmailUnique", "function", isEmailUnique))
    }

    return _createUser => {

      if(typeof _createUser !== 'function'){
        throw new TypeError(utils.constructErrorMessage('_createUser', 'function', _createUser))
      }

      return hashPassword => {

        if(typeof hashPassword !== 'function'){
          throw new TypeError(utils.constructErrorMessage('hashPassword', "function", hashPassword))
        }

        return async (userName, password, email) => {

          if(typeof password !== 'string'){
            throw new TypeError(utils.constructErrorMessage('password', 'string', password))
          }

          const bool = await isUserNameUnique(userName)
          if(!bool){
            throw new Error("userName must be unique!")
          }

          const emailBool = await isEmailUnique(email)
          if(!bool){
            throw new Error("email must be unique!")
          }

          const hashedPassword = hashPassword(password)
          const user = entities.userEntity(userName, hashedPassword, email)
          try {
            await _createUser(user)
          } catch(e) {
            throw new Error("createUser failed!")
          }
          return user
        }
      }
    }
  }
}

const getUser = findUserById => {

  if(typeof findUserById !== 'function'){
    throw new TypeError(utils.constructErrorMessage("findUserById", "function", findUserById))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage("id", "string", id))
    }

    try{
      const user = await findUserById(id)
      return user
    } catch(e) {
      throw new Error
    }
  }
}

const updateUser = findUserById => {

  if(typeof findUserById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findUserById', 'function', findUserById))
  }

  return isUserNameUnique => {

    if(typeof isUserNameUnique !== "function"){
      throw new TypeError(utils.constructErrorMessage("isUserNameUnique", "function", isUserNameUnique))
    }

    return isEmailUnique => {

      if(typeof isEmailUnique !== "function"){
        throw new TypeError(utils.constructErrorMessage("isEmailUnique", "function", isEmailUnique))
      }

      return saveUser => {

        if(typeof saveUser !== 'function'){
          throw new TypeError(utils.constructErrorMessage('saveUser', 'function', saveUser))
        }

        return async (id, updatePropsObj) => {

          if(typeof id !== 'string'){
            throw new TypeError(utils.constructErrorMessage('id', 'string', id))
          }

          if(typeof updatePropsObj !== 'object'){
            throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
          } else if(updatePropsObj instanceof Array){
            throw new TypeError('updatePropsObject must be of type object! Got type array.')
          }

          if(updatePropsObj.id){
            throw new Error("Cannot directly edit user Id!")
          }

          const user = await findUserById(id)

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

          const bool = await isUserNameUnique(updatedUser.userName)

          if(!bool){
            throw new Error("username must be unique!")
          }

          const emailBool = await isEmailUnique(updatedUser.email)

          if(!emailBool){
            throw new Error("email must be unique!")
          }

          try{
            await saveUser(updatedUser)
            return updatedUser
          } catch(e) {
            throw new Error("saveUser failed!")
          }
        }
      }
    }
  }
}

const authenticateUser = findUserByUsername => {

  if(typeof findUserByUsername !== 'function'){
    throw new TypeError(utils.constructErrorMessage("findUserByUsername", "function", findUserByUsername))
  }

  return compareHash => {

    if(typeof compareHash !== 'function'){
      throw new TypeError(utils.constructErrorMessage("compareHash", "function", compareHash))
    }

    return async (userName, password) => {

      if(typeof userName !== 'string'){
        throw new TypeError(utils.constructErrorMessage("userName", "string", userName))
      }

      if(typeof password !== 'string'){
        throw new TypeError(utils.constructErrorMessage("password", "string", password))
      }

      const user = await findUserByUsername(userName)
      const passwordMatches = compareHash(password)
      if(passwordMatches){
        return user
      }else{
        throw new Error("Could not find the user with given userName!")
      }
    }
  }
}

const deleteUser = _deleteUser => {

  if(typeof _deleteUser !== "function"){
    throw new TypeError(utils.constructErrorMessage("_deleteUser", "function", _deleteUser))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage("id", "string", id))
    }

    try{
      await _deleteUser(id)
      return null
    } catch(e) {
      throw new Error("deleteUser failed!")
    }
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  authenticateUser,
  deleteUser
}