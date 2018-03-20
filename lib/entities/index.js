const timerEntities = require('./timer')
const timerAlertEntityFactory = require('./timerAlert')
const timerAlertEntity = timerAlertEntityFactory.timerAlert

module.exports = {
  timerEntities,
  timerAlertEntity
}