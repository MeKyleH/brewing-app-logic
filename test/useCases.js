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
      timer.should.have.property('durationInMs')
      timer.durationInMs.should.be.a('number')
      timer.durationInMs.should.equal(1000)
      timer.should.have.property('remainingDurationInMs')
      timer.remainingDurationInMs.should.be.a('number')
      timer.remainingDurationInMs.should.equal(1000)
      timer.should.have.property("intervalDurationInMs")
      timer.intervalDurationInMs.should.be.a('number')
      timer.intervalDurationInMs.should.equal(1000)
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
        durationInMs: 1000,
        remainingDurationInMs: 1000,
        intervalDurationInMs: 1000,
        isRunning: false
      })
      const saveTimer = () => console.log('timer saved!')
      const startedTimer = core.startTimerUseCase(getTimerById)(saveTimer)("1")
      startedTimer.should.be.an('object')
      startedTimer.id.should.equal("1")
      startedTimer.durationInMs.should.equal(1000)
      startedTimer.remainingDurationInMs.should.equal(1000)
      startedTimer.intervalDurationInMs.should.equal(1000)
      startedTimer.isRunning.should.equal(true)
    })
  })
})

describe('stop timer use case', () => {
  describe('happy path', () => {
    it('should return the timer with isRunning false', () => {
      const getTimerById = () =>  ({
        id: "1",
        durationInMs: 1000,
        remainingDurationInMs: 1000,
        intervalDurationInMs: 1000,
        isRunning: true
      })
      const saveTimer = () => console.log('timer saved!')
      const stoppedTimer = core.stopTimerUseCase(getTimerById)(saveTimer)("1")
      stoppedTimer.should.be.an('object')
      stoppedTimer.id.should.equal("1")
      stoppedTimer.durationInMs.should.equal(1000)
      stoppedTimer.remainingDurationInMs.should.equal(1000)
      stoppedTimer.intervalDurationInMs.should.equal(1000)
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
        durationInMs: 1000,
        remainingDurationInMs: 1000,
        intervalDurationInMs: 500,
        isRunning: true
      })
      const decrementedTimer = core.decrementTimerUseCase(getTimerById)(saveTimer)("1")
      decrementedTimer.should.be.an('object')
      decrementedTimer.id.should.equal("1")
      decrementedTimer.durationInMs.should.equal(1000)
      decrementedTimer.remainingDurationInMs.should.equal(500)
      decrementedTimer.intervalDurationInMs.should.equal(500)
      decrementedTimer.isRunning.should.equal(true)
    })
    describe('when remainingDurationInMs <= 0', () => {
      it('should stop the timer', () => {
        const getTimerById = () =>  ({
          id: "1",
          durationInMs: 1000,
          remainingDurationInMs: 1000,
          intervalDurationInMs: 1000,
          isRunning: true
        })
        const decrementedTimer = core.decrementTimerUseCase(getTimerById)(saveTimer)("1")
        decrementedTimer.should.be.an('object')
        decrementedTimer.id.should.equal("1")
        decrementedTimer.durationInMs.should.equal(1000)
        decrementedTimer.remainingDurationInMs.should.equal(0)
        decrementedTimer.intervalDurationInMs.should.equal(1000)
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
        durationInMs: 1000,
        remainingDurationInMs: 200,
        intervalDurationInMs: 1000,
        isRunning: true
      })
      const saveTimer = () => console.log('timer saved!')
      const resetTimer = core.resetTimerUseCase(getTimerById)(saveTimer)("1")
      resetTimer.should.be.an('object')
      resetTimer.id.should.equal("1")
      resetTimer.durationInMs.should.equal(1000)
      resetTimer.remainingDurationInMs.should.equal(1000)
      resetTimer.intervalDurationInMs.should.equal(1000)
      resetTimer.isRunning.should.equal(true)
    })
  })
})