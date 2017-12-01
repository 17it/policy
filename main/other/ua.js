var getClientIp = function (req) {
	return req.headers['x-real-ip'] ||
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};

module.exports = function* (write) {
	write('ua: '+this.headers['user-agent']);
	write('\n======\n');
	write('ip: '+getClientIp(this.req));
	write('\n======\n');
	write('headers: \n'+JSON.stringify(this.headers));
};
