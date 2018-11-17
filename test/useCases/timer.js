const core = require('../../lib')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

describe('create timer use case', () => {
  
  describe('happy path', () => {

    let createTimerCalled = false
    let createTimerArg = {}
    const createTimer = async timer => {
      createTimerCalled = true
      createTimerArg = timer
    }

    const timerPromise = core.createTimerUseCase(createTimer)("1", "timer", 1000, 500)
    
    it('should return a function after receiving createTimer', () => {
      core.createTimerUseCase(createTimer).should.be.a('function')
    })

    it('should call createTimer', () => {
      createTimerCalled.should.equal(true)
    })

    it('should pass timer to createTimer', () => {
      return timerPromise.should.eventually.deep.equal(createTimerArg)
    })

    it('should return an object', () => {
      return timerPromise.should.eventually.be.an('object')
    })

    it('should have string id property', () => {
      return timerPromise.should.eventually.have.property('id').be.a('string')
    })

    it('should generate unique ids', async () => {
      const timer = await timerPromise
      return core.createTimerUseCase(createTimer)("1", "timer", 1000, 500).should.eventually.have.property("id").not.equal(timer.id)
    })

    it('should have string userId property', () => {
      return timerPromise.should.eventually.have.property('userId').be.a('string')
    })

    it('should have userId property equal to userId arg', () => {
      return timerPromise.should.eventually.have.property('userId').equal("1")
    })

    it('should have a string name property', () => {
      return timerPromise.should.eventually.have.property("name").be.a("string")
    })

    it('should name property equal to name arg', () => {
      return timerPromise.should.eventually.have.property("name").equal("timer")
    })

    it('should have number duration property', () => {
      return timerPromise.should.eventually.have.property('duration').be.a('number')
    })

    it('should have duration equal to duration arg', () => {
      return timerPromise.should.eventually.have.property('duration').equal(1000)
    })

    it('should have a intervalDuration property equal to intervalDuration arg', () =>{
      return timerPromise.should.eventually.have.property('intervalDuration').equal(500)
    })

    it('should have a isRunning property equal to false', () => {
      return timerPromise.should.eventually.have.property('isRunning').equal(false)
    })

  })

  describe('error path', () => {

    const createTimer = () => {}

    describe('when createTimer is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.createTimerUseCase("createTimer")).to.throw(TypeError)
      })
    })

    describe('when userId is not a string', () => {
      it('should throw a TypeError', () => {
        const promise = core.createTimerUseCase(createTimer)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe("when name is not a string", () => {
      it('should throw a TypeError', () => {
        const promise = core.createTimerUseCase(createTimer)(1, 1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when duration is not a number', () => {
      it('should throw a TypeError', () => {
        const promise = core.createTimerUseCase(createTimer)("1", "1000")
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when intervalDuration is not a number', () => {
      it('should throw a TypeError', () => {
        const promise = core.createTimerUseCase(createTimer)("1", 1000, "500")
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when createTimer fails', () => {
      it('should throw an Error', () => {
        const badCreateTimer = () => {throw new Error}
        const promise = core.createTimerUseCase(badCreateTimer)("1", 1000, 500)
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('getTimer use case', () => {

  const testTimer = {
    id: "1",
    name: "timer",
    duration: 1000,
    remainingDuration: 1000,
    intervalDuration: 500,
    isRunning: false
  }

  let findTimerByIdCalled = false
  let findTimerByIdArg = ""
  const findTimerById = timerId => {
    findTimerByIdCalled = true
    findTimerByIdArg = timerId
    return testTimer
  }

  const timerId = "1"
  const timerPromise = core.getTimerUseCase(findTimerById)(timerId)

  describe('happy path', () => {

    it('should return a function after taking findTimerById', () => {
      core.getTimerUseCase(findTimerById).should.be.a('function')
    })

    it('should call findTimerById', () => {
      findTimerByIdCalled.should.equal(true)
    })

    it('should pass timerId arg to findTimerById', () => {
      findTimerByIdArg.should.equal(timerId)
    })

    it('should return timer', () => {
      return timerPromise.should.eventually.deep.equal(testTimer)
    })

  })

  describe('error path', () => {

    describe('when findTimerById is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.getTimerUseCase("findTimerById")).to.throw(TypeError)
      })
    })

    describe('when timerId is not of type string', () => {
      it('should throw a type error', () => {
        const promise = core.getTimerUseCase(findTimerById)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        const promise = core.getTimerUseCase(badFindTimerById)(timerId)
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('getTimersByUserId use case', () => {

  let userExistsCalled = false
  let userExistsArg = ""
  
  const userExists = userId => {
    userExistsCalled = true
    userExistsArg = userId
    return true
  }

  let findTimersByUserIdCalled = false
  let findTimersByUserIdArg = ""
  
  const testTimers = [
    {
      id: "1",
      name: "timer",
      duration: 1000,
      remainingDuration: 1000,
      intervalDuration: 500,
      isRunning: false
    },
    {
      id: "2",
      name: "timer",
      duration: 1000,
      remainingDuration: 1000,
      intervalDuration: 500,
      isRunning: false
    }
  ]

  const findTimersByUserId = userId => {
    findTimersByUserIdCalled = true
    findTimersByUserIdArg = userId
    return testTimers
  }

  const userId = "1"
  const timersPromise = core.getTimersByUserIdUseCase(userExists)(findTimersByUserId)(userId)

  describe('happy path', () => {

    it('should return a function after passing userExists', () => {
      expect(core.getTimersByUserIdUseCase(userExists)).to.be.a('function')
    })

    it('should return a function after passing findTimersByUserId', () => {
      expect(core.getTimersByUserIdUseCase(userExists)(findTimersByUserId)).to.be.a('function')
    })

    it('should call userExists', () => {
      userExistsCalled.should.equal(true)
    })

    describe('if userExists returns false', () => {
      it('should return an empty array', () => {
        const userExistsFalse = () => false
        const blankArrayPromise = core.getTimersByUserIdUseCase(userExistsFalse)(findTimersByUserId)(userId)
        return blankArrayPromise.should.eventually.deep.equal([])
      })
    })

    it('should call findTimersByUserId', () => {
      findTimersByUserIdCalled.should.equal(true)
    })

    it('should pass userId arg to userExists', () => {
      userExistsArg.should.equal(userId)
    })

    it('should pass userId to findTimersByUserId', () => {
      findTimersByUserIdArg.should.equal(userId)
    })

    it('should return timers', () => {
      return timersPromise.should.eventually.deep.equal(testTimers)
    })

  })

  describe('error path', () => {

    describe('when userExists is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.getTimersByUserIdUseCase('userExists')).to.throw(TypeError)
      })
    })

    describe('when findTimersByUserId is not a func', () => {
      it('should throw a new type error', () => {
        expect(() => core.getTimersByUserIdUseCase(userExists)("findTimersByUserId")).to.throw(TypeError)
      })
    })

    describe('when userId is not of type string', () => {
      it('should throw a type error', () => {
        const promise = core.getTimersByUserIdUseCase(userExists)(findTimersByUserId)(1)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when userExists fails', () => {
      it('should throw an error', () => {
        const badUserExists = () => {throw new TypeError}
        const promise = core.getTimersByUserIdUseCase(badUserExists)(findTimersByUserId)(userId)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when findTimersByUserId fails', () => {
      it('should throw an error', () => {
        const badFindTimersByUserId = () => {throw new Error}
        const promise = core.getTimersByUserIdUseCase(userExists)(badFindTimersByUserId)(userId)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when timers is not an array', () => {
      it('should throw a TypeError', () => {
        const badFindTimersByUserId = () => ({})
        const promise = core.getTimersByUserIdUseCase(userExists)(badFindTimersByUserId)(userId)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

  })

})

describe('start timer use case', () => {
  describe('happy path', () => {

    let findTimerByIdCalled = false
    let findTimerByIdArg = ""
    const findTimerById = id => {
      findTimerByIdCalled = true
      findTimerByIdArg = id
      return {
        id: "1",
        name: "timer",
        duration: 1000,
        remainingDuration: 1000,
        intervalDuration: 1000,
        isRunning: false
      }
    }

    let saveTimerCalled = false
    let saveTimerArg = {}
    const saveTimer = timer => {
      saveTimerCalled = true
      saveTimerArg = timer
    }

    const startedTimerPromise = core.startTimerUseCase(findTimerById)(saveTimer)("1")

    it('should call findTimerById', () => {
      findTimerByIdCalled.should.equal(true)
    })

    it('should pass id to findTimerById', () => {
      findTimerByIdArg.should.equal("1")
    })

    it('should call saveTimer', () => {
      saveTimerCalled.should.equal(true)
    })

    it('should pass started timer to saveTimer', () => {
     return startedTimerPromise.should.eventually.deep.equal(saveTimerArg)
    })

    it('should return an object', () => {
      return startedTimerPromise.should.eventually.be.an('object')
    })

    it('should have id prop equal to id arg', () => {
      return startedTimerPromise.should.eventually.have.property("id").equal("1")
    })

    it('should have isRunning prop equal true', () => {
      return startedTimerPromise.should.eventually.have.property("isRunning").equal(true)
    })

  })

  describe('error path', () => {

    const findTimerById = () => {}
    const saveTimer = () => {}

    describe('when findTimerById is not a function', () => {
      it('should throw a type error', () => {
        expect(() => core.startTimerUseCase('findTimerById')).to.throw(TypeError)
      })
    })

    describe('when saveTimer is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.startTimerUseCase(findTimerById)('saveTimer')).to.throw(TypeError)
      })
    })

    describe('when id is not of type string', () => {
      it('should throw a type error', () => {
        const promise = core.startTimerUseCase(findTimerById)(saveTimer)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        const promise = core.startTimerUseCase(badFindTimerById)(saveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when saveTimer fails', () => {
      it('should throw an error', () => {
        const badSaveTimer = () => {throw new Error}
        const promise = core.startTimerUseCase(findTimerById)(badSaveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

  })
})

describe('stop timer use case', () => {
  
  describe('happy path', () => {

    let findTimerByIdCalled = false
    let findTimerByIdArg = ""
    const findTimerById = id => {
      findTimerByIdCalled = true
      findTimerByIdArg = id
      return {
        id: "1",
        duration: 1000,
        name: "timer",
        remainingDuration: 1000,
        intervalDuration: 1000,
        isRunning: true
      }
    }

    let saveTimerCalled = false
    let saveTimerArg = {}
    const saveTimer = timer => {
      saveTimerCalled = true
      saveTimerArg = timer
    }

    const stoppedTimerPromise = core.stopTimerUseCase(findTimerById)(saveTimer)("1")
    
    it('should return a function after receiving findTimerById', () => {
      core.stopTimerUseCase(findTimerById).should.be.a('function')
    })

    it('should return a function after receiving saveTimer', () => {
      core.stopTimerUseCase(findTimerById)(saveTimer).should.be.a('function')
    })

    it('should call findTimerById', () => {
      findTimerByIdCalled.should.equal(true)
    })

    it('should pass id arg to findTimerById', () => {
      findTimerByIdArg.should.equal("1")
    })

    it('should call saveTimer', () => {
      saveTimerCalled.should.equal(true)
    })

    it('should pass timer to saveTimer', () => {
      return stoppedTimerPromise.should.eventually.deep.equal(saveTimerArg)
    })

    it('should return an object', () => {
      return stoppedTimerPromise.should.eventually.be.an('object')
    })

    it('should have same id as id arg', () => {
      return stoppedTimerPromise.should.eventually.have.property('id').equal("1")
    })

    it('should have isRunning equal false', () => {
      return stoppedTimerPromise.should.eventually.have.property('isRunning').equal(false)
    })

  })

  describe('error path', () => {

    const findTimerById = () => {}
    const saveTimer = () => {}

    describe('when findTimerById is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.stopTimerUseCase("findTimerById")).to.throw(TypeError)
      })
    })

    describe('when saveTimer is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.stopTimerUseCase(findTimerById)("saveTimer")).to.throw(TypeError)
      })
    })

    describe('when id is not a string', () => {
      it('should throw a TypeError', () => {
        const promise = core.stopTimerUseCase(findTimerById)(saveTimer)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        const promise = core.stopTimerUseCase(badFindTimerById)(saveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when saveTimer fails', () => {
      it('should throw an error', () => {
        const badSaveTimer = () => {throw new Error}
        const promise = core.stopTimerUseCase(findTimerById)(badSaveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })    

  })

})

describe('decrement timer use case', () => {
  
  describe('happy path', () => {

    let findTimerByIdCalled = false
    let findTimerByIdArg = ""
    const findTimerById = id => {
      findTimerByIdCalled = true
      findTimerByIdArg = id
      return {
        id: "1",
        name: "timer",
        duration: 1000,
        remainingDuration: 1000,
        intervalDuration: 1000,
        isRunning: true
      }
    }

    let saveTimerCalled = false
    let saveTimerArg = {}
    const saveTimer = timer => {
      saveTimerCalled = true
      saveTimerArg = timer
    }

    const decrementedTimerPromise = core.decrementTimerUseCase(findTimerById)(saveTimer)("1")

    it('should return a function after receving findTimerById', () => {
      core.decrementTimerUseCase(findTimerById).should.be.a('function')
    })

    it('should return a function after receving saveTimer', () => {
      core.decrementTimerUseCase(findTimerById)(saveTimer).should.be.a('function')
    })

    it('should call findTimerById', () => {
      findTimerByIdCalled.should.equal(true)
    })

    it('should pass id to findTimerById', () => {
      findTimerByIdArg.should.equal("1")
    })

    it("should call saveTimer", () => {
      saveTimerCalled.should.equal(true)
    })

    it("should pass timer to saveTimer", () => {
      return decrementedTimerPromise.should.eventually.deep.equal(saveTimerArg)
    })

    it('should return an object', () => {
      return decrementedTimerPromise.should.eventually.be.an('object')
    })

    it('should have an id equal to id arg', () => {
      return decrementedTimerPromise.should.eventually.have.property("id").equal("1")
    })

    it('should have remainingDuration equal to remainingDuration minus intervalDuration', () => {
      const timer = findTimerById()
      return decrementedTimerPromise.should.eventually.have.property('remainingDuration').equal(timer.remainingDuration - timer.intervalDuration)
    })
    
  })

  describe('error path', () => {

    const findTimerById = () => {}
    const saveTimer = () => {}

    describe('when findTimerById is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.decrementTimerUseCase("findTimerById")).to.throw(TypeError)
      })
    })

    describe('when saveTimer is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.decrementTimerUseCase(findTimerById)("saveTimer")).to.throw(TypeError)
      })
    })

    describe('when id is not a string', () => {
      it('should throw a TypeError', () => {
        const promise = core.decrementTimerUseCase(findTimerById)(saveTimer)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        const promise = core.decrementTimerUseCase(badFindTimerById)(saveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when saveTimer fails', () => {
      it('should throw an error', () => {
        const badSaveTimer = () => {throw new Error}
        const promise = core.decrementTimerUseCase(findTimerById)(badSaveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('reset timer use case', () => {
  
  describe('happy path', () => {

    let findTimerByIdCalled = false
    let findTimerByIdArg = ""
    const findTimerById = id => {
      findTimerByIdCalled = true
      findTimerByIdArg = id
      return {
        id: "1",
        name: "timer",
        duration: 1000,
        remainingDuration: 100,
        intervalDuration: 1000,
        isRunning: true
      }
    }

    let saveTimerCalled = false
    let saveTimerArg = {}
    const saveTimer = timer => {
      saveTimerCalled = true
      saveTimerArg = timer
    }

    const resetTimerPromise = core.resetTimerUseCase(findTimerById)(saveTimer)("1")
  
    it('should return a function after receving findTimerById', () => {
      core.resetTimerUseCase(findTimerById).should.be.a('function')
    })

    it('should return a function after receving saveTimer', () => {
      core.resetTimerUseCase(findTimerById)(saveTimer).should.be.a('function')
    })

    it('should call findTimerById', () => {
      findTimerByIdCalled.should.equal(true)
    })

    it('should pass id to findTimerById', () => {
      findTimerByIdArg.should.equal("1")
    })

    it('should call saveTimer', () => {
      saveTimerCalled.should.equal(true)
    })

    it('should pass resetTimer to saveTimer', () => {
      return resetTimerPromise.should.eventually.deep.equal(saveTimerArg)
    })

    it('should return an object', () => {
      return resetTimerPromise.should.eventually.be.an('object')
    })

    it('should have id equal to id arg', () => {
      return resetTimerPromise.should.eventually.have.property('id').equal("1")
    })

    it('should have remainingDuration equal to duration', () => {
      const timer = findTimerById()
      return resetTimerPromise.should.eventually.have.property('remainingDuration').equal(timer.duration)
    })

  })

  describe('error path', () => {

    const findTimerById = () => {}
    const saveTimer = () => {}

    describe('when findTimerById is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.resetTimerUseCase("findTimerById")).to.throw(TypeError)
      })
    })

    describe('when saveTimer is not a function', () => {
      it('should throw a TypeError', () => {
        expect(() => core.resetTimerUseCase(findTimerById)("saveTimer")).to.throw(TypeError)
      })
    })

    describe('when id is not a string', () => {
      it('should throw a TypeError', () => {
        const promise = core.resetTimerUseCase(findTimerById)(saveTimer)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        const promise = core.resetTimerUseCase(badFindTimerById)(saveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when saveTimer fails', () => {
      it('should throw an error', () => {
        const badSaveTimer = () => {throw new Error}
        const promise = core.resetTimerUseCase(findTimerById)(badSaveTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('update timer use case', () => {

  const timer = {
    id: "1",
    name: "timer",
    duration: 1000,
    remainingDuration: 1000,
    intervalDuration: 500,
    isRunning: false
  }

  const updatePropsObj = {intervalDuration: 200}

  let findTimerByIdCalled = false
  let findTimerByIdArg = ""
  const findTimerById = id => {
    findTimerByIdCalled = true
    findTimerByIdArg = id
    return timer
  }

  let saveTimerCalled = false
  let saveTimerArg = {}
  const saveTimer = timer => {
    saveTimerCalled = true
    saveTimerArg = timer
  }

  const id = "1"
  const updatedTimerPromise = core.updateTimerUseCase(findTimerById)(saveTimer)(id, updatePropsObj)

  describe('happy path', () => {

    it('should return a function after receiving findTimerById', () => {
      core.updateTimerUseCase(findTimerById).should.be.a('function')
    })

    it('should call findTimerById', () => {
      findTimerByIdCalled.should.equal(true)
    })

    it('should pass id to findTimerById', () => {
      findTimerByIdArg.should.equal(id)
    })

    it('should return a function after receiving saveTimer', () => {
      core.updateTimerUseCase(findTimerById)(saveTimer).should.be.a('function')
    })

    it('should call saveTimer', () => {
      saveTimerCalled.should.equal(true)
    })

    it('should pass updatedTimer to saveTimer', () => {
      return updatedTimerPromise.should.eventually.deep.equal(saveTimerArg)
    })

    it('should return a timer with the updatePropsObj merged in', () => {
      return updatedTimerPromise.should.eventually.deep.equal(Object.assign({}, timer, updatePropsObj))
    })

  })

  describe("edge cases", () => {

    describe("when the timer's duration is updated to a value less than the remaining duration", () => {

      it("should set the remainingDuration equal to the new duration value", () => {
        const findTimerById = id => timer
        const saveTimer = () => {}
        const id = "1"
        const updateDurationObj = {duration: 500}
        const updatedTimerPromise = core.updateTimerUseCase(findTimerById)(saveTimer)(id, updateDurationObj)
        return updatedTimerPromise.should.eventually.deep.equal(Object.assign({}, timer, {duration: 500, remainingDuration: 500}))
      })

    })

  })

  describe('error path', () => {

    const updateTimerUseCaseWithDeps = core.updateTimerUseCase(findTimerById)(saveTimer)

    describe('when findTimerById is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerUseCase('findTimerById')).to.throw(TypeError)
      })
    })

    describe('when saveTimer is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerUseCase(findTimerById)('saveTimer')).to.throw(TypeError)
      })
    })

    describe('when id is not a string', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerUseCaseWithDeps(1, updatePropsObj)).to.throw(TypeError)
      })
    })

    describe('when updatePropsObj is not an object', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerUseCaseWithDeps(id, "updatePropsObj")).to.throw(TypeError)
      })
    })

    describe('when updatePropsObj is an array', () => {
      it('should throw a type error', () => {
        expect(() => core.updateTimerUseCaseWithDeps(id, [updatePropsObj])).to.throw(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        const promise = core.updateTimerUseCase(badFindTimerById)(saveTimer)(id, updatePropsObj)
        return promise.should.be.rejectedWith(Error)
      })
    })

    describe('when updatePropsObj has id key', () => {
      it('should throw an error', () => {
        const badUpdatePropsObj = {id: "1"}
        expect(() => core.updateTimerUseCaseWithDeps(id, badUpdatePropsObj)).to.throw()
      })
    })

    describe('when updatePropsObj has remainingDuration key', () => {
      it('should throw an error', () => {
        const badUpdatePropsObj = {remainingDuration: 1}
        expect(() => core.updateTimerUseCaseWithDeps(id, badUpdatePropsObj)).to.throw()
      })
    })

    describe('when updatePropsObj has isRunning key', () => {
      it('should throw an error', () => {
        const badUpdatePropsObj = {isRunning: true}
        expect(() => core.updateTimerUseCaseWithDeps(id, badUpdatePropsObj)).to.throw()
      })
    })

    describe('when updatePropsObj has userId key', () => {
      it('should throw an error', () => {
        const badUpdatePropsObj = {userId: "1"}
        expect(() => core.updateTimerUseCaseWithDeps(id, badUpdatePropsObj)).to.throw()
      })
    })

    describe('when updatePropsObj has key that doesnt exist on timer', () => {
      it('should throw an error', () => {
        const badUpdatePropsObj = {foo: "bar"}
        expect(() => core.updateTimerUseCaseWithDeps(id, badUpdatePropsObj)).to.throw()
      })
    })

    describe('when updatePropsObj has value that is of different type than value for corresponding key on timer', () => {
      it('should throw a type error', () => {
        const badUpdatePropsObj = {duration: {}}
        expect(() => core.updateTimerUseCaseWithDeps(id, badUpdatePropsObj)).to.throw(TypeError)
      })
    })

    describe('when saveTimer fails', () => {
      it('should throw an error', () => {
        const badSaveTimer = () => {throw new Error}
        const promise = core.updateTimerUseCase(findTimerById)(badSaveTimer)(id, updatePropsObj)
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})

describe('delete timer use case', () => {

  let deleteTimerCalled = false
  let deleteTimerArg = ""
  const deleteTimer = id => {
    deleteTimerCalled = true
    deleteTimerArg = id
  }

  const id = "1"
  const deletedTimerPromise = core.deleteTimerUseCase(deleteTimer)(id)

  describe('happy path', () => {

    it('should return a function after receiving deleteTimer', () => {
      core.deleteTimerUseCase(deleteTimer).should.be.a('function')
    })

    it('should call deleteTimer', () => {
      deleteTimerCalled.should.equal(true)
    })

    it('should pass timerId to deleteTimer', () => {
      deleteTimerArg.should.equal(id)
    })

    it('should return null', () => {
      return deletedTimerPromise.should.eventually.be.a('null')
    })

  })

  describe('error path', () => {

    describe('when deleteTimer is not a func', () => {
      it('should throw a type error', () => {
        expect(() => core.deleteTimerUseCase("deleteTimer")).to.throw(TypeError)
      })
    })

    describe('when id is not a string', () => {
      it('should throw a type error', () => {
        const promise = core.deleteTimerUseCase(deleteTimer)(1)
        return promise.should.be.rejectedWith(TypeError)
      })
    })

    describe('when deleteTimer fails', () => {
      it('should throw an error', () => {
        const badDeleteTimer = () => {throw new Error}
        const promise = core.deleteTimerUseCase(badDeleteTimer)("1")
        return promise.should.be.rejectedWith(Error)
      })
    })

  })

})