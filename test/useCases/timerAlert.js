const chai = require('chai')
const should = chai.should()
const expect = chai.expect
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

  describe("error path", () => {

    describe("when first arg is of wrong type", () => {
      it('should trow a type error', () => {
        expect(() => timerAlertFactory(1, 1000, "test")).to.throw(TypeError)
      })
    })

    describe("when second arg is of wrong type", () => {
      it('should trow a type error', () => {
        expect(() => timerAlertFactory("1", "1000", "test")).to.throw(TypeError)
      })
    })

    describe("when third arg is of wrong type", () => {
      it('should trow a type error', () => {
        expect(() => timerAlertFactory("1", 1000, 1)).to.throw(TypeError)
      })
    })

    describe("when injected dependency is not a func", () => {
      it('should throw a type error', () => {
        expect(() => core.createTimerAlertUseCase("createTimerAlert")("1", 1000, "test")).to.throw(TypeError)
      })
    })

  })
})

describe('updateTimerAlert use case', () => {

  let getTimerAlertByIdCalled = false
  let getTimerAlertId = 0
  let saveTimerCalled = false
  let savedTimerAlert = {}

  const dummyTimerAlert = {
    id: "1",
    name: "timerAlert",
    message: "hello",
    activated: false,
    activationTime: 0,
    timerId: "0"
  }

  const getTimerAlertById = timerAlertId => {
    getTimerAlertByIdCalled = true
    getTimerAlertId = timerAlertId
    return dummyTimerAlert
  }

  const saveTimerAlert = timerAlert => {
    saveTimerCalled = true
    savedTimerAlert = timerAlert
  }

  describe('happy path', () => {

    const updateTimerAlert = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)
    const updatedTimerAlert = updateTimerAlert("1", {message: "new message", activationTime: 20, timerId: "blargh"})

    it('should call getTimerAlertById injected dependency', () => {
      getTimerAlertByIdCalled.should.equal(true)
    })

    it('should call getTimerAlertById with passed timerId', () => {
      getTimerAlertId.should.equal("1")
    })

    it('should call saveTimer injected dependency', () => {
      saveTimerCalled.should.equal(true)
    })

    it('should pass updatedTimerAlert to saveTimer', () => {
      savedTimerAlert.should.equal(updatedTimerAlert)
    })

    it('should return new timerAlert with fields updated to match args', () => {
      updatedTimerAlert.message.should.equal("new message")
      updatedTimerAlert.activationTime.should.equal(20)
      updatedTimerAlert.timerId.should.equal("blargh")
      dummyTimerAlert.should.deep.equal({id: "1",name: "timerAlert",message: "hello",activated: false, activationTime: 0,timerId: "0"})
    })

  })

  describe('error path', () => {

    describe('when getTimerAlertById dependency is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerAlertUseCase("getTimerAlertById")(saveTimerAlert)("1", {message: "new message", activationTime: 20, timerId: "blargh"})).to.throw(TypeError)
      })
    })

    describe('when saveTimerAlert dependency is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)("saveTimerAlert")("1", {message: "new message", activationTime: 20, timerId: "blargh"})).to.throw(TypeError)
      })
    })

    describe('when first arg is of wrong type', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)(1, {message: "new message", activationTime: 20, timerId: "blargh"})).to.throw(TypeError)
      })
    })

    describe('when second arg is of wrong type', () => {
      
      describe('not an array or object', () => {
        it('should throw a type error', () => {
          expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", "new message")).to.throw(TypeError)
        })
      })

      describe('when array', () => {
        it('should throw a type error', () => {
          expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", ["new message"])).to.throw(TypeError)
        })
      })

    })

    describe('when attempting to update props that dont currently exist', () => {
      it('should throw an error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {foo: "bar"})).to.throw()
      })
    })

    describe('when attempting to update props with wrong types', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {message: 1})).to.throw(TypeError)
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {message: true})).to.throw(TypeError)
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {message: "hello",activationTime: 0,timerId: 1})).to.throw(TypeError)
      })
    })

    describe('when attempting to update id prop', () => {
      it('should throw an error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {id: "2"})).to.throw()
      })
    })

    describe('when attempting to update activated prop', () => {
      it('should throw an error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {activated: true})).to.throw()
      })
    })

    describe('when attempting to update both id and activated', () => {
      it('should throw an error', () => {
        expect(() => core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {id: "2", activated: true})).to.throw()
      })
    })

  })

})

describe("activateTimerAlert use case", () => {

  let getTimerAlertByIdCalled = false
  let getTimerAlertId = 0
  let saveTimerCalled = false
  let savedTimerAlert = {}
  let sendMessageCalled = false
  let sentMessage = ""

  const dummyTimerAlert = {
    id: "1",
    name: "timerAlert",
    message: "hello",
    activated: false
  }

  const getTimerAlertById = timerAlertId => {
    getTimerAlertByIdCalled = true
    getTimerAlertId = timerAlertId
    return dummyTimerAlert
  }

  const saveTimerAlert = timerAlert => {
    saveTimerCalled = true
    savedTimerAlert = timerAlert
  }

  const sendMessage = message => {
    sendMessageCalled = true
    sentMessage = message
  }

  describe('happy path', () => {

    const activateTimerAlert = core.activateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)(sendMessage)
    const activatedTimerAlert = activateTimerAlert("1")

    it('should call getTimerAlertId injected dependency', () => {
      getTimerAlertByIdCalled.should.equal(true)
    })

    it('should call getTimerAlertById with passed timerId', () => {
      getTimerAlertId.should.equal("1")
    })

    it('should call saveTimerAlert injected dependency', () => {
      saveTimerCalled.should.equal(true)
    })

    it('should pass activatedTimerAlert to saveTimer', () => {
      savedTimerAlert.should.equal(activatedTimerAlert)
    })

    it('should call send message injected dependency', () => {
      sendMessageCalled.should.equal(true)
    })

    it('should pass message to send message', () => {
      sentMessage.should.equal(activatedTimerAlert.message)
    })

    it('should return new timerAlert with activated true', () => {
      activatedTimerAlert.activated.should.equal(true)
      activatedTimerAlert.should.not.equal(dummyTimerAlert)
      dummyTimerAlert.should.deep.equal({id: "1",name: "timerAlert",message: "hello",activated: false})
    })

  })
})

describe('delete timerAlert use case', () => {
  describe('happy path', () => {

    let deleteTimerAlertCalled = false
    let deleteTimerAlertId = ""

    const _deleteTimerAlert = timerAlertId => {
      deleteTimerAlertCalled = true
      deleteTimerAlertId = timerAlertId
    }

    const id = "1"
    core.deleteTimerAlertUseCase(_deleteTimerAlert)(id)

    it('should call deleteTimerAlert injected dependency', () => {
      deleteTimerAlertCalled.should.equal(true)
    })

    it('should pass timerId to deleteFunc', () => {
      deleteTimerAlertId.should.equal(id)
    })

  })
})