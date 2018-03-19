const shortid = require('shortid')
const utils = require('../utils')

const timer = (durationInMs, intervalDurationInMs) => {

  if(typeof durationInMs !== 'number'){
    throw new TypeError(utils.generateErrorMessage(
      'durationInMs',
      'number',
      durationInMs
      )
    )
  }

  if(typeof intervalDurationInMs !== 'number'){
    throw new TypeError(utils.generateErrorMessage(
      'intervalDurationInMs',
      'number',
      intervalDurationInMs
      )
    )
  }

  return {
    id: shortid.generate(),
    durationInMs,
    remainingDurationInMs: durationInMs,
    intervalDurationInMs,
    isRunning: false
  }

}