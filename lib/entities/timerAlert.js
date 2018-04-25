const shortid = require('shortid')
const utils = require('../../utils')

const timerAlert = (timerId, activationTime, message) => {

  if(typeof timerId !== "string"){
    throw new TypeError(utils.constructErrorMessage("timerId", "string", timerId))
  }

  if(typeof activationTime !== 'number'){
    throw new TypeError(utils.constructErrorMessage("activationTime", "number", activationTime))
  }

  if(typeof message !== 'string'){
    throw new TypeError(utils.constructErrorMessage("message", "string", message))
  }

  return {
    id: shortid.generate(),
    timerId,
    activationTime,
    message,
    activated: false
  }
}

module.exports = {
  timerAlert
}