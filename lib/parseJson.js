module.exports = function (jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (e) {
		try {
			return (new Function('return '+jsonString))();
		} catch (ex) {
			console.error('[err] parseJson:\n'+ex.message+'\n'+e.message+
				'\n'+jsonString.slice(0, 200));
			return null;
		}
	}
};
