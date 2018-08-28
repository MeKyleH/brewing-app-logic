const entities = require('../entities')
const utils = require('../../utils')

const createTimerAlert = _createTimerAlert => {

  if(typeof _createTimerAlert !== 'function'){
    throw new TypeError(utils.constructErrorMessage('_createTimerAlert', 'function', _createTimerAlert))
  }

  return async (timerId, activationTime, message) => {

    const timerAlert = entities.timerAlertEntity(timerId, activationTime, message)
    
    try {
      await _createTimerAlert(timerAlert)
    } catch(e) {
      throw new Error('createTimerAlert failed!')
    }

    return timerAlert
  }

}

const getTimerAlert = findTimerAlertById => {

  if(typeof findTimerAlertById !== 'function'){
    throw new TypeError
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError
    }

    const timerAlert = await findTimerAlertById(id)
    return timerAlert
  }
}

const getTimerAlertsByTimerId = findTimerAlertsByTimerId => {

  if(typeof findTimerAlertsByTimerId !== 'function'){
    throw new TypeError(utils.constructErrorMessage("findTimerAlertsByTimerId", "function", findTimerAlertsByTimerId))
  }

  return async timerId => {

    if(typeof timerId !== 'string'){
      throw new TypeError(utils.constructErrorMessage("timerId", "string", timerId))
    }

    const timerAlerts = await findTimerAlertsByTimerId(timerId)

    if(!Array.isArray(timerAlerts)){
      throw new TypeError
    }

    return timerAlerts
  }
}

const updateTimerAlert = findTimerAlertById => {

  if(typeof findTimerAlertById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findTimerAlertById', "function", findTimerAlertById))
  }

  return saveTimerAlert => {

    if(typeof saveTimerAlert !== 'function'){
      throw new TypeError(utils.constructErrorMessage('saveTimerAlert', 'function', saveTimerAlert))
    }

    return async (id, updatePropsObject) => {

      if(typeof saveTimerAlert !== 'function'){
        throw new TypeError('saveTimerAlert', 'function', saveTimerAlert)
      }

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage("id", "string", id))
      }

      if(typeof updatePropsObject !== 'object'){
        throw new TypeError(utils.constructErrorMessage("updatePropsObject", "object", updatePropsObject))
      }else if(updatePropsObject instanceof Array){
        throw new TypeError(utils.constructErrorMessage("updatePropsObject", "object", updatePropsObject))
      }

      if(updatePropsObject.id || updatePropsObject.activated){
        throw new Error('Cannot edit properties id or activated directly!')
      }

      const timerAlert = await findTimerAlertById(id)

      const timerAlertKeys = Object.keys(timerAlert)
      const updatePropsObjectKeys = Object.keys(updatePropsObject)
      const findPropUpdateKey = key => timerAlertKeys.find(tKey => tKey === key)

      if(!updatePropsObjectKeys.every(findPropUpdateKey)){
        throw new Error('Updated properties must already exist on the timerAlert!')
      }

      updatePropsObjectKeys.forEach(key => {
        if(typeof updatePropsObject[key] !== typeof timerAlert[key]){
          throw new TypeError(`updatePropsObject values must be of same type as matching key/values on timerAlert. Expected updatePropsObject[${key}] to be of type ${typeof timerAlert[key]} but got ${typeof updatePropsObject[key]}`)
        }
      })

      const updatedTimerAlert = Object.assign({}, timerAlert, updatePropsObject)
     
      try {
        await saveTimerAlert(updatedTimerAlert)
      } catch(e) {
        throw new Error("saveTimerAlert failed!")
      }
     
      return updatedTimerAlert
    }
  }
}

const activateTimerAlert = findTimerAlertById => {

  if(typeof findTimerAlertById !== 'function'){
    throw new TypeError(utils.constructErrorMessage("findTimerAlertById", "function", findTimerAlertById))
  }

  return saveTimerAlert => {

    if(typeof saveTimerAlert !== "function"){
      throw new TypeError(utils.constructErrorMessage("saveTimerAlert", "function", saveTimerAlert))
    }

    return sendMessage => {

      if(typeof sendMessage !== 'function'){
        throw new TypeError(utils.constructErrorMessage("sendMessage", "function", sendMessage))
      }

      return async id => {

        if(typeof id !== 'string'){
          throw new TypeError(utils.constructErrorMessage('id', 'string', id))
        }

        const timerAlert = await findTimerAlertById(id)
        const activatedTimerAlert = Object.assign({}, timerAlert, {activated: true})
        
        try {
          await saveTimerAlert(activatedTimerAlert)
        } catch(e) {
          throw new Error("saveTimerAlert failed!")
        }

        try{
          sendMessage(activatedTimerAlert.message)
        } catch(e){
          throw new Error("sendMessage failed!")
        }

        return activatedTimerAlert
      }
    }
  }
}

const deactivateTimerAlert = findTimerAlertById => {

  if(typeof findTimerAlertById !== 'function'){
    throw new TypeError(utls.constructErrorMessage("findTimerAlertById", "function", findTimerAlertById))
  }

  return saveTimerAlert => {

    if(typeof saveTimerAlert !== 'function'){
      throw new TypeError(utls.constructErrorMessage("saveTimerAlert", "function", saveTimerAlert))
    }

    return async id => {

      if(typeof id !== "string"){
        throw new TypeError(utils.constructErrorMessage("id", "string", id))
      }

      const timerAlert = await findTimerAlertById(id)
      const deactivatedTimerAlert = Object.assign({}, timerAlert, {activated: false})

      try{
        await saveTimerAlert(deactivatedTimerAlert)
      } catch(e) {
        throw new Error(e)
      }

      return deactivatedTimerAlert

    }

  }
}

const deleteTimerAlert = _deleteTimerAlert => {

  if(typeof _deleteTimerAlert !== 'function'){
    throw new TypeError(utils.constructErrorMessage("_deleteTimerAlert", "function", _deleteTimerAlert))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    try{
      await _deleteTimerAlert(id)
      return { id }
    } catch(e){
      throw new Error("_deleteTimerAlert failed!")
    }  
  }
}

module.exports = {
  createTimerAlert,
  getTimerAlert,
  getTimerAlertsByTimerId,
  updateTimerAlert,
  activateTimerAlert,
  deactivateTimerAlert,
  deleteTimerAlert
}