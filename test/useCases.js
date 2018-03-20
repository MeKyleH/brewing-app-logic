const core = require('../lib')
const chai = require('chai')
const should = chai.should()

describe('create timer use case', () => {
  describe('happy path', () => {
    it('should return timer entity', () => {
      const createTimer = () => console.log("timer created!")
      const timer = core.createTimerUseCase(createTimer)(1000,1000)
      timer.should.be.an('object')
      timer.should.have.property('id')
      timer.id.should.be.a('string')
      timer.should.have.property('duration')
      timer.duration.should.be.a('number')
      timer.duration.should.equal(1000)
      timer.should.have.property('remainingDuration')
      timer.remainingDuration.should.be.a('number')
      timer.remainingDuration.should.equal(1000)
      timer.should.have.property("intervalDuration")
      timer.intervalDuration.should.be.a('number')
      timer.intervalDuration.should.equal(1000)
      timer.should.have.property('isRunning')
      timer.isRunning.should.be.a('boolean')
      timer.isRunning.should.equal(false)
    })
  })
})

describe('start timer use case', () => {
  describe('happy path', () => {

    it('should return the timer with isRunning true', () => {
      const getTimerById = () =>  ({
        id: "1",
        duration: 1000,
        remainingDuration: 1000,
        intervalDuration: 1000,
        isRunning: false
      })
      const saveTimer = () => console.log('timer saved!')
      const startedTimer = core.startTimerUseCase(getTimerById)(saveTimer)("1")
      startedTimer.should.be.an('object')
      startedTimer.id.should.equal("1")
      startedTimer.duration.should.equal(1000)
      startedTimer.remainingDuration.should.equal(1000)
      startedTimer.intervalDuration.should.equal(1000)
      startedTimer.isRunning.should.equal(true)
    })
  })
})

describe('stop timer use case', () => {
  describe('happy path', () => {
    it('should return the timer with isRunning false', () => {
      const getTimerById = () =>  ({
        id: "1",
        duration: 1000,
        remainingDuration: 1000,
        intervalDuration: 1000,
        isRunning: true
      })
      const saveTimer = () => console.log('timer saved!')
      const stoppedTimer = core.stopTimerUseCase(getTimerById)(saveTimer)("1")
      stoppedTimer.should.be.an('object')
      stoppedTimer.id.should.equal("1")
      stoppedTimer.duration.should.equal(1000)
      stoppedTimer.remainingDuration.should.equal(1000)
      stoppedTimer.intervalDuration.should.equal(1000)
      stoppedTimer.isRunning.should.equal(false)
    })
  })
})

describe('decrement timer use case', () => {
  describe('happy path', () => {

    const saveTimer = () => console.log('timer saved!')

    it('should return timer decremented by interval', () => {
      const getTimerById = () =>  ({
        id: "1",
        duration: 1000,
        remainingDuration: 1000,
        intervalDuration: 500,
        isRunning: true
      })
      const decrementedTimer = core.decrementTimerUseCase(getTimerById)(saveTimer)("1")
      decrementedTimer.should.be.an('object')
      decrementedTimer.id.should.equal("1")
      decrementedTimer.duration.should.equal(1000)
      decrementedTimer.remainingDuration.should.equal(500)
      decrementedTimer.intervalDuration.should.equal(500)
      decrementedTimer.isRunning.should.equal(true)
    })
    describe('when remainingDuration <= 0', () => {
      it('should stop the timer', () => {
        const getTimerById = () =>  ({
          id: "1",
          duration: 1000,
          remainingDuration: 1000,
          intervalDuration: 1000,
          isRunning: true
        })
        const decrementedTimer = core.decrementTimerUseCase(getTimerById)(saveTimer)("1")
        decrementedTimer.should.be.an('object')
        decrementedTimer.id.should.equal("1")
        decrementedTimer.duration.should.equal(1000)
        decrementedTimer.remainingDuration.should.equal(0)
        decrementedTimer.intervalDuration.should.equal(1000)
        decrementedTimer.isRunning.should.equal(false)
      })
    })
  })
})

describe('reset timer use case', () => {
  describe('happy path', () => {
    it('should return the timer with remainingDuration === duration', () => {
      const getTimerById = () =>  ({
        id: "1",
        duration: 1000,
        remainingDuration: 200,
        intervalDuration: 1000,
        isRunning: true
      })
      const saveTimer = () => console.log('timer saved!')
      const resetTimer = core.resetTimerUseCase(getTimerById)(saveTimer)("1")
      resetTimer.should.be.an('object')
      resetTimer.id.should.equal("1")
      resetTimer.duration.should.equal(1000)
      resetTimer.remainingDuration.should.equal(1000)
      resetTimer.intervalDuration.should.equal(1000)
      resetTimer.isRunning.should.equal(true)
    })
  })
})