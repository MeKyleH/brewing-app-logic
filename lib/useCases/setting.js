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

const getSetting = findSettingById => {

	if(typeof findSettingById !== "function"){
		throw new TypeError(utils.constructErrorMessage("findSettingById", "function", findSettingById))
	}

	return async id => {

		if(typeof id !== "string"){
			throw new TypeError(utils.constructErrorMessage("id", "string", id))
		}

		try {
			const setting = await findSettingById(id)
			return setting
		}catch(e) {
			throw new Error(e.message)
		}
	}
}

const getSettingsByUserId = userExists => {

	if(typeof userExists !== 'function'){
		throw new TypeError(utils.constructErrorMessage("userExists", "function", userExists))
	}

	return findSettingsByUserId => {

		if(typeof findSettingsByUserId !== "function"){
			throw new TypeError(utils.constructErrorMessage("findSettingsByUserId", "function", findSettingsByUserId))
		}

		return async userId => {

			if(typeof userId !== "string"){
				throw new TypeError(utils.constructErrorMessage("userId", "string", userId))
			}

			if(userExists(userId)){
				const settings = await findSettingsByUserId(userId).catch(e => e)
				return settings
			}else{
				return []
			}
		}
	}
}

const updateSetting = findSettingById => {

	if(typeof findSettingById !== "function"){
		throw new TypeError(utils.constructErrorMessage("findSettingById", "function", findSettingById))
	}

	return saveSetting => {

		if(typeof saveSetting !== "function"){
			throw new TypeError(utils.constructErrorMessage("saveSetting", "function", saveSetting))
		}

		return async (id, value) => {
			const setting = await findSettingById(id).catch(e => e)
			const newSetting = Object.assign({}, setting, { value })
			try {
				await saveSetting(newSetting)
				return newSetting
			} catch(e) {
				throw new Error(e.message)
			}
		}
	}
}

const deleteSetting = _deleteSetting => {

	if(typeof _deleteSetting !== "function"){
		throw new TypeError(utils.constructErrorMessage("_deleteSetting", "function", _deleteSetting))
	}

	return async id => {

		if(typeof id !== "string"){
			throw new TypeError
		}

		try {
			await _deleteSetting(id)
			return null
		} catch(e) {
			throw new Error(e.message)
		}

	}
}

module.exports = {
	createSetting,
	getSetting,
	getSettingsByUserId,
	updateSetting,
	deleteSetting
}