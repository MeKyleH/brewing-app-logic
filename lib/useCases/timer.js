const entities = require('../entities')
const utils = require('../../utils')

const createTimer = _createTimer => {
  return (userId, duration, intervalDuration) => {
    const timer = entities.timerEntities.timer(userId, duration, intervalDuration)
    _createTimer(timer)
    return timer
  }
}

const getTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findTimerById', 'function', findTimerById))
  }

  return id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    try{
      const timer = findTimerById(id)
      return timer
    } catch(e){
      throw new Error('findTimerById failed!')
    }
  }
}

const getTimersByUserId = userExists => {

  if(typeof userExists !== 'function'){
    throw new TypeError(utils.constructErrorMessage('userExists', 'function', userExists))
  }

  return findTimersByUserId => {

    if(typeof findTimersByUserId !== 'function'){
      throw new TypeError(utils.constructErrorMessage('findTimersByUserId', 'function', findTimersByUserId))
    }

    return userId => {

      if(typeof userId !== 'string'){
        throw new TypeError(utils.constructErrorMessage('userId', 'string', userId))
      }

      if(userExists(userId)){
        const timers = findTimersByUserId(userId)

        if(!Array.isArray(timers)){
          throw new TypeError(utils.constructErrorMessage('timers', 'array', timers))
        }

        return timers
      }else{
        return []
      }
    }
  }
}

const startTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findTimerById', 'function', findTimerById))
  }

  return saveTimer => {

    if(typeof saveTimer !== 'function'){
      throw new TypeError(utils.constructErrorMessage('saveTimer', 'function', saveTimer))
    }

    return id => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      const timer = findTimerById(id)
      const startedTimer = Object.assign({}, timer, {isRunning: true})
      saveTimer(startedTimer)
      return startedTimer
    }
  }
}


const stopTimer = findTimerById => {
  return saveTimer => {
    return id => {
      const timer = findTimerById(id)
      const stoppedTimer = Object.assign(
        {},
        timer,
        {isRunning: false}
      )
      return stoppedTimer
    }
  }
}

const decrementTimer = findTimerById => {
  return saveTimer => {
    return id => {
      const timer = findTimerById(id)
      const remainingDuration = 
        timer.remainingDuration - timer.intervalDuration
      let decrementedTimer = Object.assign(
        {},
        timer,
        {remainingDuration}
      )
      if(decrementedTimer.remainingDuration <= 0){
        decrementedTimer = Object.assign(
          {},
          decrementedTimer,
          {isRunning: false}
        )
      }
      saveTimer(decrementedTimer)
      return decrementedTimer
    }
  }
}

const resetTimer = findTimerById => {
  return saveTimer => {
    return id => {
      const timer = findTimerById(id)
      const _resetTimer = Object.assign(
        {},
        timer,
        {remainingDuration: timer.duration}
      )
      return _resetTimer
    }
  }
}

const updateTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError
  }

  return saveTimer => {

    if(typeof saveTimer !== 'function'){
      throw new TypeError
    }

    return (id, updatePropsObj) => {

      if(typeof id !== 'string'){
        throw new TypeError
      }

      if(typeof updatePropsObj !== 'object'){
        throw new TypeError
      }

      if(updatePropsObj instanceof Array){
        throw new TypeError
      }

      ["id", "remainingDuration", "isRunning", "userId"].forEach(key => {
        if(updatePropsObj[key]){
          throw new Error(`Cannot update property ${key}!`)
        }
      })

      const timer = findTimerById(id)
      
      const updatePropsObjKeys = Object.keys(updatePropsObj)
      if(updatePropsObjKeys.some(key => timer[key] === undefined)){
        throw new Error
      }

      if(updatePropsObjKeys.some(key => typeof updatePropsObj[key] !== typeof timer[key])){
        throw new TypeError('Value types on updatePropsObj must equal value types on timer!')
      }

      const updatedTimer = Object.assign({}, timer, updatePropsObj)
      
      try{
        saveTimer(updatedTimer)
        return updatedTimer
      } catch(e) {
        throw new Error("saveTimer failed!")
      }
    }
  } 
}

const deleteTimer = _deleteTimer => {

  if(typeof _deleteTimer !== 'function'){
    throw new TypeError
  }

  return id => {

    if(typeof id !== 'string'){
      throw new TypeError
    }

    try{
      _deleteTimer(id)
      return null
    } catch(e){
      throw new Error('_deleteTimer failed!')
    }
  }
}

module.exports = {
  createTimer,
  getTimer,
  getTimersByUserId,
  startTimer,
  stopTimer,
  decrementTimer,
  resetTimer,
  updateTimer,
  deleteTimer
}