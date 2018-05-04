const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe('user use cases', () => {

  describe('createUser use case', () => {

    let createUserCalled = false
    let createdUser = {}
    const usernames = []
    const createUser = async user => {
      createUserCalled = true
      createdUser = user
      usernames.push(user.userName)
    }

    let isUserNameUniqueCalled = false
    let isUserNameUniqueArg = ""
    const isUserNameUnique = userName =>{
      isUserNameUniqueCalled = true
      isUserNameUniqueArg = userName
      return !usernames.includes(userName)
    }

    let isEmailUniqueCalled = false
    let isEmailUniqueArg = ""
    const isEmailUnique = email => {
      isEmailUniqueCalled = true
      isEmailUniqueArg = email
      return true
    }

    let hashPasswordCalled = false
    let hashPasswordPassedArg = ""
    const hashPassword = password => {
      hashPasswordCalled = true
      hashPasswordPassedArg = password
      return "hashedPassword"
    }

    const userName = "testUser"
    const password = "password"
    const email = "email@example.com"
    const userPromise = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)(hashPassword)(userName, password, email)

    describe('happy path', () => {

      it('should return a function after isEmailUnique is injected', () => {
        core.createUserUseCase(isUserNameUnique)(isEmailUnique).should.be.a('function')
      })

      it('should call isEmailUnique injected dependency', () => {
        isEmailUniqueCalled.should.equal(true)
      })

      it('should pass email to isEmailUnique', () => {
        isEmailUniqueArg.should.equal(email)
      })

      it('should create a function after createUser is injected', () => {
        core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser).should.be.a('function')
      })

      it('should call isUserNameUnique injected dependency', () => {
        isUserNameUniqueCalled.should.equal(true)
      })

      it('should pass userName to isUserNameUnique', () => {
        isUserNameUniqueArg.should.equal(userName)
      })

      it('should call hashPassword injected dependency', () => {
        hashPasswordCalled.should.equal(true)
      })

      it('should pass password to hashPassword dependency', () => {
        hashPasswordPassedArg.should.equal(password)
      })

      it('should call createUser injected dependency', () => {
        createUserCalled.should.equal(true)
      })

      it('should pass created user to createUser', () => {
        return userPromise.should.eventually.deep.equal(createdUser)
      })

      it('should return an object', () => {
        return userPromise.should.eventually.be.an('object')
      })

      it('should have string property id', () => {
        return userPromise.should.eventually.have.property('id').be.a('string')
      })

      it('should generate unique ids', async () => {
        const user = await userPromise
        const userPromise2 = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)(hashPassword)('testUser2', 'password', "me@me.com")
        return userPromise2.should.eventually.have.property("id").not.equal(user.id)
      })

      it('should have string property userName', () => {
        return userPromise.should.eventually.have.property('userName').be.a('string')
      })

      it('should set userName equal to userName arg', () => {
        return userPromise.should.eventually.have.property('userName').equal(userName)
      })

      it('should have string property hashedPassword', () => {
        return userPromise.should.eventually.have.property('hashedPassword').be.a('string')
      })

      it('should not have password saved in cleartext', () => {
        return userPromise.should.eventually.have.property("hashedPassword").not.equal(password)
      })

      it('should have string property email', () => {
        return userPromise.should.eventually.have.property('email').be.a('string')
      })

      it('should have email property equal email arg', () => {
        return userPromise.should.eventually.have.property('email').equal(email)
      })

    })

    describe('error path', () => {

      describe('when isUserNameUnique is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.createUserUseCase("isUserNameUnique")).to.throw(TypeError)
        })
      })

      describe('when isEmailUnique is not a func', () => {
        it('should throw a TypeError', () => {
          expect(() => core.createUserUseCase(isUserNameUnique)("isEmailUnique")).to.throw(TypeError)
        })
      })

      describe('when createUser is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.createUserUseCase(isUserNameUnique)(isEmailUnique)("createUser")(hashPassword)).to.throw(TypeError)
        })
      })

      describe('when hashPassword is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)("hashPassword")).to.throw(TypeError)
        })
      })

      describe('when userName is the wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)(hashPassword)(1, password, email)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when userName is not unique', () => {
        it('should throw an error', () => {
          const promise = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)(hashPassword)(userName, password, email)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when email is not unique', () => {
        it('should throw an error', () => {
          const promise = core.createUserUseCase(isUserNameUnique)(() => false)(createUser)(hashPassword)("new user", password, email)
        })
      })

      describe('when password is the wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)(hashPassword)(userName, 1, email)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when isUserNameUnique fails', () => {
        it('should throw an error', () => {
          const badIsUsernameUnique = () => {throw new Error}
          const promise = core.createUserUseCase(badIsUsernameUnique)(isEmailUnique)(createUser)(hashPassword)(userName, password, email)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when isEmailUnique fails', () => {
        it('should throw an error', () => {
          const badIsEmailUnique = () => {throw new Error}
          const promise = core.createUserUseCase(isUserNameUnique)(badIsEmailUnique)(createUser)(hashPassword)(userName, password, email)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when createUser fails', () => {
        it('should throw an error', () => {
          const badCreateUser = () => {throw new Error}
          const promise = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(badCreateUser)(hashPassword)(userName, password, email)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when hashPassword fails', () => {
        it('should throw an error', () => {
          const basHashPassword = () => {throw new Error}
          const promise = core.createUserUseCase(isUserNameUnique)(isEmailUnique)(createUser)(basHashPassword)(userName, password, email)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('getUser use case', () => {

    let findUserByIdCalled = false
    let findUserByIdArg = ""

    const testUser = {
      id: "1",
      userName: "testUser",
      hashedPassword: "hashedPassword"
    }
    
    const findUserById = userId => {
      findUserByIdCalled = true
      findUserByIdArg = userId
      return testUser
    }

    const userId = "1"
    const userPromise = core.getUserUseCase(findUserById)(userId)

    describe('happy path', () => {

      it('should return a function after passing findUserById', () => {
        core.getUserUseCase(findUserById).should.be.a('function')
      })

      it('should call findUserById', () => {
        findUserByIdCalled.should.equal(true)
      })

      it('should pass userId arg to findUserById', () => {
        findUserByIdArg.should.equal(userId)
      })

      it('should return user whose id matches userId', () => {
        return userPromise.should.eventually.deep.equal(testUser)
      })

    })

    describe('error path', () => {

      describe('when findUserById is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.getUserUseCase("findUserById")).to.throw(TypeError)
        })
      })

      describe('when userId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.getUserUseCase(findUserById)(1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when findUserById fails', () => {
        it('should throw an error', () => {
          const badFindUserById = () => {throw new Error}
          const promise = core.getUserUseCase(badFindUserById)(userId)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('updateUser use case', () => {

    const testUser = {
      id: "1",
      userName: "testUser",
      password: "password"
    }

    let findUserByIdCalled = false
    let passedUserId = ""
    
    const findUserById = userId => {
      findUserByIdCalled = true
      passedUserId = userId
      return testUser
    }

    let saveUserCalled = false
    let savedUser = {}

    const saveUser = user => {
      saveUserCalled = true
      savedUser = user
    }

    const userId = "1"
    const updatePropsObj = {userName: "testUser2"}
    const updatedUserPromise = core.updateUserUseCase(findUserById)(saveUser)(userId, updatePropsObj)

    describe('happy path', () => {

      it('should return a func after passing findUserById', () => {
        core.updateUserUseCase(findUserById).should.be.a('function')
      })

      it('should return a func after passing saveUser', () => {
        core.updateUserUseCase(findUserById)(saveUser).should.be.a('function')
      })

      it('should call findUserById func dependency', () => {
        findUserByIdCalled.should.equal(true)
      })

      it('should pass userId arg to findUserById', () => {
        passedUserId.should.equal(userId)
      })

      it('should call saveUser func dependency', () => {
        saveUserCalled.should.equal(true)
      })

      it('should pass updatedUser to saveUser', () => {
        return updatedUserPromise.should.eventually.deep.equal(savedUser)
      })

      it('should make a copy of found user merging updatePropsObj arg', () => {
        const clonedUser = Object.assign({}, testUser, updatePropsObj)
        return updatedUserPromise.should.eventually.deep.equal(clonedUser)
      })

    })

    describe('error path', () => {

      describe('when findUserById is wrong type', () => {
        it('should throw a type error', () => {
          expect(() => core.updateUserUseCase('findUserById')).to.throw(TypeError)
        })
      })

      describe('when saveUser is wrong type', () => {
        it('should throw a type error', () => {
          expect(() => core.updateUserUseCase(findUserById)('saveUser')).to.throw(TypeError)
        })
      })

      describe('when userId is wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.updateUserUseCase(findUserById)(saveUser)(1, updatePropsObj)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj is wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.updateUserUseCase(findUserById)(saveUser)(userId, "1")
          return promise.should.be.rejectedWith(TypeError)
        })

        describe('when an array', () => {
          it('should throw a type error', () => {
            const promise = core.updateUserUseCase(findUserById)(saveUser)(userId, [])
            return promise.should.be.rejectedWith(TypeError)
          })
        })

      })

      describe('when updatePropsObj tries to update id', () => {
        it('should throw an error', () => {
          const promise = core.updateUserUseCase(findUserById)(saveUser)(userId, {id: "2"})
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when updatePropsObj tries to update props not on user', () => {
        it('should throw an error', () => {
          const promise = core.updateUserUseCase(findUserById)(saveUser)(userId, {foo: "bar"})
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when updatePropsObj tires to update props of wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.updateUserUseCase(findUserById)(saveUser)(userId, {userName: 2})
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when findUserById throws an error', () => {
        it('should throw an error', () => {
          const findUserByIdError = () => {throw new Error}
          const promise = core.updateUserUseCase(findUserByIdError)(saveUser)(userId, updatePropsObj)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when saveUser throws an error', () => {
        it('should throw an error', () => {
          const saveUserError = () => {throw new Error}
          const promise = core.updateUserUseCase(findUserById)(saveUserError)(userId, updatePropsObj)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('authenticate user use case', () => {

    const user = {
      id: "1",
      userName: "testUser",
      hashedPassword: "hashedPassword"
    }

    let findUserByUsernameCalled = false
    let findUserByUsernameArg = ""
    const findUserByUsername = userName => {
      findUserByUsernameCalled = true
      findUserByUsernameArg = userName
      return user
    }

    let hashPasswordCalled = false
    let hashPasswordArg = ""
    const hashPassword = password => {
      hashPasswordCalled = true
      hashPasswordArg = password
      if(password === 'badPassword'){
        return "badHash"
      }else{
        return "hashedPassword"
      }
    }

    const userName = "userName"
    const password = "password"

    const authenticatedUserPromise = core.authenticateUserUseCase(findUserByUsername)(hashPassword)(userName, password)

    describe('happy path', () => {

      it('should return a function after passing findUserByUsername', () => {
        core.authenticateUserUseCase(findUserByUsername).should.be.a('function')
      })

      it('should return a function after passing hashPassword', () => {
        core.authenticateUserUseCase(findUserByUsername)(hashPassword).should.be.a("function")
      })

      it('should call findUserById injected dependency', () => {
        findUserByUsernameCalled.should.equal(true)
      })

      it('should pass userId to findUserById', () => {
        findUserByUsernameArg.should.equal(userName)
      })

      it('should call hashPassword injected dependency', () => {
        hashPasswordCalled.should.equal(true)
      })

      it('should pass password arg to hashPassword', () => {
        hashPasswordArg.should.equal(password)
      })

      it('should return the user with the matching id', () => {
        return authenticatedUserPromise.should.eventually.deep.equal(user)
      })

    })

    describe('bad password path', () => {

      it('should return an error if the wrong password is given', () => {
        expect(() => core.authenticateUserUseCase(findUserByUsername)(hashPassword)(userId, "badPassword")).to.throw()
      })

    })

    describe('error path', () => {

      describe('when findUserByUsername is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.authenticateUserUseCase("badFindUser")).to.throw(TypeError)
        })
      })

      describe('when hashPassword is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.authenticateUserUseCase(findUserByUsername)("badHash")).to.throw(TypeError)
        })
      })

      describe('when userName is of wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.authenticateUserUseCase(findUserByUsername)(hashPassword)(1, password)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when password is of wrong type', () => {
        it('should throw a type error', () => {
          const promise = core.authenticateUserUseCase(findUserByUsername)(hashPassword)(userName, 1234)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when findUserByUsername fails', () => {
        it('should throw an error', () => {
          const badFindUser = () => {throw new Error}
          expect(() => core.authenticateUserUseCase(badFindUser)(hashPassword)(userId, password)).to.throw()
        })
      })

      describe('when hashPassword fails', () => {
        it('should throw an error', () => {
          const badHashPassword = () => {throw new Error}
          expect(() => core.authenticateUserUseCase(findUserByUsername)(badHashPassword)(userId, password)).to.throw()
        })
      })

    })

  })

  describe('delete user use case', () => {

    let deleteUserCalled = false
    let deleteUserIdArg = ""
    const deleteUser = userId => {
      deleteUserCalled = true
      deleteUserIdArg = userId
    }

    const userId = "1"
    const deletedUserPromise = core.deleteUserUseCase(deleteUser)(userId)

    describe('happy path', () => {

      it('should return a function after deleteUser is passed', () => {
        core.deleteUserUseCase(deleteUser).should.be.a('function')
      })

      it('should call a delete user injected dependency', () => {
        deleteUserCalled.should.equal(true)
      })

      it('should pass userId arg to deleteUser', () => {
        deleteUserIdArg.should.equal(userId)
      })

      it('should return null after deletion', () => {
        return deletedUserPromise.should.eventually.be.a('null')
      })

    })

    describe('error path', () => {

      describe('when deleteUser is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.deleteUserUseCase("deleteUser")).to.throw(TypeError)
        })
      })

      describe('when userId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.deleteUserUseCase(deleteUser)(1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when deleteUser fails', () => {
        it('should throw an error', () => {
          const badDeleteUser = () => {throw new Error}
          const promise = core.deleteUserUseCase(badDeleteUser)(userId)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

})