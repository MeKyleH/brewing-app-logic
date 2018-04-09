const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe.only('inventory item use cases', () => {

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

    const createdItem = core.createInventoryItemUseCase(createInventoryItem)(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)

    describe('happy path', () => {

      it('should return a function after accepting the createInventoryItem arg', () => {
        core.createInventoryItemUseCase(createInventoryItem).should.be.a('function')
      })

      it('should call createInventoryItem function', () => {
        createInventoryItemCalled.should.equal(true)
      })

      it('should pass inventoryItem entity to createInventoryItem', () => {
        createInventoryItemArg.should.deep.equal(createdItem)
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
          expect(() => core.createInventoryItemUseCase(badCreateInventoryItem)(inventoryId, object, quantityUnit, currentQuantity, reorderQuantity, reorderThreshold, costUnit, unitCost, reorderCost, lastReorderDate, deliveryDate, createdAt, updatedAt)).to.throw()
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
    console.log(core.getInventoryItemUseCase)
    const id = "1"
    const foundInventoryItem = core.getInventoryItemUseCase(findInventoryItemById)(id)

    const otherId = "2"
    const foundInventoryItem2 = core.getInventoryItemUseCase(findInventoryItemById)(otherId)

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
        foundInventoryItem.id.should.equal(id)
        foundInventoryItem2.id.should.equal(otherId)
      })

      it('should return an inventoryItemEntity', () => {
        const inventoryItemEntityCopy = Object.assign({}, inventoryItemEntity, {id: foundInventoryItem.id})
        foundInventoryItem.should.deep.equal(inventoryItemEntityCopy)
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
          expect(() => core.getInventoryItemUseCase(findInventoryItemById)(1)).to.throw(TypeError)
        })
      })

      describe('when findInventoryItemById fails', () => {
        it('should throw an error', () => {
          const badFindInventoryItemById = () => {throw new Error}
          expect(() => core.getInventoryItemUseCase(badFindInventoryItemById)(id)).to.throw()
        })
      })

    })

  })

})