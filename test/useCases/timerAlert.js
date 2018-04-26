const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe('createTimerAlert use case', () => {

  let createTimerAlertCalled = false
  let createdTimerAlert = "timerAlert"
  
  const createTimerAlert = async timerAlert => {
    createTimerAlertCalled = true
    createdTimerAlert = timerAlert
  }

  const timerAlertFactory = core.createTimerAlertUseCase(createTimerAlert)
  const timerAlertPromise = timerAlertFactory("1", 1000, "test")

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
      return timerAlertPromise.should.eventually.be.an('object')
    })

    it('should have string id', () => {
      return timerAlertPromise.should.eventually.have.property('id').be.a('string')
    }) 

    it('should generate unique string ids', async () => {
      const timerAlert = await timerAlertPromise
      const otherTimerAlertPromise = timerAlertFactory("1", 1000, "test2")
      return otherTimerAlertPromise.should.eventually.have.property("id").not.equal(timerAlert.id)
    })

    it('should have a string timerId', () => {
      return timerAlertPromise.should.eventually.have.property('timerId').be.a('string')
    })

    it('should have timerId equal to given arg', () => {
      const otherTimerAlertPromise = timerAlertFactory("2", 1000, "test")
      return otherTimerAlertPromise.should.eventually.have.property("timerId").equal("2")
    })

    it('should have a number activationTime prop', () => {
      return timerAlertPromise.should.eventually.have.property("activationTime").be.a('number')
    })

    it('should have an activationTime equal to second arg', () => {
      const otherTimerAlertPromise = timerAlertFactory("1", 1000, "message")
      return otherTimerAlertPromise.should.eventually.have.property("activationTime").equal(1000)
    })

    it('should have a string message prop', () => {
      return timerAlertPromise.should.eventually.have.property("message").be.a('string')
    })

    it('should have message equal to third arg', () => {
      const otherTimerAlertPromise = timerAlertFactory("1", 1000, "test")
      return otherTimerAlertPromise.should.eventually.have.property("message").equal("test")
    })

    it('should have bool activated prop', () => {
      return timerAlertPromise.should.eventually.have.property('activated').be.a('boolean')
    })

    it('should have activated prop equal false', () => {
      return timerAlertPromise.should.eventually.have.property('activated').equal(false)
    })
  
  })

  describe("error path", () => {

    describe("when first arg is of wrong type", () => {
      it('should trow a type error', () => {
        const promise = timerAlertFactory(1, 1000, "test")
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe("when second arg is of wrong type", () => {
      it('should trow a type error', () => {
        const promise = timerAlertFactory("1", "1000", "test")
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe("when third arg is of wrong type", () => {
      it('should trow a type error', () => {
        const promise = timerAlertFactory("1", 1000, 1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe("when injected dependency is not a func", () => {
      it('should throw a type error', () => {
        expect(() => core.createTimerAlertUseCase("createTimerAlert")("1", 1000, "test")).to.throw(TypeError)
      })
    })

    describe('when injected createTimerAlert throws an error', () => {
      it('should throw an error', () => {
        createTimerAlertError = () => {throw new Error}
        const promise = core.createTimerAlertUseCase(createTimerAlertError)("1", 1000, "test")
        return promise.should.be.rejectedWith(Error)
      })
    })

  })
})

describe('getTimerAlert use case', () => {

  let findTimerAlertByIdCalled = false
  let findTimerAlertByIdArg = ""

  const testTimerAlert = {
    id: "1",
    name: "timerAlert",
    message: "hello",
    activated: false,
    activationTime: 0,
    timerId: "0"
  }
  
  const findTimerAlertById = timerAlertId => {
    findTimerAlertByIdCalled = true
    findTimerAlertByIdArg = timerAlertId
    return testTimerAlert
  }

  const timerAlertId = "1"
  const timerAlertPromise = core.getTimerAlertUseCase(findTimerAlertById)(timerAlertId)

  describe('happy path', () => {

    it('should return a function after passing findTimerAlertById', () => {
      core.getTimerAlertUseCase(findTimerAlertById).should.be.a('function')
    })

    it('should call findTimerAlertById', () => {
      findTimerAlertByIdCalled.should.equal(true)
    })

    it('should pass timerAlertId arg to findTimerAlertById', () => {
      findTimerAlertByIdArg.should.equal(timerAlertId)
    })

    it('should return timerAlert with matching id', () => {
      return timerAlertPromise.should.eventually.deep.equal(testTimerAlert)
    })

  })

  describe('error path', () => {

    describe('when findTimerAlertById is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.getTimerAlertUseCase("findTimerAlertById")).to.throw(TypeError)
      })
    })

    describe('when timerAlertId is not of type string', () => {
      it('should throw a type error', () => {
        const promise = core.getTimerAlertUseCase(findTimerAlertById)(1)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when findTimerAlertById fails', () => {
      it('should throw an error', () => {
        const badFindTimerAlertById = () => {throw new Error}
        const promise = core.getTimerAlertUseCase(badFindTimerAlertById)(timerAlertId)
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('getTimerAlertsByTimerId use case', () => {
  
  let findTimerAlertsByTimerIdCalled = false
  let findTimerAlertsByTimerIdArg = ""

  const testTimerAlerts = [
    {
      id: "1",
      name: "timerAlert",
      message: "hello",
      activated: false,
      activationTime: 0,
      timerId: "0" 
    },
    {
      id: "2",
      name: "timerAlert",
      message: "hello",
      activated: false,
      activationTime: 0,
      timerId: "0" 
    }
  ]

  const findTimerAlertsByTimerId = timerId => {
    findTimerAlertsByTimerIdCalled = true
    findTimerAlertsByTimerIdArg = timerId
    return testTimerAlerts
  }

  const timerId = "1"
  const timerAlertsPromise = core.getTimerAlertsByTimerIdUseCase(findTimerAlertsByTimerId)(timerId)

  describe('happy path', () => {

    it('should return a function after passing findTimerAlertsByTimerId', () => {
      core.getTimerAlertsByTimerIdUseCase(findTimerAlertsByTimerId).should.be.a('function')
    })
    
    it('should call findTimerAlertsByTimerId', () => {
      findTimerAlertsByTimerIdCalled.should.equal(true)
    })

    it('should pass timerId arg to findTimerAlertsByTimerId', () => {
      findTimerAlertsByTimerIdArg.should.equal(timerId)
    })

    it('should return timerAlerts', () => {
      timerAlertsPromise.should.eventually.deep.equal(testTimerAlerts)
    })

  })

  describe('error path', () => {

    describe('when findTimerAlertsByTimerId is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.getTimerAlertsByTimerIdUseCase("findTimerAlertsByTimerId")).to.throw(TypeError)
      })
    })

    describe('when timerId is not of type string', () => {
      it('should throw a type error', () => {
        const promise = core.getTimerAlertsByTimerIdUseCase(findTimerAlertsByTimerId)(1)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when findTimerAlertsByTimerId fails', () => {
      it("should throw an error", () => {
        const badFindTimerAlertsByTimerId = () => {throw new Error}
        const promise = core.getTimerAlertsByTimerIdUseCase(badFindTimerAlertsByTimerId)(timerId)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when timerAlerts is not of type array', () => {
      it('should throw a type error', () => {
        const badFindTimerAlertsByTimerId = () => ({})
        const promise = core.getTimerAlertsByTimerIdUseCase(badFindTimerAlertsByTimerId)(timerId)
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('updatedTimerAlert use case', () => {

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
    const updatedTimerAlertPromise = updateTimerAlert("1", {message: "new message", activationTime: 20, timerId: "blargh"})

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
      return updatedTimerAlertPromise.should.eventually.deep.equal(savedTimerAlert)
    })

    it('should return new timer alert with message equal arg', () => {
      return updatedTimerAlertPromise.should.eventually.have.property("message").equal("new message")
    })

    it('should return new timer with activationTime property equal to arg', () => {
      return updatedTimerAlertPromise.should.eventually.have.property('activationTime').equal(20)
    })

    it('should return new timer with timerId equal to arg', () => {
      return updatedTimerAlertPromise.should.eventually.have.property("timerId").equal("blargh")
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
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)(1, {message: "new message", activationTime: 20, timerId: "blargh"})
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when second arg is of wrong type', () => {
      
      describe('not an array or object', () => {
        it('should throw a type error', () => {
          const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", "new message")
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when array', () => {
        it('should throw a type error', () => {
          const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", ["new message"])
          return promise.should.be.rejectedWith(TypeError)
        })
      })

    })

    describe('when attempting to update props that dont currently exist', () => {
      it('should throw an error', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {foo: "bar"})
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when attempting to update props with wrong types', () => {
      it('should throw a type error when message is number', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {message: 1})
        return promise.should.be.rejectedWith(TypeError)
      })

      it('should throw a type error when message is boolean', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {message: true})
        return promise.should.be.rejectedWith(TypeError)
      })

      it('should throw a type error when timerId is string', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {message: "hello",activationTime: 0,timerId: 1})
      })
    })

    describe('when attempting to update id prop', () => {
      it('should throw an error', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {id: "2"})
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when attempting to update activated prop', () => {
      it('should throw an error', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {activated: true})
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when attempting to update both id and activated', () => {
      it('should throw an error', () => {
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("1", {id: "2", activated: true})
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when getTimerAlertById throws error', () => {
      it('should throw error', () => {
        const getTimerAlertByIdError = () => {throw new Error}
        const promise = core.updateTimerAlertUseCase(getTimerAlertByIdError)(saveTimerAlert)("1", {message: "hello"})
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when getTimerAlertById returns nothing', () => {
      it('should throw an error', () => {
        const getTimerAlertByIdNull = () => {}
        const promise = core.updateTimerAlertUseCase(getTimerAlertByIdNull)(saveTimerAlert)("1", {message: "hello"})
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when saveTimerAlert throws an error', () => {
      it('should throw an error', () => {
        const saveTimerAlertError = () => {throw new Error}
        const promise = core.updateTimerAlertUseCase(getTimerAlertById)(saveTimerAlertError)("1", {message: "hello"})
        return promise.should.be.rejectedWith(Error)
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
    const activatedTimerAlertPromise = activateTimerAlert("1")

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
      return activatedTimerAlertPromise.should.eventually.deep.equal(savedTimerAlert)
    })

    it('should call send message injected dependency', () => {
      sendMessageCalled.should.equal(true)
    })

    it('should pass message to send message', () => {
      return activatedTimerAlertPromise.should.eventually.have.property('message').equal(sentMessage)
    })

    it('should return new timerAlert with activated true', () => {
      return activatedTimerAlertPromise.should.eventually.have.property('activated').equal(true)
    })

  })

  describe('error path', () => {
    describe('when injected dependencies arent funcs', () => {
      it('should throw a type error', () => {
        expect(() => core.activateTimerAlertUseCase("getTimerAlertById")(saveTimerAlert)(sendMessage)).to.throw(TypeError)
        expect(() => core.activateTimerAlertUseCase(getTimerAlertById)("saveTimerAlert")(sendMessage)).to.throw(TypeError)
        expect(() => core.activateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)("sendMessage")).to.throw(TypeError)
      })
    })

    describe('if timerAlertId is wrong type', () => {

      const activateTimerAlert = core.activateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)(sendMessage)

      it('should throw a type error', () => {
        const promise = activateTimerAlert(1)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when getTimerAlertById throws error', () => {
      it('should throw error', () => {
        const getTimerAlertByIdError = () => {throw new Error}
        const promise = core.activateTimerAlertUseCase(getTimerAlertByIdError)(saveTimerAlert)(sendMessage)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when getTimerAlertById returns nothing', () => {
      it('should throw an error', () => {
        const getTimerAlertByIdNull = () => {}
        expect(() => core.activateTimerAlertUseCase(getTimerAlertByIdNull)(saveTimerAlert)(sendMessage)("1").to.throw())
      })
    })

    describe('when saveTimerAlert throws an error', () => {
      it('should throw an error', () => {
        const saveTimerAlertError = () => {throw new Error}
        const promise = core.activateTimerAlertUseCase(getTimerAlertById)(saveTimerAlertError)(sendMessage)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when sendMessage throws an error', () => {
      it('should throw an error', () => {
        const sendMessageError = () => {throw new Error}
        const promise = core.activateTimerAlertUseCase(getTimerAlertById)(saveTimerAlert)(sendMessageError)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

  })
})

describe('delete timerAlert use case', () => {

  let deleteTimerAlertCalled = false
  let deleteTimerAlertId = ""

  const _deleteTimerAlert = timerAlertId => {
    deleteTimerAlertCalled = true
    deleteTimerAlertId = timerAlertId
  }

  describe('happy path', () => {

    const id = "1"
    const deletedTimerAlertPromise = core.deleteTimerAlertUseCase(_deleteTimerAlert)(id)

    it('should call deleteTimerAlert injected dependency', () => {
      deleteTimerAlertCalled.should.equal(true)
    })

    it('should pass timerId to deleteFunc', () => {
      deleteTimerAlertId.should.equal(id)
    })

    it('should return null', () => {
      return deletedTimerAlertPromise.should.eventually.be.a('null')
    })

  })

  describe('error path', () => {

    describe('when deleteFunc dependency is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.deleteTimerAlertUseCase("deleteFunc")).to.throw(TypeError)
      })
    })

    describe('when deleteFunc throws an error', () => {
      it('should throw an error', () => {
        const deleteFuncError = () => {throw new Error}
        const promise = core.deleteTimerAlertUseCase(deleteFuncError)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when timerAlertId is of wrong type', () => {
      it('should throw a type error', () => {
        const promise = core.deleteTimerAlertUseCase(_deleteTimerAlert)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

  })
})