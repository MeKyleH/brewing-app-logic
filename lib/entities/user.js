const shortid = require('shortid')
const utils = require('../../utils')

const user = (userName, hashedPassword, email) => {
  
  if(userName === ''){
    throw new Error('userName cannot be empty!')
  }

  if(typeof userName !== 'string'){
    throw new TypeError(utils.constructErrorMessage('userName', 'string', userName))
  }

  if(hashedPassword === ''){
    throw new Error('hashedPassword cannot be empty!')
  }

  if(typeof hashedPassword !== 'string'){
    throw new TypeError(utils.constructErrorMessage('hashedPassword', 'string', hashedPassword))
  }

  if(email === ''){
    throw new Error('email cannot be empty!')
  }

  if(typeof email !== 'string'){
    throw new TypeError(utils.constructErrorMessage('email', 'string', email))
  }

  return {
    id: shortid.generate(),
    userName,
    hashedPassword,
    email
  }
}

module.exports = {
  user
}