const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe("setting use cases", () => {

	describe("createSetting", () => {

		describe("happy path", () => {

			let createSettingCalled = false
			let createSettingArg = ""
			const createSetting = (setting) => {
				createSettingCalled = true
				createSettingArg = setting
			}
			const userId = "1"
			const name = "name"
			const value = "value"
			const createSettingUseCase = core.createSettingUseCase(createSetting)
			const setting = createSettingUseCase(userId, name, value)

			it("should return a function after accepting the createSetting argument", () => {
				core.createSettingUseCase(createSetting).should.be.a("function")
			})

			it("should call createSetting", () => {
				createSettingCalled.should.equal(true)
			})

			it("should pass the setting entity to createSetting", () => {
				return setting.should.eventually.deep.equal(createSettingArg)
			})

			it("should return a promise", () => {
				setting.should.be.a("promise")
			})

			it("should resolve to an object", () => {
				return setting.should.eventually.be.an("object")
			})

			it("should have string id prop", () => {
				return setting.should.eventually.have.property("id").be.a("string")
			})

			it("should have userId arg equal to userId", () => {
				return setting.should.eventually.have.property("userId").equal(userId)
			})

			it("should have name equal to name arg", () => {
				return setting.should.eventually.have.property("name").equal(name)
			})

			it("should have value equal to value arg", () => {
				return setting.should.eventually.have.property("value").equal(value)
			})

		})

		describe("error path", () => {

			const createSettingUseCase = core.createSettingUseCase(() => {})

			describe("when createSetting is not a func", () => {
				it("should throw a TypeError", () => {
					expect(() => core.createSettingUseCase("createSetting")).to.throw(TypeError)
				})
			})

			describe("when userId is not a string", () => {
				it("should reject with TypeError", () => {
					return createSettingUseCase(1).should.be.rejectedWith(TypeError)
				})
			})

			describe("when name is not a string", () => {
				it("should reject with TypeError", () => {
					return createSettingUseCase("1", 2).should.be.rejectedWith(TypeError)
				})
			})

			describe("when createSetting fails", () => {
				it("should reject with error", () => {
					const badCreateSetting = () => {throw new Error}
					const createSettingUseCase = core.createSettingUseCase(badCreateSetting)
					return createSettingUseCase("1", "name", "value").should.be.rejectedWith(Error)
				})
			})

		})

	})

	describe("getSetting", () => {

		describe("happy path", () => {

			let findSettingByIdCalled = false
			let findSettingByIdArg = 1
			const findSettingById = id => {
				findSettingByIdCalled = true
				findSettingByIdArg = id
				return {id}
			}
			const getSettingUseCase = core.getSettingUseCase
			const getSettng = getSettingUseCase(findSettingById)
			const id = "1"
			const setting = getSettng(id)

			it("return a function after accepting findSettingById arg", () => {
				getSettingUseCase(findSettingById).should.be.a("function")
			})

			it("returns a promise", () => {
				setting.should.be.a("promise")
			})

			it("calls findSettingById", () => {
				findSettingByIdCalled.should.equal(true)
			})

			it("passes the id arg to find setting by id", () => {
				findSettingByIdArg.should.equal(id)
			})

			it("returns the setting with id equal to id arg", () => {
				return setting.should.eventually.have.property("id").equal(id)
			})

		})

		describe("error path", () => {

			const getSettingUseCase = core.getSettingUseCase
			const getSetting = getSettingUseCase(() => {})

			describe("when findSettingById is not a function", () => {
				it("should throw a TypeError", () => {
					expect(() => getSettingUseCase(1)).to.throw(TypeError)
				})
			})

			describe("when id is not a string", () => {
				it("should throw a TypeError", () => {
					expect(getSetting(1)).to.be.rejectedWith(TypeError)
				})
			})

			describe("when findSettingById throws an error", () => {
				it('should throw an Error', () => {
					const badFunc = () => {throw new Error}
					expect(getSettingUseCase(badFunc)("1")).to.be.rejectedWith(Error)
				})
			})

		})

	})

	describe("updateSetting", () => {

		const updateSettingUseCase = core.updateSettingUseCase

		describe("happy path", () => {

			let findSettingByIdCalled = false
			let findSettingByIdArg = ""

			const setting = {
				id: "1",
				userId: "1",
				name: "setting",
				value: false
			}

			const findSettingById = id => {
				findSettingByIdCalled = true
				findSettingByIdArg = id
				return Promise.resolve(setting)
			}

			let saveSettingArg = {}
			const saveSetting = setting => {
				saveSettingArg = setting
			}
			const updateSetting = updateSettingUseCase(findSettingById)(saveSetting)
			const id = "1"
			const value = true
			const updatedSetting = updateSetting(id, value)

			it("returns a function after accepting the findSettingById argument", () => {
				updateSettingUseCase(findSettingById).should.be.a("function")
			})

			it("should return a function after accepting the saveSetting argument", () => {
				updateSettingUseCase(findSettingById)(saveSetting).should.be.a("function")
			})

			it("returns a promise", () => {
				updatedSetting.should.be.a("promise")
			})

			it("calls findSettingById", () => {
				findSettingByIdCalled.should.equal(true)
			})

			it("should pass the id arg to findSettingById", () => {
				findSettingByIdArg.should.equal(id)
			})

			it("should update the setting's value to the value argument and pass it to saveSetting", () => {
				return updatedSetting.should.eventually.deep.equal(saveSettingArg)
			})

			it("should return the new setting", () => {
				return updatedSetting.should.eventually.deep.equal(Object.assign({}, setting, { value }))
			})

		})

		describe("error path", () => {

			const updateSetting = updateSettingUseCase(() => {})(() => {})

			describe("when findSettingById is not a function", () => {
				it("should throw a TypeError", () => {
					expect(() => updateSettingUseCase("1")).to.throw(TypeError)
				})
			})

			describe("when saveSetting is not a function", () => {
				it("should throw a TypeError", () => {
					expect(() => updateSettingUseCase(() => {})("1")).to.throw(TypeError)
				})
			})

			describe("when id is not of type string", () => {
				it("should throw a TypeError", () => {
					expect(updateSetting(1)).to.be.rejectedWith(TypeError)
				})
			})

			describe("when findSettingById throws an error", () => {
				it("should catch the error", () => {
					const badFunc = () => {throw new Error}
					const updateSetting = updateSettingUseCase(badFunc)(() => {})
					expect(updateSetting("1")).to.be.rejectedWith(Error)
				})
			})

			describe("when saveSetting throws an error", () => {
				it("should catch the error", () => {
					const badFunc = () => {throw new Error}
					const updateSetting = updateSettingUseCase(() => {})(badFunc)
					expect(updateSetting("1")).to.be.rejectedWith(Error)
				})
			})

		})

	})

	describe("deleteSetting", () => {

		const deleteSettingUseCase = core.deleteSettingUseCase

		describe("happy path", () => {

			let deleteSettingCalled = false
			let deleteSettingArg = ""
			const deleteSetting = id => {
				deleteSettingCalled = true
				deleteSettingArg = id
				return Promise.resolve(null)
			}
			const id = "1"
			const deleteSettingFunc = deleteSettingUseCase(deleteSetting)
			const deletedSetting = deleteSettingFunc(id)

			it("should return a function after accepting deleteSetting arg", () => {
				deleteSettingUseCase(deleteSetting).should.be.a("function")
			})

			it("should return a promise", () => {
				deletedSetting.should.be.a("promise")
			})

			it("should call deleteSetting", () => {
				deleteSettingCalled.should.equal(true)
			})

			it("should pass the id to deleteSetting", () => {
				deleteSettingArg.should.equal(id)
			})

			it("should return null", () => {
				return deletedSetting.should.eventually.equal(null)
			})

		})

		describe("error path", () => {

			describe("When deleteSetting is not a function", () => {
				it("should throw a TypeError", () => {
					expect(() => deleteSettingUseCase("")).to.throw(TypeError)
				})
			})

			describe("when id is not a string", () => {
				it("should throw a TypeError", () => {
					expect(deleteSettingUseCase(() => {})(1)).to.be.rejectedWith(TypeError)
				})
			})

			describe("when deleteSetting throws an error", () => {
				it("should throw an error with same message", () => {
					const message = 'Bad function!'
					const badFunc = () => {throw new Error(message)}
					expect(deleteSettingUseCase(badFunc)("1")).to.be.rejectedWith(Error, message)
				})
			})

		})

	})

})