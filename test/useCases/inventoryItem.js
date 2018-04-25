const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe('inventory item use cases', () => {

  describe('createInventoryItemUseCase', () => {

    const inventoryId = "1"
    const object = {
      name: "Test Object"
    }
    const quantityUnit = "lbs"
    const currentQuantity = 2
    const reorderQuantity = 10
    const reorderThreshold = 1
    const costUnit = "USD"
    const unitCost = 10
    const reorderCost = 100
    const lastReorderDate = new Date("11/2/17")
    const deliveryDate = new Date("1/2/13")
    const createdAt = new Date()
    const updatedAt = new Date()
    const inventoryItemEntity = core.inventoryItemEntity(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)

    let createInventoryItemCalled = false
    let createInventoryItemArg = {}
    const createInventoryItem = inventoryItem => {
      createInventoryItemCalled = true
      createInventoryItemArg = inventoryItem
    }

    let addToInventoryCalled = false
    let addToInventoryArg = {}
    const addToInventory = item => {
      addToInventoryCalled = true
      addToInventoryArg = item
    }

    const createdItem = core.createInventoryItemUseCase(createInventoryItem)(addToInventory)(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)

    describe('happy path', () => {

      it('should return a function after accepting the createInventoryItem arg', () => {
        core.createInventoryItemUseCase(createInventoryItem).should.be.a('function')
      })

      it('should return a function after accepting the addToInventory function', () => {
        core.createInventoryItemUseCase(createInventoryItem)(addToInventory).should.be.a('function')
      })

      it('should call createInventoryItem function', () => {
        createInventoryItemCalled.should.equal(true)
      })

      it('should pass inventoryItem entity to createInventoryItem', () => {
        createInventoryItemArg.should.deep.equal(createdItem)
      })

      it('should call addToInventory function', () => {
        addToInventoryCalled.should.equal(true)
      })

      it('should pass inventoryItem to addToInventory', () => {
        addToInventoryArg.should.equal(createdItem)
      })

      it('should have inventoryId prop equal to inventoryId arg', () => {
        createdItem.inventoryId.should.equal(inventoryId)
      })

      it('should have object prop equal to object arg', () => {
        createdItem.object.should.deep.equal(object)
      })

      it('should have quantityUnit prop equal to quantityUnit arg', () => {
        createdItem.quantityUnit.should.equal(quantityUnit)
      })

      it('should have currentQuantity prop equal to currentQuantity arg', () => {
        createdItem.currentQuantity.should.equal(currentQuantity)
      })

      it('should have reorderQuantity prop equal to reorderQuantity arg', () => {
        createdItem.reorderQuantity.should.equal(reorderQuantity)
      })

      it('should have reorderThreshold prop equal to reorderThreshold arg', () => {
        createdItem.reorderThreshold.should.equal(reorderThreshold)
      })

      it('should have costUnit prop equal to costUnit arg', () => {
        createdItem.costUnit.should.equal(costUnit)
      })

      it('should have unitCost prop equal to unitCost arg', () => {
        createdItem.unitCost.should.equal(unitCost)
      })

      it('should have reorderCost prop equal to reorderCost arg', () => {
        createdItem.reorderCost.should.equal(reorderCost)
      })

      it('should have lastReorderDate prop equal to lastReorderDate arg', () => {
        createdItem.lastReorderDate.should.equal(lastReorderDate)
      })

      it('should have deliveryDate prop equal to deliveryDate arg', () => {
        createdItem.deliveryDate.should.equal(deliveryDate)
      })

      it('should have createdAt prop equal to createdAt arg', () => {
        createdItem.createdAt.should.equal(createdAt)
      })

      it('should have updatedAt prop equal to updatedAt arg', () => {
        createdItem.updatedAt.should.equal(updatedAt)
      })

      it('should return an inventoryItem entity', () => {
        const inventoryItemEntityCopy = Object.assign({}, inventoryItemEntity, {id: createdItem.id})
        createdItem.should.deep.equal(inventoryItemEntityCopy)
      })

    })

    describe('error path', () => {

      describe('when createInventoryItem is not a function', () => {
        it('should throw a type error', () => {
          expect(() => core.createInventoryItemUseCase("createInventoryItem")).to.throw(TypeError)
        })
      })

      describe('when createInventoryItem fails', () => {
        it('should throw an error', () => {
          const badCreateInventoryItem = () => {throw new Error}
          expect(() => core.createInventoryItemUseCase(badCreateInventoryItem)(addToInventory)(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)).to.throw()
        })
      })

      describe('when addToInventory fails', () => {
        it('should throw an error', () => {
          const badAddToInventory = () => {throw new Error}
          expect(() => core.createInventoryItemUseCase(createInventoryItem)(badAddToInventory)(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)).to.throw()
        })
      })

    })

  })

  describe('getInventoryItem use case', () => {

    const inventoryItemEntity = {
      id: "1",
      inventoryId: "1",
      object: {
        name: "Test Object"
      },
      quantityUnit: "lbs",
      currentQuantity: 2,
      reorderQuantity: 10,
      reorderThreshold: 1,
      costUnit: "USD",
      unitCost: 10,
      reorderCost: 100,
      lastReorderDate: new Date("11/2/17"),
      deliveryDate: new Date("1/2/13"),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const otherInventoryItemEntity = {
      id: "2"
    }

    const inventoryItemEntities = [inventoryItemEntity, otherInventoryItemEntity]

    let findInventoryItemByIdCalled = false
    let findInventoryItemByIdArg = ""
    const findInventoryItemById = id => {
      findInventoryItemByIdCalled = true
      findInventoryItemByIdArg = id
      return inventoryItemEntities.find(inventoryItemEntity => {
        return inventoryItemEntity.id === id
      })
    }

    const id = "1"
    const foundInventoryItemPromise = core.getInventoryItemUseCase(findInventoryItemById)(id)

    const otherId = "2"
    const foundInventoryItem2Promise = core.getInventoryItemUseCase(findInventoryItemById)(otherId)

    describe('happy path', () => {

      it('should return a function after accepting findInventoryItemById arg', () => {
        core.getInventoryItemUseCase(findInventoryItemById).should.be.a('function')
      })

      it('should call findInventoryItemById', () => {
        findInventoryItemByIdCalled.should.equal(true)
      })

      it('should pass id arg to findInventoryItemById', () => {
        findInventoryItemByIdArg.should.equal(otherId)
      })

      it('should return inventoryItem whose id matches id arg', () => {
        return foundInventoryItemPromise.should.eventually.have.property('id').equal(id)
      })

      it('should return inventoryItem whose id matches id arg', () => {
        return foundInventoryItem2Promise.should.eventually.have.property('id').equal(otherId)
      })

      it('should return an inventoryItemEntity', () => {
        return foundInventoryItemPromise.should.eventually.deep.equal(Object.assign({}, inventoryItemEntity, {id:"1"}))
      })

    })

    describe('error path', () => {

      describe('when findInventoryItemById is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.getInventoryItemUseCase("findInventoryItemById")).to.throw(TypeError)
        })
      })

      describe('when id is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.getInventoryItemUseCase(findInventoryItemById)(1)
          promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when findInventoryItemById fails', () => {
        it('should throw an error', () => {
          const badFindInventoryItemById = () => {throw new Error}
          const promise = core.getInventoryItemUseCase(badFindInventoryItemById)(id)
          promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('core.updateInventoryItemUseCase', () => {

    const inventoryItem = {
      id: "1",
      inventoryId: "1",
      object: {
        name: "Test Object"
      },
      quantityUnit: "lbs",
      currentQuantity: 2,
      reorderQuantity: 10,
      reorderThreshold: 1,
      costUnit: "USD",
      unitCost: 10,
      reorderCost: 100,
      lastReorderDate: new Date("11/2/17"),
      deliveryDate: new Date("1/2/13"),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    let findInventoryItemByIdCalled = false
    let findInventoryItemByIdArg = ""
    const findInventoryItemById = id => {
      findInventoryItemByIdCalled = true
      findInventoryItemByIdArg = id
      return inventoryItem
    }

    let saveInventoryItemCalled = false
    let saveInventoryItemArg = {}
    const saveInventoryItem = inventoryItem => {
      saveInventoryItemCalled = true
      saveInventoryItemArg = inventoryItem
    }

    const id = "1"
    const updatePropsObj = {
      currentQuantity: 100
    }
    const updatedInventoryItemPromise = core.updateInventoryItemUseCase(findInventoryItemById)(saveInventoryItem)(id, updatePropsObj)

    describe('happy path', () => {

      it('should return a function after accepting findInventoryItemById arg', () => {
        core.updateInventoryItemUseCase(findInventoryItemById).should.be.a('function')
      })

      it('should return a function after accepting saveInventoryItem arg', () => {
        core.updateInventoryItemUseCase(findInventoryItemById)(saveInventoryItem).should.be.a('function')
      })

      it('should call saveInventoryItem', () => {
        saveInventoryItemCalled.should.equal(true)
      })

      it('should pass updatedInventoryItem to saveInventoryItem', () => {
        return updatedInventoryItemPromise.should.eventually.deep.equal(saveInventoryItemArg)
      })

      it('should call findInventoryItemById', () => {
        findInventoryItemByIdCalled.should.equal(true)
      })

      it('should pass id arg to findInventoryItemById', () => {
        findInventoryItemByIdArg.should.equal(id)
      })

      it('should return an inventoryItem whose props are updated to match updatePropsObj', () => {
        updatedInventoryItemPromise.should.eventually.deep.equal(Object.assign({}, inventoryItem, updatePropsObj))
      })

    })

    describe('error path', () => {

      const curriedUpdateInventoryItemUseCase = core.updateInventoryItemUseCase(findInventoryItemById)(saveInventoryItem)

      describe('when findInventoryItemById is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.updateInventoryItemUseCase("findInventoryItemById")).to.throw(TypeError)
        })
      })

      describe('when saveInventoryItem is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.updateInventoryItemUseCase(findInventoryItemById)("saveInventoryItem")).to.throw(TypeError)
        })
      })

      describe('when id is not of type string', () => {
        it('should throw a type error', () => {
          const promise = curriedUpdateInventoryItemUseCase(1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj is not of type object', () => {
        it('should throw a type error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, "updatePropsObj")
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj is an array', () => {
        it('should throw a type error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, [])
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj tries to update id', () => {
        it('should throw an error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, {id: 1})
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when findInventoryItemById fails', () => {
        it('should throw an error', () => {
          const badFindInventoryItemById = () => {throw new Error}
          const promise = core.updateInventoryItemUseCase(badFindInventoryItemById)(saveInventoryItem)(id, updatePropsObj)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when updatePropsObj tries to update property that doesnt exist', () => {
        it('should throw an error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, {foo: "bar"})
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when updatePropsObj tries to update property with value not of same type', () => {
        it('should throw a type error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, {inventoryId: 1})
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when updatePropsObj ties to update object prop with an array', () => {
        it('should throw a type error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, {object: []})
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when updatePropsObj tries to update object prop with null', () => {
        it('should throw a type error', () => {
          const promise = curriedUpdateInventoryItemUseCase(id, {object: null})
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when saveInventoryItem fails', () => {
        it('should throw an error', () => {
          const badSaveInventoryItem = () => {throw new Error}
          const promise = core.updateInventoryItemUseCase(findInventoryItemById)(badSaveInventoryItem)(id, updatePropsObj)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

    describe('when trying to set lastReorderDate and deliveryDate to null', () => {
      
      const curriedUpdateInventoryItemUseCase = core.updateInventoryItemUseCase(findInventoryItemById)(saveInventoryItem)

      it('should not throw an error', () => {
        const nullUpdateObj = {lastReorderDate: null, deliveryDate: null}
        const inventoryItemPromise = curriedUpdateInventoryItemUseCase(id, nullUpdateObj)
        inventoryItemPromise.should.eventually.deep.equal(Object.assign({}, inventoryItem, nullUpdateObj))
      })

    })

  })

  describe('core.getInventoryItemsByInventoryIdUseCase', () => {

    const inventoryItems = [
      {id: "1", inventoryId: "1"},
      {id: "2", inventoryId: "2"},
      {id: "3", inventoryId: "1"}
    ]

    let findInventoryItemsByInventoryIdCalled = false
    let findInventoryItemsByInventoryIdArg = ""
    const findInventoryItemsByInventoryId = inventoryId => {
      findInventoryItemsByInventoryIdCalled = true
      findInventoryItemsByInventoryIdArg = inventoryId
      return inventoryItems.filter(item => item.inventoryId === inventoryId)
    }

    const inventoryId = "1"
    const foundInventoryItemsPromise = core.getInventoryItemsByInventoryIdUseCase(findInventoryItemsByInventoryId)(inventoryId)

    describe('happy path', () => {

      it('should return a function after accepting findInventoryItemsByInventoryId arg', () => {
        core.getInventoryItemsByInventoryIdUseCase(findInventoryItemsByInventoryId).should.be.a('function')
      })

      it('should call findInventoryItemsByInventoryId', () => {
        findInventoryItemsByInventoryIdCalled.should.equal(true)
      })

      it('should pass inventoryId to findInventoryItemsByInventoryId', () => {
        findInventoryItemsByInventoryIdArg.should.equal(inventoryId)
      })

      it('should reutrn an array of inventoryItems with inventoryId equal to id arg', () => {
        return foundInventoryItemsPromise.should.eventually.deep.equal(inventoryItems.filter(item => item.inventoryId === inventoryId))
      })

    })

    describe('error path', () => {

      describe('when findInventoryItemsByInventoryId is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.getInventoryItemsByInventoryIdUseCase("findInventoryItemsByInventoryId")).to.throw(TypeError)
        })
      })

      describe('when inventoryId is not of type string', () => {
        it('should throw a type error', () => {
          const promise = core.getInventoryItemsByInventoryIdUseCase(findInventoryItemsByInventoryId)(1)
          return promise.should.be.rejectedWith(TypeError)
        })
      })

      describe('when findInventoryItemsByInventoryId fails', () => {
        it('should throw an error', () => {
          const badFindInventoryItemsByInventoryId = () => {throw new Error}
          const promise = core.getInventoryItemsByInventoryIdUseCase(badFindInventoryItemsByInventoryId)(inventoryId)
          return promise.should.be.rejectedWith(Error)
        })
      })

      describe('when findInventoryItemsByInventoryId does not return an array', () => {
        it('should throw an error', () => {
          const badFindInventoryItemsByInventoryId = () => {return {}}
          const promise = core.getInventoryItemsByInventoryIdUseCase(badFindInventoryItemsByInventoryId)(inventoryId)
          return promise.should.be.rejectedWith(Error)
        })
      })

    })

  })

  describe('deleteInventoryItemUseCase', () => {

    let deleteInventoryItemCalled = false
    let deleteInventoryItemArg = ""
    const deleteInventoryItem = id => {
      deleteInventoryItemCalled = true
      deleteInventoryItemArg = id
    }

    const id = "1"
    const deletedInventoryItem = core.deleteInventoryItemUseCase(deleteInventoryItem)(id)

    describe('happy path', () => {

      it('should reutrn a function after accepting deleteInventoryItem arg', () => {
        core.deleteInventoryItemUseCase(deleteInventoryItem).should.be.a('function')
      })

      it('should call deleteInventoryItem', () => {
        deleteInventoryItemCalled.should.equal(true)
      })

      it('should pass inventoryItemId to deleteInventoryItem', () => {
        deleteInventoryItemArg.should.equal(id)
      })

      it('should return null', () => {
        should.equal(null, deletedInventoryItem)
      })

    })

    describe('error path', () => {

      describe('when deleteInventoryItem is not a func', () => {
        it('should throw a type error', () => {
          expect(() => core.deleteInventoryItemUseCase("deleteInventoryItem")).to.throw(TypeError)
        })
      })

      describe('when id is not of type string', () => {
        it('should throw a type error', () => {
          expect(() => core.deleteInventoryItemUseCase(deleteInventoryItem)(1)).to.throw(TypeError)
        })
      })

      describe('when deleteInventoryItem fails', () => {
        it('should throw an error', () => {
          const badDeleteInventoryItem = () => {throw new Error}
          expect(() => core.deleteInventoryItemUseCase(badDeleteInventoryItem)(id)).to.throw()
        })
      })

    })

  })

})