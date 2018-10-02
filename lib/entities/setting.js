const shortid = require("shortid")
const utils = require("../../utils")

const setting = (userId, name, value) => {

	if(typeof userId !== "string"){
		throw new TypeError(utils.constructErrorMessage("userId", "string", userId))
	}

	if(typeof name !== "string"){
		throw new TypeError(utils.constructErrorMessage("name", "string", name))
	}

	return {
		id: shortid.generate(),
		userId,
		name,
		value
	}
}

module.exports = {
	setting
}