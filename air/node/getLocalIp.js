// 获取本机IP
var ip = '';

var interfaces = require('os').networkInterfaces(),
	dev, devName, i, devi;
for (devName in interfaces) {
	dev = interfaces[devName];
	for (i = 0; i<dev.length; i++) {
		devi = dev[i];
		if (devi.family==='IPv4' && devi.address!=='127.0.0.1' && !devi.internal) {
			ip = devi.address;
			break;
		}
	}
	if (ip) {
		break;
	}
}

module.exports = function () {
	return ip;
};
