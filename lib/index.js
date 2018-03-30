const useCases = require('./useCases')
const entities = require('./entities')

const createTimerUseCase = useCases.timerUseCases.createTimer
const startTimerUseCase = useCases.timerUseCases.startTimer
const stopTimerUseCase = useCases.timerUseCases.stopTimer
const decrementTimerUseCase = useCases.timerUseCases.decrementTimer
const resetTimerUseCase = useCases.timerUseCases.resetTimer
const createTimerAlertUseCase = useCases.timerAlertUseCases.createTimerAlert
const updateTimerAlertUseCase = useCases.timerAlertUseCases.updateTimerAlert
const activateTimerAlertUseCase = useCases.timerAlertUseCases.activateTimerAlert
const deleteTimerAlertUseCase = useCases.timerAlertUseCases.deleteTimerAlert
const createUserUseCase = useCases.userUseCases.createUser
const updateUserUseCase = useCases.userUseCases.updateUser
const authenticateUserUseCase = useCases.userUseCases.authenticateUser
const deleteUserUseCase = useCases.userUseCases.deleteUser
const createInventoryUseCase = useCases.inventoryUseCases.createInventory
const timerAlertEntity = entities.timerAlertEntity
const userEntity = entities.userEntity
const inventoryEntity = entities.inventoryEntity

module.exports = {
  createTimerUseCase,
  startTimerUseCase,
  stopTimerUseCase,
  decrementTimerUseCase,
  resetTimerUseCase,
  createTimerAlertUseCase,
  updateTimerAlertUseCase,
  activateTimerAlertUseCase,
  deleteTimerAlertUseCase,
  createUserUseCase,
  updateUserUseCase,
  authenticateUserUseCase,
  deleteUserUseCase,
  createInventoryUseCase,
  timerAlertEntity,
  userEntity,
  inventoryEntity
}