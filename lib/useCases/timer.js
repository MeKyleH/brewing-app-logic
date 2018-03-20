const entities = require('../entities')

const createTimer = _createTimer => {
  return (duration, intervalDuration) => {
    const timer = entities.timerEntities.timer(duration, intervalDuration)
    _createTimer(timer)
    return timer
  }
}

const startTimer = getTimerById => {
  return saveTimer => {
    return timerId => {
      const timer = getTimerById(timerId)
      const startedTimer = Object.assign({}, timer, {isRunning: true})
      return startedTimer
    }
  }
}


const stopTimer = getTimerById => {
  return saveTimer => {
    return timerId => {
      const timer = getTimerById(timerId)
      const stoppedTimer = Object.assign(
        {},
        timer,
        {isRunning: false}
      )
      return stoppedTimer
    }
  }
}

const decrementTimer = getTimerById => {
  return saveTimer => {
    return timerId => {
      const timer = getTimerById(timerId)
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

const resetTimer = getTimerById => {
  return saveTimer => {
    return timerId => {
      const timer = getTimerById(timerId)
      const _resetTimer = Object.assign(
        {},
        timer,
        {remainingDuration: timer.duration}
      )
      return _resetTimer
    }
  }
}

module.exports = {
  createTimer,
  startTimer,
  stopTimer,
  decrementTimer,
  resetTimer
}