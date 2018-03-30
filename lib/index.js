const useCases = require('./useCases')
const entities = require('./entities')

const createTimerUseCase = useCases.timerUseCases.createTimer
const getTimerUseCase = useCases.timerUseCases.getTimer
const getTimersByUserIdUseCase = useCases.timerUseCases.getTimersByUserId
const startTimerUseCase = useCases.timerUseCases.startTimer
const stopTimerUseCase = useCases.timerUseCases.stopTimer
const decrementTimerUseCase = useCases.timerUseCases.decrementTimer
const resetTimerUseCase = useCases.timerUseCases.resetTimer
const createTimerAlertUseCase = useCases.timerAlertUseCases.createTimerAlert
const getTimerAlertsByTimerIdUseCase = useCases.timerAlertUseCases.getTimerAlertsByTimerId
const updateTimerAlertUseCase = useCases.timerAlertUseCases.updateTimerAlert
const activateTimerAlertUseCase = useCases.timerAlertUseCases.activateTimerAlert
const deleteTimerAlertUseCase = useCases.timerAlertUseCases.deleteTimerAlert
const createUserUseCase = useCases.userUseCases.createUser
const updateUserUseCase = useCases.userUseCases.updateUser
const authenticateUserUseCase = useCases.userUseCases.authenticateUser
const deleteUserUseCase = useCases.userUseCases.deleteUser
const createInventoryUseCase = useCases.inventoryUseCases.createInventory
const getInventoryUseCase = useCases.inventoryUseCases.getInventory
const timerAlertEntity = entities.timerAlertEntity
const userEntity = entities.userEntity
const inventoryEntity = entities.inventoryEntity

module.exports = {
  createTimerUseCase,
  getTimerUseCase,
  getTimersByUserIdUseCase,
  startTimerUseCase,
  stopTimerUseCase,
  decrementTimerUseCase,
  resetTimerUseCase,
  createTimerAlertUseCase,
  getTimerAlertsByTimerIdUseCase,
  updateTimerAlertUseCase,
  activateTimerAlertUseCase,
  deleteTimerAlertUseCase,
  createUserUseCase,
  updateUserUseCase,
  authenticateUserUseCase,
  deleteUserUseCase,
  createInventoryUseCase,
  getInventoryUseCase,
  timerAlertEntity,
  userEntity,
  inventoryEntity
}