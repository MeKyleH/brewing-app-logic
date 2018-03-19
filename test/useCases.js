const core = require('../lib')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

describe('create timer use case', () => {
  describe('happy path', () => {
    it('should return timer entity', () => {
      const timer = core.createTimerUseCase(1000, 1000)
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
      startedTimer.should.be.a('object')
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

    })
  })
})

describe('reset timer use case', () => {
  describe('happy path', () => {
    it('should return the timer with remainingDuration === duration', () => {

    })
  })
})