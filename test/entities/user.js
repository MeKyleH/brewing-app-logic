const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe('user entity factory function', () => {

  const userName = "testUser"
  const hashedPassword = "hashedpassword"
  const email = "user@example.com"

  describe('happy path', () => {

    const user = core.userEntity(userName, hashedPassword, email)

    it('should return an object', () => {
      user.should.be.an('object')
    })

    it('should have string property id', () => {
      user.should.have.property('id')
      user.id.should.be.a('string')
    })

    it('should generate unique ids', () => {
      const user2 = core.userEntity('testUser2', 'password', 'email@email.com')
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

    it('should have string property email', () => {
      user.email.should.be.a('string')
    })

    it('should set emal equal to email arg', () => {
      user.email.should.equal(email)
    })

  })

  describe('error path', () => {

    describe('when userName is empty', () => {
      it('should throw an error', () => {
        expect(() => core.userEntity('', hashedPassword, email)).to.throw()
      })
    })

    describe('when userName is wrong type', () => {
      it('should throw a type error', () => {
        expect(() => core.userEntity(2, hashedPassword, email)).to.throw(TypeError)
      })
    })

    describe('when hashedPassword is empty', () => {
      it('should throw an error', () => {
        expect(() => core.userEntity(userName, '', email)).to.throw()
      })
    })

    describe('when hashedPassword is of wrong type', () => {
      it('should throw a type error', () => {
        expect(() => core.userEntity(userName, 12345678, email)).to.throw(TypeError)
      })
    })

    describe('when email is empty', () => {
      it('should throw an error', () => {
        expect(() => core.userEntity(userName, hashedPassword, "")).to.throw()
      })
    })
    
    describe('when email is wrong type', () => {
      it('should throw a TypeError', () => {
        expect(() => core.userEntity(userName, hashedPassword, 1)).to.throw(TypeError)
      })
    })

  })
})