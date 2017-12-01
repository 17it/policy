
module.exports = function* () {
	this.redirect('http://www.le.com/error/?from=lepc&'+this.querystring);
};
