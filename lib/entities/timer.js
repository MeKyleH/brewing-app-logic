const shortid = require('shortid')
const utils = require('../../utils')

const timer = (duration, intervalDuration) => {

  if(typeof duration !== 'number'){
    throw new TypeError(utils.generateErrorMessage(
      'duration',
      'number',
      duration
      )
    )
  }

  if(typeof intervalDuration !== 'number'){
    throw new TypeError(utils.generateErrorMessage(
      'intervalDuration',
      'number',
      intervalDuration
      )
    )
  }

  return {
    id: shortid.generate(),
    duration,
    remainingDuration: duration,
    intervalDuration,
    isRunning: false
  }

}

module.exports = {
  timer
}