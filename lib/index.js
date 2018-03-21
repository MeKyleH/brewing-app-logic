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
const timerAlertEntity = entities.timerAlertEntity
const userEntity = entities.userEntity

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
  timerAlertEntity,
  userEntity
}