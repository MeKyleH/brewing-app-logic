const entities = require('../entities')

const createTimerAlert = _createTimerAlert => {

  return (timerId, activationTime, message) => {
    const timerAlert = entities.timerAlertEntity(timerId, activationTime, message)
    _createTimerAlert(timerAlert)
    return timerAlert
  }

}

console.log(entities)

module.exports = {
  createTimerAlert
}