const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const core = require('../../lib')

describe('inventory use cases', () => {

  describe('create inventory use case', () => {

    let createInventoryCalled = false
    let createInventoryArg = {}
    const createInventory = async inventoryArg => {
      createInventoryCalled = true
      createInventoryArg = inventoryArg
    }

    const name = "test inventory"
    const userId = "1"
    const inventoryPromise = core.createInventoryUseCase(createInventory)(name, userId)

    describe('happy path', () => {

      it('should return a function after accepting createInventory', () => {
        core.createInventoryUseCase(createInventory).should.be.a('function')
      })

      it('should call createInventory function', () => {
        createInventoryCalled.should.equal(true)
      })

      it('should return an object', () => {
        return inventoryPromise.should.eventually.be.an('object')
      })

      it('should return obj with property name equal to arg name', () => {
        return inventoryPromise.should.eventually.have.property("name").equal(name)
      })

      it('should return obj with property userId equal to arg userId', () => {
        return inventoryPromise.should.eventually.have.property("userId").equal(userId)
      })

      it('should reutrn obj with string property id', () => {
        return inventoryPromise.should.eventually.have.property('id')
      })

      it('should return unique ids', async () => {
        const inventory = await inventoryPromise
        const inventoryPromise2 = core.createInventoryUseCase(createInventory)(name, userId)
        return inventoryPromise2.should.eventually.have.property("id").not.equal(inventory.id)
      })

      it('should have empty array property items', () => {
        return inventoryPromise.should.eventually.have.property("items").deep.equal([])
      })

      it('should pass created inventory to createInventory', () => {
        const testInventoryPromise = core.createInventoryUseCase(createInventory)(name, userId)
        return testInventoryPromise.should.eventually.deep.equal(createInventoryArg)
      })

    })

    describe('error path', () => {

      describe('when createInventory is not a function', () => {
        it('should throw a type error', () => {
          expect(() => core.createInventoryUseCase("createUser")).to.throw(TypeError)
        })
      })

      describe('when name is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.createInventoryUseCase(createInventory)(1, userId)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when userId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.createInventoryUseCase(createInventory)(name, 1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when createInventory fails', () => {
        it('should throw an error', () => {
          const badCreateInventory = () => {throw new Error}
          const promise = core.createInventoryUseCase(badCreateInventory)(name, userId)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('getInventory use case', () => {

    const testInventory = {
      id: "1",
      name: "testInventory",
      userId: "1",
      items: []
    }

    let findInventoryByIdCalled = false
    let findInventoryByIdArg = {}
    const findInventoryById = inventoryId => {
      findInventoryByIdCalled = true
      findInventoryByIdArg = inventoryId
      return testInventory
    }

    const inventoryId = "1"
    const inventoryPromise = core.getInventoryUseCase(findInventoryById)(inventoryId)

    describe('happy path', () => {

      it('should return a function after receiving findInventoryById', () => {
        core.getInventoryUseCase(findInventoryById).should.be.a('function')
      })

      it('should call findInventoryById', () => {
        findInventoryByIdCalled.should.equal(true)
      })

      it('should pass inventoryId arg to findInventoryById', () => {
        findInventoryByIdArg.should.equal(inventoryId)
      })

      it('should return a promise', () => {
        inventoryPromise.should.be.a('promise')
      })

      it('should resolve to an inventory object', () => {
        return inventoryPromise.should.eventually.deep.equal(testInventory)
      })

    })

    describe('error path', () => {

      describe('when findInventoryById is not a function', () => {
        it('should throw a type error', () => {
          expect(() => core.getInventoryUseCase("findInventoryById")).to.throw(TypeError)
        })
      })

      describe('when inventoryId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.getInventoryUseCase(findInventoryById)(1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when findInventoryById fails', () => {
        it('should throw an error', () => {
          const badFindInventoryById = () => {throw new Error}
          const promise = core.getInventoryUseCase(badFindInventoryById)(inventoryId)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('getInventoriesByUserId use case', () => {

    let userExistsCalled = false
    let userExistsArg = ""
    
    const userExists = userId => {
      userExistsCalled = true
      userExistsArg = userId
      return true
    }

    let findInventoriesByUserIdCalled = false
    let findInventoriesByUserIdArg = ""

    const testInventories = [
      {
        id: "1",
        name: "testInventory",
        userId: "1",
        items: []
      },
      {
        id: "2",
        name: "testInventory2",
        userId: "1",
        items: []
      }
    ]
    
    const findInventoriesByUserId = userId => {
      findInventoriesByUserIdCalled = true
      findInventoriesByUserIdArg = userId
      return testInventories
    }

    const userId = "1"
    const inventories = core.getInventoriesByUserIdUseCase(userExists)(findInventoriesByUserId)(userId)

    describe('happy path', () => {

      it('should return a function after passing userExists', () => {
        core.getInventoriesByUserIdUseCase(userExists).should.be.a('function')
      })

      it('should return a function after passing findInventoriesByUserId', () => {
        core.getInventoriesByUserIdUseCase(userExists)(findInventoriesByUserId).should.be.a('function')
      })

      it('should call userExists', () => {
        userExistsCalled.should.equal(true)
      })

      it('should pass userId arg to userExists', () => {
        userExistsArg.should.equal(userId)
      })

      it('should return an empty array if userExists is false', () => {
        const userExistsFalse = () => false
        const emptyArrayPromise = core.getInventoriesByUserIdUseCase(userExistsFalse)(findInventoriesByUserId)(userId)
        return emptyArrayPromise.should.eventually.deep.equal([])
      })

      describe('when userExists is true', () => {

        it('should call findInventoriesByUserId', () => {
          findInventoriesByUserIdCalled.should.equal(true)
        })

        it('should pass userId arg to findInventoriesByUserId', () => {
          findInventoriesByUserIdArg.should.equal(userId)
        })

        it('should return array of inventories', () => {
          return inventories.should.eventually.deep.equal(testInventories)
        })

      })

    })

    describe('error path', () => {

      describe('when userExists is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.getInventoriesByUserIdUseCase("userExists")).to.throw(TypeError)
        })
      })

      describe('when findInventoriesByUserId is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.getInventoriesByUserIdUseCase(userExists)("findInventoriesByUserId")).to.throw(TypeError)
        })
      })

      describe('when userId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.getInventoriesByUserIdUseCase(userExists)(findInventoriesByUserId)(1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when userExists fails', () => {
        it('should throw an error', () => {
          const badUserExists = () => {throw new Error}
          const promise = core.getInventoriesByUserIdUseCase(badUserExists)(findInventoriesByUserId)(userId)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when findInventoriesByUserId fails', () => {
        it('should throw an error', () => {
          const badFindInventoriesByUserId = () => {throw new Error}
          const promise = core.getInventoriesByUserIdUseCase(userExists)(badFindInventoriesByUserId)(userId)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when inventories is not an array', () => {
        it('should throw a type error', () => {
          const badFindInventoriesByUserId = () => ({})
          const promise = core.getInventoriesByUserIdUseCase(userExists)(badFindInventoriesByUserId)(userId)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

    })

  })

  describe('update inventory use case', () => {

    let findInventoryByIdCalled = false
    let findInventoryByIdArg = ""

    const inventory =  {
      id: "1",
      name: "testInventory",
      userId: "1",
      items: []
    }
    
    const findInventoryById = inventoryId => {
      findInventoryByIdCalled = true
      findInventoryByIdArg = inventoryId
      return inventory
    }
    
    let saveInventoryCalled = false
    let saveInventoryArg = {}

    const saveInventory = updatedInventory => {
      saveInventoryCalled = true
      saveInventoryArg = updatedInventory
    }

    const inventoryId = "1"
    const updatePropsObj = {name: "otherInventory"}
    const updatedInventoryPromise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, updatePropsObj)

    describe('happy path', () => {

      it('should return a function after receiving findInventoryById', () => {
        core.updateInventoryUseCase(findInventoryById).should.be.a('function')
      })

      it('should return a function after saveInventory is passed', () => {
        core.updateInventoryUseCase(findInventoryById)(saveInventory).should.be.a('function')
      })

      it('should call findInventoryById', () => {
        findInventoryByIdCalled.should.equal(true)
      })

      it('should pass inventoryId arg to findInventoryById', () => {
        findInventoryByIdArg.should.equal(inventoryId)
      })

      it('should return a copy of inventory with updateProps arg merged', () => {
        return updatedInventoryPromise.should.not.eventually.deep.equal(inventory)
        const copy = Object.assign({}, inventory, updatePropsObj)
        updatedInventoryPromise.should.eventually.deep.equal(copy)
      })

      it('should call saveInventory', () => {
        saveInventoryCalled.should.equal(true)
      })

      it('should pass updatedInventory to saveInventory', () => {
        return updatedInventoryPromise.should.eventually.deep.equal(saveInventoryArg)
      })

    })

    describe('error path', () => {

      describe('when findInventoryById is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.updateInventoryUseCase('findInventoryById')).to.throw(TypeError)
        })
      })

      describe('when saveInventory is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.updateInventoryUseCase(findInventoryById)('saveInventory')).to.throw(TypeError)
        })
      })

      describe('when inventoryId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(1, updatePropsObj)
          promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj is not of type object', () => {
        it('should throw a type error', () => {
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, "")
          promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj is of type array', () => {
        it('should throw a type error', () => {
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, [])
          promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj tries to update id', () => {
        it('should throw an error', () => {
          const badUpdatePropsObj = {id: "2"}
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, badUpdatePropsObj)
          promise.should.be.rejectedWith(Error)
        })
      })

      describe('when updatePropsObj has keys that are not on inventory', () => {
        it('should throw an error', () => {
          const badUpdatePropsObj = {foo: "bar"}
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, badUpdatePropsObj)
          promise.should.be.rejectedWith(Error)          
        })
      })

      describe('when values on updatePropsObj are not of same type as inventory', () => {
        it('should throw a type error', () => {
          const badUpdatePropsObj = {name: 1}
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, badUpdatePropsObj)
          promise.should.be.rejectedWith(Error)          
        })
      })

      describe('when updatePropsObj.items is not of type array', () => {
        it('should throw a type error', () => {
          const badUpdatePropsObj = {items: {}}
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, badUpdatePropsObj)
          promise.should.be.rejectedWith(Error)          
        })
      })

      describe('when updatePropsObj.items children are not objects', () => {
        it('should throw a type error', () => {
          const badUpdatePropsObj = {items: [1]}
          const promise = core.updateInventoryUseCase(findInventoryById)(saveInventory)(inventoryId, badUpdatePropsObj)
          promise.should.be.rejectedWith(Error)          
        })
      })

      describe('when findInventoryById fails', () => {
        it('should throw an error', () => {
          const badFindInventoryById = () => {throw new Error}
          const promise = core.updateInventoryUseCase(badFindInventoryById)(saveInventory)(inventoryId, updatePropsObj)
          promise.should.be.rejectedWith(Error)
        })
      })

      describe('when saveInventory fails', () => {
        it('should throw an error', () => {
          const badSaveInventory = () => {throw new Error}
          const promise = core.updateInventoryUseCase(findInventoryById)(badSaveInventory)(inventoryId, updatePropsObj)
          promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('delete inventory use case', () => {

    let deleteInventoryCalled = false
    let deleteInventoryArg = ""

    const deleteInventory = inventoryId => {
      deleteInventoryCalled = true
      deleteInventoryArg = inventoryId
    }

    const inventoryId = "1"
    const deletedInventory = core.deleteInventoryUseCase(deleteInventory)(inventoryId)

    describe('happy path', () => {

      it('should return a function after receiving deleteInventory', () => {
        core.deleteInventoryUseCase(deleteInventory).should.be.a('function')
      })

      it('should call deleteInventory', () => {
        deleteInventoryCalled.should.equal(true)
      })

      it('should pass inventoryId arg to deleteInventory', () => {
        deleteInventoryArg.should.equal(inventoryId)
      })

      it('should return null after deleting', () => {
        should.equal(deletedInventory, null)
      })

    })

    describe('error path', () => {

      describe('when deleteInventory is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.deleteInventoryUseCase('deleteInventory')).to.throw(TypeError)
        })
      })

      describe('when inventoryId is not a string', () => {
        it('should throw a type error', () => {
          expect(() => core.deleteInventoryUseCase(deleteInventory)(1)).to.throw(TypeError)
        })
      })

      describe("when deleteInventory fails", () => {
        it('should throw an error', () => {
          const badDeleteInventory = () => {throw new Error}
          expect(() => core.deleteInventoryUseCase(badDeleteInventory)(inventoryId)).to.throw()
        })
      })

    })

  })

})