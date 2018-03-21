const entities = require('../entities')
const utils = require('../../utils')

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
        throw new TypeError(utils.constructErrorMessage("timerAlertId", "string", timerAlertId))
      }

      if(typeof propUpdateObj !== 'object'){
        throw new TypeError(utils.constructErrorMessage("propUpdateObj", "object", propUpdateObj))
      }else if(propUpdateObj instanceof Array){
        throw new TypeError(utils.constructErrorMessage("propUpdateObj", "object", propUpdateObj))
      }

      if(propUpdateObj.id || propUpdateObj.activated){
        throw new Error('Cannot edit properties id or activated directly!')
      }

      const timerAlert = getTimerAlertById(timerAlertId)

      const timerAlertKeys = Object.keys(timerAlert)
      const propUpdateObjKeys = Object.keys(propUpdateObj)
      const findPropUpdateKey = key => timerAlertKeys.find(tKey => tKey === key)

      if(!propUpdateObjKeys.every(findPropUpdateKey)){
        throw new Error('Updated properties must already exist of the timerAlert!')
      }

      propUpdateObjKeys.forEach(key => {
        if(typeof propUpdateObj[key] !== typeof timerAlert[key]){
          throw new TypeError(`propUpdateObj values must be of same type as matching key/values on timerAlert. Expected propUpdateObj[${key}] to be of type ${typeof timerAlert[key]} but got ${typeof propUpdateObj[key]}`)
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