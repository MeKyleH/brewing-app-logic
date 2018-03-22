const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe('user use cases', () => {

  describe('createUser use case', () => {

    let createUserCalled = false
    let createdUser = {}
    const createUser = user => {
      createUserCalled = true
      createdUser = user
    }
    const userName = "testUser"
    const hashedPassword = "hashedPassword"
    const user = core.createUserUseCase(createUser)(userName, hashedPassword)

    describe('happy path', () => {

      it('should create a function after createUser is injected', () => {
        core.createUserUseCase(createUser).should.be.a('function')
      })

      it('should call createUser injected dependency', () => {
        createUserCalled.should.equal(true)
      })

      it('should pass created user to createUser', () => {
        createdUser.should.deep.equal(user)
      })

      it('should return an object', () => {
        user.should.be.an('object')
      })

      it('should have string property id', () => {
        user.should.have.property('id')
        user.id.should.be.a('string')
      })

      it('should generate unique ids', () => {
        const user2 = core.createUserUseCase(createUser)('testUser2', 'password')
        user2.id.should.not.equal(user.id)
      })

      it('should have string property userName', () => {
        user.should.have.property('userName')
        user.userName.should.be.a('string')
      })

      it('should set userName equal to userName arg', () => {
        user.userName.should.equal(userName)
      })

      it('should have string property hashedPassword', () => {
        user.should.have.property('hashedPassword')
        user.hashedPassword.should.be.a('string')
      })

      it('should set hashedPassword equal to hashedPassword arg', () => {
        user.hashedPassword.should.equal(hashedPassword)
      })

    })

    describe('error path', () => {

      describe('when createUser is not a func', () => {
        it('should throw a type error', () => {
          expect(core.createUserUseCase("createUser")).to.throw(TypeError)
        })
      })

      describe('when userName is the wrong type', () => {
        it('should throw a type error', () => {
          expect(() => core.createUserUseCase(createUser)(1, hashedPassword)).to.throw(TypeError)
        })
      })

      describe('when hashedPassword is the wrong type', () => {
        it('should throw a type error', () => {
          expect(() => core.createUserUseCase(createUser)(userName, 1)).to.throw(TypeError)
        })
      })

      describe('when createUser fails', () => {
        it('should throw an error', () => {
          const badCreateUser = () => {throw new Error}
          expect(() => core.createUserUseCase(badCreateUser)(userName, hashedPassword)).to.throw()
        })
      })

    })

  })

})