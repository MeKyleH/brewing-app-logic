const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe.only('inventory use cases', () => {

  describe('create inventory use case', () => {

    let createInventoryCalled = false
    let createInventoryArg = {}
    const createInventory = inventoryArg => {
      createInventoryCalled = true
      createInventoryArg = inventoryArg
    }

    const name = "test inventory"
    const userId = "1"
    const inventory = core.createInventoryUseCase(createInventory)(name, userId)

    describe('happy path', () => {

      it('should return a function after accepting createInventory', () => {
        core.createInventoryUseCase(createInventory).should.be.a('function')
      })

      it('should call createInventory function', () => {
        createInventoryCalled.should.equal(true)
      })

      it('should return an object', () => {
        inventory.should.be.an('object')
      })

      it('should return obj with property name equal to arg name', () => {
        inventory.name.should.equal(name)
      })

      it('should return obj with property userId equal to arg userId', () => {
        inventory.userId.should.equal(userId)
      })

      it('should reutrn obj with string property id', () => {
        inventory.should.have.property('id')
      })

      it('should return unique ids', () => {
        const inventory2 = core.createInventoryUseCase(createInventory)(name, userId)
        inventory2.id.should.not.equal(inventory.id)
      })

      it('should have empty array property items', () => {
        inventory.items.should.be.an('array')
        inventory.items.length.should.equal(0)
      })

      it('should pass created inventory to createInventory', () => {
        const testInventory = core.createInventoryUseCase(createInventory)(name, userId)
        createInventoryArg.should.deep.equal(testInventory)
      })

    })

    describe('error path', () => {

      describe('when createInventory is not a function', () => {
        it('should throw a type error', () => {
          expect(core.createInventoryUseCase("createUser")).to.throw(TypeError)
        })
      })

      describe('when name is not of type string', () => {
        it('should throw a type error', () => {
          expect(() => core.createInventoryUseCase(createInventory)(1, userId)).to.throw(TypeError)
        })
      })

      describe('when userId is not of type string', () => {
        it('should throw a type error', () => {
          expect(() => core.createInventoryUseCase(createInventory)(name, 1)).to.throw(TypeError)
        })
      })

      describe('when createInventory fails', () => {
        it('should throw an error', () => {
          const badCreateInventory = () => {throw new Error}
          expect(() => core.createInventoryUseCase(badCreateInventory)(name, userId)).to.throw()
        })
      })

    })

  })

})