const timerEntities = require('./timer')
const timerAlertEntityFactory = require('./timerAlert')
const userEntityFactory = require('./user')
const inventoryEntityFactory = require('./inventory')
const timerAlertEntity = timerAlertEntityFactory.timerAlert
const userEntity = userEntityFactory.user
const inventoryEntity = inventoryEntityFactory.inventory

module.exports = {
  timerEntities,
  timerAlertEntity,
  userEntity,
  inventoryEntity
}