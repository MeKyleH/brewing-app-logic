const entities = require('../entities')
const utils = require('../../utils')

const createInventory = _createInventory => {

  if(typeof createInventory !== 'function'){
    throw new TypeError(utils.constructErrorMessage('createInventory', 'function', createInventory))
  }

  return (name, userId) => {

    if(typeof name !== 'string'){
      throw new TypeError(utils.constructErrorMessage('name', 'string', name))
    }

    if(typeof userId !== 'string'){
      throw new TypeError(utils.constructErrorMessage('userId', "string", userId))
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
    throw new TypeError(utils.constructErrorMessage('findInventoryById', 'function', findInventoryById))
  }

  return async id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    try{
      const inventory = await findInventoryById(id)
      return inventory
    } catch(e) {
      throw new Error('findInventoryById failed!')
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

    return async userId => {

      if(typeof userId !== 'string'){
        throw new TypeError(utils.constructErrorMessage('userId', 'string', userId))
      }

      if(await userExists(userId)){
        const inventories = await findInventoriesByUserId(userId)

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

const updateInventory = findInventoryById => {

  if(typeof findInventoryById !== 'function'){
    throw new TypeError(utils.constructErrorMessage('findInventoryById', 'function', findInventoryById))
  }

  return saveInventory => {

    if(typeof saveInventory !== 'function'){
      throw new TypeError(utils.constructErrorMessage('saveInventory', 'function', saveInventory))
    }

    return async (id, updatePropsObj) => {

      if(typeof id !== 'string'){
        throw new TypeError(utils.constructErrorMessage('id', 'string', id))
      }

      if(typeof updatePropsObj !== 'object'){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
      }

      if(Array.isArray(updatePropsObj)){
        throw new TypeError(utils.constructErrorMessage('updatePropsObj', 'object', updatePropsObj))
      }

      if(updatePropsObj.id){
        throw new Error("Cannot update id!")
      }

      const inventory = await findInventoryById(id)
      const inventoryKeys = Object.keys(inventory)
      const updatePropsObjKeys = Object.keys(updatePropsObj)

      if(updatePropsObjKeys.some(key => !inventoryKeys.includes(key))){
        throw new Error('Cannot update keys that are not present on inventory!')
      }

      updatePropsObjKeys.forEach(key => {
        if(typeof updatePropsObj[key] !== typeof inventory[key]){
          throw new TypeError(utils.constructErrorMessage(key, typeof inventory[key], updatePropsObj[key]))
        }
      })

      if(updatePropsObj.items){
        
        if(!Array.isArray(updatePropsObj.items)){
          throw new TypeError(utils.constructErrorMessage('items', 'array', updatePropsObj.items))
        }

        if(updatePropsObj.items.some(item => typeof item !== 'object')){
          throw new TypeError(utils.constructErrorMessage('items contents', 'object', updatePropsObj.items))
        }

        if(updatePropsObj.items.some(item => Array.isArray(item))){
          throw new TypeError(utils.constructErrorMessage('items contents', 'object', updatePropsObj.items))
        }

      }

      const updatedInventory = Object.assign({}, inventory, updatePropsObj)
      try{
        saveInventory(updatedInventory)
      } catch(e){
        throw new Error('saveInventory failed!')
      }
      return updatedInventory
    }
  }
}

const deleteInventory = _deleteInventory => {

  if(typeof _deleteInventory !== 'function'){
    throw new TypeError(utils.constructErrorMessage('_deleteInventory', "function", _deleteInventory))
  }

  return id => {

    if(typeof id !== 'string'){
      throw new TypeError(utils.constructErrorMessage('id', 'string', id))
    }

    try{
      _deleteInventory(id)
      return null
    } catch(e) {
      throw new Error("_deleteInventory failed!")
    }
  }
}

module.exports = {
  createInventory,
  getInventory,
  getInventoriesByUserId,
  updateInventory,
  deleteInventory
}