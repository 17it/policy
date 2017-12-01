var fragJsCss = $require('modules/fragJsCss');

module.exports = function* (data) {
	data.jsLink = fragJsCss.loadJs(data.js);
	return this.render(__dirname+'/footer.html', data);
};
