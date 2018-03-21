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

      if(typeof timerAlertId !== 'string'){
        throw new TypeError()
      }

      if(typeof propUpdateObj !== 'object'){
        throw new TypeError()
      }else if(propUpdateObj instanceof Array){
        throw new TypeError()
      }

      if(propUpdateObj.id || propUpdateObj.activated){
        throw new Error
      }

      const timerAlert = getTimerAlertById(timerAlertId)

      const timerAlertKeys = Object.keys(timerAlert)
      const propUpdateObjKeys = Object.keys(propUpdateObj)
      const findPropUpdateKey = key => timerAlertKeys.find(tKey => tKey === key)

      if(!propUpdateObjKeys.every(findPropUpdateKey)){
        throw new Error
      }

      propUpdateObjKeys.forEach(key => {
        if(typeof propUpdateObj[key] !== typeof timerAlert[key]){
          throw new TypeError
        }
      })

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

const deleteTimerAlert = deleteFunc => {
  return timerAlertId => {
    deleteFunc(timerAlertId)
  }
}

module.exports = {
  createTimerAlert,
  updateTimerAlert,
  activateTimerAlert,
  deleteTimerAlert
}