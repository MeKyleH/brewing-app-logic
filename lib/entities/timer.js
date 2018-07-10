const shortid = require('shortid')
const utils = require('../../utils')

const timer = (userId, name, duration, intervalDuration) => {

  if(typeof userId !== 'string'){
    throw new TypeError(utils.constructErrorMessage('userId', 'string', userId))
  }

  if(typeof name !== 'string'){
    throw new TypeError(utils.constructErrorMessage('name', 'string', name))
  }

  if(typeof duration !== 'number'){
    throw new TypeError(utils.constructErrorMessage(
      'duration',
      'number',
      duration
      )
    )
  }

  if(typeof intervalDuration !== 'number'){
    throw new TypeError(utils.constructErrorMessage(
      'intervalDuration',
      'number',
      intervalDuration
      )
    )
  }

  return {
    id: shortid.generate(),
    userId,
    name,
    duration,
    remainingDuration: duration,
    intervalDuration,
    isRunning: false
  }

}

module.exports = {
  timer
}