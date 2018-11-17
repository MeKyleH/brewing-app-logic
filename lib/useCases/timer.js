const entities = require('../entities')
const utils = require('../../utils')

const createTimer = _createTimer => {

  if(typeof _createTimer !== "function"){
    throw new TypeError(utils.constructErrorMessage("_createTimer", "function", _createTimer))
  }

  return async (userId, name, duration, intervalDuration) => {

    if(typeof userId !== 'string'){
      throw new TypeError(utils.constructErrorMessage("userId", "string", userId))
    }

    if(typeof duration !== 'number'){
      throw new TypeError(utils.constructErrorMessage('duration', 'number', duration))
    }

    if(typeof intervalDuration !== 'number'){
      throw new TypeError(utils.constructErrorMessage('intervalDuration', 'number', intervalDuration))
    }

    const timer = entities.timerEntities.timer(userId,name, duration, intervalDuration)
    try{
      await _createTimer(timer)
      return timer
    } catch(e) {
      throw new Error("_createTimer failed!")
    }
  }
}

const getTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findTimerById', 'function', findTimerById))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    try{
      const timer = await findTimerById(id)
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

    return async userId => {

      if(typeof userId !== 'string'){
        throw new TypeError(utils.constructErrorMessage('userId', 'string', userId))
      }

      if(userExists(userId)){
        const timers = await findTimersByUserId(userId)

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

    return async id => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      const timer = await findTimerById(id)
      const startedTimer = Object.assign({}, timer, {isRunning: true})
      try {
        await saveTimer(startedTimer)
        return startedTimer
      } catch(e) {
        throw new Error("saveTimer failed!")
      }
    }
  }
}


const stopTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findTimerById', 'function', findTimerById))
  }

  return saveTimer => {

    if(typeof saveTimer !== 'function'){
      throw new TypeError(utils.constructErrorMessage('saveTimer', 'function', saveTimer))
    }

    return async id => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      const timer = await findTimerById(id)
      const stoppedTimer = Object.assign(
        {},
        timer,
        {isRunning: false}
      )
      try{
        await saveTimer(stoppedTimer)
        return stoppedTimer
      } catch(e) {
        throw new Error("saveTimer failed!")
      }
    }
  }
}

const decrementTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage("findTimerById", "function", findTimerById))
  }

  return saveTimer => {

    if(typeof saveTimer !== 'function'){
      throw new TypeError(utils.constructErrorMessage("saveTimer", "function", saveTimer))
    }

    return async id => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      const timer = await findTimerById(id)
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
          {isRunning: false, remainingDuration: 0}
        )
      }
      try{
        await saveTimer(decrementedTimer)
        return decrementedTimer
      } catch(e) {
        throw new Error("saveTimer failed!")
      }
    }
  }
}

const resetTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage("findTimerById", 'function', findTimerById))
  }

  return saveTimer => {

    if(typeof saveTimer !== 'function'){
      throw new TypeError(utils.constructErrorMessage("saveTimer", "function", saveTimer))
    }

    return async id => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      const timer = await findTimerById(id)
      const _resetTimer = Object.assign(
        {},
        timer,
        {remainingDuration: timer.duration}
      )
      try{
        await saveTimer(_resetTimer)
        return _resetTimer
      } catch(e) {
        throw new Error("saveTimer failed!")
      }
    }
  }
}

const updateTimer = findTimerById => {

  if(typeof findTimerById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findTimerById', "function", findTimerById))
  }

  return saveTimer => {

    if(typeof saveTimer !== 'function'){
      throw new TypeError(utils.constructErrorMessage("saveTimer", "function", saveTimer))
    }

    return async (id, updatePropsObj) => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage("id", "string", id))
      }

      if(typeof updatePropsObj !== 'object'){
        throw new TypeError(utils.constructErrorMessage("updatePropsObj", "object", updatePropsObj))
      }

      if(updatePropsObj instanceof Array){
        throw new TypeError(utils.constructErrorMessage("updatePropsObj", "object", updatePropsObj))
      }

      ["id", "remainingDuration", "isRunning", "userId"].forEach(key => {
        if(updatePropsObj[key]){
          throw new Error(`Cannot update property ${key}!`)
        }
      })

      const timer = await findTimerById(id)
      
      const updatePropsObjKeys = Object.keys(updatePropsObj)
      if(updatePropsObjKeys.some(key => timer[key] === undefined)){
        throw new Error
      }

      if(updatePropsObjKeys.some(key => typeof updatePropsObj[key] !== typeof timer[key])){
        throw new TypeError(utils.constructErrorMessage(key, typeof timer[key], typeof updatePropsObj[key]))
      }

      const updatedTimer = Object.assign({}, timer, updatePropsObj)
      if(updatedTimer.duration < updatedTimer.remainingDuration){
        updatedTimer.remainingDuration = updatedTimer.duration
      }
      
      try{
        await saveTimer(updatedTimer)
        return updatedTimer
      } catch(e) {
        throw new Error("saveTimer failed!")
      }
    }
  } 
}

const deleteTimer = _deleteTimer => {

  if(typeof _deleteTimer !== 'function'){
    throw new TypeError(utils.constructErrorMessage('_deleteTimer', "function", _deleteTimer))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage("id", "string", id))
    }

    try{
      await _deleteTimer(id)
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