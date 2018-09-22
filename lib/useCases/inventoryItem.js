const entities = require('../entities')
const utils = require('../../utils')

const createInventoryItem = _createInventoryItem => {

  if(typeof _createInventoryItem !== 'function'){
    throw new TypeError(utils.constructErrorMessage('_createInventoryItem', "function", _createInventoryItem))
  }

  return addToInventory => {

    if(typeof addToInventory !== 'function'){
      throw new TypeError(utils.constructErrorMessage('addToInventory', "function", addToInventory))
    }

    return async (inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt) => {
      const inventoryItem = entities.inventoryItemEntity(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)
      
      try{
        await addToInventory(inventoryItem)
      } catch(e) {
        throw new Error("addToInventory failed!")
      }

      try{
        await _createInventoryItem(inventoryItem)
        return inventoryItem
      } catch(e) {
        throw new Error('createInventoryItem failed!')
      }
    }
  }
}

const getInventoryItem = findInventoryItemById => {

  if(typeof findInventoryItemById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findInventoryItemById', "function", findInventoryItemById))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    const inventoryItem = await findInventoryItemById(id)
    return inventoryItem
  }
}

const getInventoryItemsByInventoryId = findInventoryItemsByInventoryId => {

  if(typeof findInventoryItemsByInventoryId !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findInventoryItemsByInventoryId', 'function', findInventoryItemsByInventoryId))
  }

  return async inventoryId => {

    if(typeof inventoryId !== "string"){
      throw new TypeError(utils.constructErrorMessage('inventoryId', 'string', inventoryId))
    }

    const foundInventoryItems = await findInventoryItemsByInventoryId(inventoryId)

    if(!(foundInventoryItems instanceof Array)){
      throw new Error("foundInventoryItems must be an array!")
    }

    return foundInventoryItems
  }
}

const updateInventoryItem = findInventoryItemById => {

  if(typeof findInventoryItemById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findInventoryItemById', 'function', findInventoryItemById))
  }

  return saveInventoryItem => {

    if(typeof saveInventoryItem !== 'function'){
      throw new TypeError(utils.constructErrorMessage('saveInventoryItem', 'function', saveInventoryItem))
    }

    return async (id, updatePropsObj) => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      if(typeof updatePropsObj !== 'object'){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
      }

      if(updatePropsObj instanceof Array){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
      }

      if(updatePropsObj.id){
        throw new Error("Cannot modify id!")
      }

      if(updatePropsObj.object instanceof Array){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj.object', 'object', updatePropsObj.object))
      }

      if(updatePropsObj.object === null){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
      }

      const inventoryItem = await findInventoryItemById(id)
      
      console.log(inventoryItem)

      const updatePropsObjKeys = Object.keys(updatePropsObj)
      const inventoryItemKeys = Object.keys(inventoryItem)

      if(updatePropsObjKeys.some(key => !inventoryItemKeys.includes(key))){
        throw new Error("Cant update non existing keys! updatePropsObjKeys: " + updatePropsObjKeys + "inventoryItemKeys: " + inventoryItemKeys)
      }

      updatePropsObjKeys.forEach(key => {
        
        if(typeof updatePropsObj[key] !== typeof inventoryItem[key]){
          throw new TypeError(utils.constructErrorMessage(key, typeof inventoryItem[key], typeof updatePropsObj[key]))
        }

        if(inventoryItem[key] instanceof Date){
          if(!(updatePropsObj[key] instanceof Date) && updatePropsObj[key] !== null){
            throw new TypeError(utils.constructErrorMessage(key, typeof inventoryItem[key], typeof updatePropsObj[key]))
          }
        }

      })

      const updatedInventoryItem = Object.assign({}, inventoryItem, updatePropsObj)
      try{
        await saveInventoryItem(updatedInventoryItem)
      } catch(e) {
        throw new Error("saveInventoryItem failed!")
      }
      return updatedInventoryItem
    }
  }  
}

const deleteInventoryItem = _deleteInventoryItem => {

  if(typeof _deleteInventoryItem !== 'function'){
    throw new TypeError(utils.constructErrorMessage('_deleteInventoryItem', 'function', _deleteInventoryItem))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    try{
      await _deleteInventoryItem(id)
      return null
    } catch(e) {
      throw new Error("deleteInventoryItem failed!")
    }
  }
}

module.exports = {
  createInventoryItem,
  getInventoryItem,
  getInventoryItemsByInventoryId,
  updateInventoryItem,
  deleteInventoryItem
}
