const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe('timer alert entity factory function', () => {

  const timerAlertFactory = core.timerAlertEntity
  
  describe('happy path', () => {

    const timerAlert = timerAlertFactory("1", 1000, "hello")
    
    it('should return an object', () => {
      timerAlert.should.be.an('object')
    })
    
    it('should have string id', () => {
      timerAlert.should.have.property("id")
      timerAlert.id.should.be.a("string")
    })

    it('should generate unique string ids', () => {
      otherTimerAlert = timerAlertFactory("1", 1000, "test")
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

  describe('error paths', () => {
    describe('when first arg is of wrong type', () => {
      
      it('should throw a type error', () => {
        expect(() => timerAlertFactory(1, 1000, "bad")).to.throw(TypeError)
      })

    })

    describe('when second arg is of wrong type', () => {

      it('should throw a type error', () => {
        expect(() => timerAlertFactory("1", "1000", "bad")).to.throw(TypeError)
      })

    })

    describe('when third arg is of wrong type', () => {

      it('should throw a type error', () => {
        expect(() => timerAlertFactory("1", 1000, 100)).to.throw(TypeError)
      })

    })
  })
})