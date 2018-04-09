const entities = require('../entities')

const createInventoryItem = _createInventoryItem => {

  if(typeof _createInventoryItem !== 'function'){
    throw new TypeError
  }

  return (inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt) => {
    const inventoryItem = entities.inventoryItemEntity(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)
    try{
      _createInventoryItem(inventoryItem)
      return inventoryItem
    } catch(e) {
      throw new Error('createInventoryItem failed!')
    }
  }
}

const getInventoryItem = findInventoryItemById => {

  if(typeof findInventoryItemById !== 'function'){
    throw new TypeError
  }

  return id => {

    if(typeof id !== 'string'){
      throw new TypeError
    }

    const inventoryItem = findInventoryItemById(id)
    return inventoryItem
  }
}

module.exports = {
  createInventoryItem,
  getInventoryItem
}