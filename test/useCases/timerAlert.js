const chai = require('chai')
const should = chai.should()
const core = require('../../lib')

describe('createTimerAlert use case', () => {

  let createTimerAlertCalled = false
  let createdTimerAlert = "timerAlert"
  
  const createTimerAlert = timerAlert => {
    createTimerAlertCalled = true
    createdTimerAlert = timerAlert
  }

  const timerAlertFactory = core.createTimerAlertUseCase(createTimerAlert)
  const timerAlert = timerAlertFactory("1", 1000, "test")

  describe('happy path', () => {

    it('should call createTimer injected dependency', () => {
      createTimerAlertCalled.should.equal(true)
    })

    it('should pass createdTimer to createTimer', () => {
      createdTimerAlert.should.be.an('object')
    })

    it('should return function after createTimer is injected', () => {
      timerAlertFactory.should.be.a('function')
    })

    it('should return an object', () => {
      timerAlert.should.be.an('object')
    })

    it('should have string id', () => {
      timerAlert.should.have.property("id")
      timerAlert.id.should.be.a("string")
    }) 

    it('should generate unique string ids', () => {
      otherTimerAlert = timerAlertFactory("1", 1000, "test2")
      otherTimerAlert.id.should.not.equal(timerAlert.id)
    })

    it('should have a string timerId', () => {
      timerAlert.should.have.property('timerId')
      timerAlert.timerId.should.be.a('string')
    })

    it('should have timerId equal to given arg', () => {
      const otherTimerAlert = timerAlertFactory("2", 1000, "test")
      otherTimerAlert.timerId.should.equal("2")
    })

    it('should have a number activationTime prop', () => {
      timerAlert.should.have.property("activationTime")
      timerAlert.activationTime.should.be.a('number')
    })

    it('should have an activationTime equal to second arg', () => {
      const otherTimerAlert = timerAlertFactory("1", 1000, "message")
      otherTimerAlert.activationTime.should.equal(1000)
    })

    it('should have a string message prop', () => {
      timerAlert.should.have.property('message')
      timerAlert.message.should.be.a('string')
    })

    it('should have message equal to third arg', () => {
      const otherTimerAlert = timerAlertFactory("1", 1000, "test")
      otherTimerAlert.message.should.equal("test")
    })

    it('should have bool activated prop', () => {
      timerAlert.should.have.property('activated')
      timerAlert.activated.should.be.a('boolean')
    })

    it('should have activated prop equal false', () => {
      timerAlert.activated.should.equal(false)
    })
  
  })
})