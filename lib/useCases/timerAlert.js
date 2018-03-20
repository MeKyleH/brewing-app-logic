const entities = require('../entities')

const createTimerAlert = _createTimerAlert => {

  return (timerId, activationTime, message) => {
    const timerAlert = entities.timerAlertEntity(timerId, activationTime, message)
    _createTimerAlert(timerAlert)
    return timerAlert
  }

}

const updateTimerAlert = getTimerAlertById => {
  return saveTimer => {
    return (timerAlertId, propUpdateObj) => {
      const timer = getTimerAlertById(timerAlertId)
      const updatedTimer = Object.assign({}, timer, propUpdateObj)
      saveTimer(timer)
      return updatedTimer
    }
  }
}

module.exports = {
  createTimerAlert,
  updateTimerAlert
}