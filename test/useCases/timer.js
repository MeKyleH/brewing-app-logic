const core = require('../../lib')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

describe('create timer use case', () => {
  describe('happy path', () => {
    it('should return timer entity', () => {
      const createTimer = () => console.log("timer created!")
      const userId = "1"
      const timer = core.createTimerUseCase(createTimer)(userId, 1000,1000)
      timer.should.be.an('object')
      timer.should.have.property('id')
      timer.id.should.be.a('string')
      timer.should.have.property('userId')
      timer.userId.should.be.a('string')
      timer.userId.should.equal(userId)
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

describe('getTimer use case', () => {

  const testTimer = {
    id: "1",
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
  const timer = core.getTimerUseCase(findTimerById)(timerId)

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
      timer.should.deep.equal(testTimer)
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
        expect(() => core.getTimerUseCase(findTimerById)(1)).to.throw(TypeError)
      })
    })

    describe('when findTimerById fails', () => {
      it('should throw an error', () => {
        const badFindTimerById = () => {throw new Error}
        expect(() => core.getTimerUseCase(badFindTimerById)(timerId)).to.throw()
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
      duration: 1000,
      remainingDuration: 1000,
      intervalDuration: 500,
      isRunning: false
    },
    {
      id: "2",
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
  const timers = core.getTimersByUserIdUseCase(userExists)(findTimersByUserId)(userId)

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
        const blankArray = core.getTimersByUserIdUseCase(userExistsFalse)(findTimersByUserId)(userId)
        blankArray.should.be.an('array')
        blankArray.length.should.equal(0)
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
      timers.should.deep.equal(testTimers)
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
        expect(() => core.getTimersByUserIdUseCase(userExists)(findTimersByUserId)(1)).to.throw(TypeError)
      })
    })

    describe('when userExists fails', () => {
      it('should throw an error', () => {
        const badUserExists = () => {throw new TypeError}
        expect(() => core.getTimersByUserIdUseCase(badUserExists)(findTimersByUserId)(userId)).to.throw()
      })
    })

    describe('when findTimersByUserId fails', () => {
      it('should throw an error', () => {
        const badFindTimersByUserId = () => {throw new Error}
        expect(() => core.getTimersByUserIdUseCase(userExists)(badFindTimersByUserId)(userId)).to.throw()
      })
    })

    describe('when timers is not an array', () => {
      it('should throw a TypeError', () => {
        const badFindTimersByUserId = () => ({})
        expect(() => core.getTimersByUserIdUseCase(userExists)(badFindTimersByUserId)(userId)).to.throw(TypeError)
      })
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

describe('update timer use case', () => {

  const timer = {
    id: "1",
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
  const updatedTimer = core.updateTimerUseCase(findTimerById)(saveTimer)(id, updatePropsObj)

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
      saveTimerArg.should.deep.equal(updatedTimer)
    })

    it('should return a timer with the updatePropsObj merged in', () => {
      updatedTimer.should.deep.equal(Object.assign({}, timer, updatePropsObj))
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
        expect(() => core.updateTimerUseCase(badFindTimerById)(saveTimer)(id, updatePropsObj)).to.throw()
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
        expect(() => core.updateTimerUseCase(findTimerById)(badSaveTimer)(id, updatePropsObj)).to.throw()
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
  const deletedTimer = core.deleteTimerUseCase(deleteTimer)(id)

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
      should.equal(null, deletedTimer)
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
        expect(() => core.deleteTimerUseCase(deleteTimer)(1)).to.throw(TypeError)
      })
    })

    describe('when deleteTimer fails', () => {
      it('should throw an error', () => {
        const badDeleteTimer = () => {throw new Error}
        expect(() => core.deleteTimerUseCase(badDeleteTimer)("1")).to.throw()
      })
    })

  })

})