const useCases = require('./useCases')

const createTimerUseCase = useCases.createTimer
const startTimerUseCase = useCases.startTimer
const stopTimerUseCase = useCases.stopTimer
const decrementTimerUseCase = useCases.decrementTimer
const resetTimerUseCase = useCases.resetTimer

module.exports = {
  createTimerUseCase,
  startTimerUseCase,
  stopTimerUseCase,
  decrementTimerUseCase,
  resetTimerUseCase
}