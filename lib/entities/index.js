const timerEntities = require('./timer')
const timerAlertEntityFactory = require('./timerAlert')
const userEntityFactory = require('./user')
const timerAlertEntity = timerAlertEntityFactory.timerAlert
const userEntity = userEntityFactory.user

module.exports = {
  timerEntities,
  timerAlertEntity,
  userEntity
}