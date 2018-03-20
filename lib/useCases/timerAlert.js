const entities = require('../entities')

const createTimerAlert = _createTimerAlert => {

  return (timerId, activationTime, message) => {
    const timerAlert = entities.timerAlertEntity(timerId, activationTime, message)
    _createTimerAlert(timerAlert)
    return timerAlert
  }

}

const updateTimerAlert = getTimerAlertById => {
  return saveTimerAlert => {
    return (timerAlertId, propUpdateObj) => {
      const timerAlert = getTimerAlertById(timerAlertId)
      const updatedTimerAlert = Object.assign({}, timerAlert, propUpdateObj)
      saveTimerAlert(updatedTimerAlert)
      return updatedTimerAlert
    }
  }
}

const activateTimerAlert = getTimerAlertById => {
  return saveTimerAlert => {
    return sendMessage => {
      return timerAlertId => {
        const timerAlert = getTimerAlertById(timerAlertId)
        const activatedTimerAlert = Object.assign({}, timerAlert, {activated: true})
        saveTimerAlert(activatedTimerAlert)
        sendMessage(activatedTimerAlert.message)
        return activatedTimerAlert
      }
    }
  }
}

module.exports = {
  createTimerAlert,
  updateTimerAlert,
  activateTimerAlert
}