const decrementTimer = (timer, saveTimer) => {
  const remainingDurationInMs = 
    timer.remainingDurationInMs - timer.intervalDurationinMs
  const decrementedTimer = Object.assign({}, timer, {remainingDurationInMs})
  saveTimer(decrementedTimer)
  return decrementedTimer
}

const startTimer = getTimerById => {
  return saveTimer => 
    return timerId => {
      const timer = getTimerById(timerId)
      const startedTimer = Object.assign({}, timer, {isRunning: true})
      const timeoutId = setTimeout(
        () => decrementTimer(startedTimer, saveTimer),
        timer.intervalDurationinMs
      )
      const timerToSave = Object.assign({}, timerToSave, {timeoutId})
      saveTimer(timerToSave)
      return startedTimer
    }
  }
}