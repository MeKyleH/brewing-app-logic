const entities = require('../entities')
const utils = require('../../utils')

const createInventory = _createInventory => {

  if(typeof createInventory !== 'function'){
    throw new TypeError
  }

  return (name, userId) => {

    if(typeof name !== 'string'){
      throw new TypeError
    }

    if(typeof userId !== 'string'){
      throw new TypeError
    }

    const inventory = entities.inventoryEntity(name, userId)
    try{
      _createInventory(inventory)
      return inventory
    } catch(e) {
      throw new Error("createInventory failed!")
    }
  }
}

const getInventory = findInventoryById => {

  if(typeof findInventoryById !== 'function'){
    throw new TypeError
  }

  return inventoryId => {

    if(typeof inventoryId !== 'string'){
      throw new TypeError
    }

    try{
      const inventory = findInventoryById(inventoryId)
      return inventory
    } catch(e) {
      throw new Error
    }
  }
}

const getInventoriesByUserId = userExists => {

  if(typeof userExists !== 'function'){
    throw new TypeError(utils.constructErrorMessage('userExists', 'function', userExists))
  }

  return findInventoriesByUserId => {

    if(typeof findInventoriesByUserId !== 'function'){
      throw new TypeError(utils.constructErrorMessage('findInventoriesByUserId', 'function', findInventoriesByUserId))
    }

    return userId => {

      if(typeof userId !== 'string'){
        throw new TypeError(utils.constructErrorMessage('userId', 'string', userId))
      }

      if(userExists(userId)){
        const inventories = findInventoriesByUserId(userId)

        if(!Array.isArray(inventories)){
          throw new TypeError(utils.constructErrorMessage('inventories', 'array', inventories))
        }

        return inventories
      }else{
        return []
      }
    }
  }
}

module.exports = {
  createInventory,
  getInventory,
  getInventoriesByUserId
}