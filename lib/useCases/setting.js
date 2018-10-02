const entities = require("../entities")
const utils = require("../../utils")

const createSetting = _createSetting => {

	if(typeof _createSetting !== "function"){
		throw new TypeError(utils.constructErrorMessage("_createSetting", "function", _createSetting))
	}

	return async (userId, name, value) => {

		const setting = entities.settingEntity(userId, name, value)
		try{
			await _createSetting(setting)
			return setting
		}catch(e) {
			throw new Error(e.message)
		}

	}
}

module.exports = {
	createSetting
}