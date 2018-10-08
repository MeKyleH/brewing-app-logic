const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const core = require('../../lib')

describe("setting factory", () => {

	const userId = "1"
	const name = "quantityUnits"
	const value = "US_IMPERIAL"
	const setting = core.settingEntity(userId, name, value)

	describe("happy path", () => {

		it("should return an object", () => {
			setting.should.be.an("object")
		})

		it("should have a string id property", () => {
			setting.id.should.be.a("string")
		})

		it("should generate unique ids", () => {
			const settingTwo = core.settingEntity(userId, name, value)
			setting.id.should.not.equal(settingTwo.id)
		})

		it("should have property userId equal to userId arg", () => {
			setting.userId.should.equal(userId)
		})

		it("should have property name equal to name arg", () => {
			setting.name.should.equal(name)
		})

		it("should have property value equal to value arg", () => {
			setting.value.should.equal(value)
		})

	})

	describe("error path", () => {

		describe("when userId is not of type string", () => {
			it("should throw a TypeError", () => {
				expect(() => core.settingEntity(2)).to.throw(TypeError)
			})
		})

		describe("when name is not of type string", () => {
			it("should throw a TypeError", () => {
				expect(() => core.settingEntity(userId, 5)).to.throw(TypeError)
			})
		})

	})

})