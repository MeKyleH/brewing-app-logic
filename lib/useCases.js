const entities = require('./entities')

const createTimer = _createTimer => {
  return (durationInMs, intervalDurationInMs) => {
    const timer = entities.timer(durationInMs, intervalDurationInMs)
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
      const remainingDurationInMs = 
        timer.remainingDurationInMs - timer.intervalDurationInMs
      let decrementedTimer = Object.assign(
        {},
        timer,
        {remainingDurationInMs}
      )
      if(decrementedTimer.remainingDurationInMs <= 0){
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
        {remainingDurationInMs: timer.durationInMs}
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