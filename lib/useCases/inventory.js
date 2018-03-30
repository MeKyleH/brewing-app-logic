const entities = require('../entities')

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

module.exports = {
  createInventory
}