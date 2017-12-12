// 项目运行时环境配置
// 放在与项目代码文件夹同级的目录里，避免发布代码被覆盖

global.env = {
	// 调试模式
	DEBUG: true,

	SERVER_IP: '98.150',

	// 生产环境模式
	PRO_MODE: false,

	// 是否开启cbase，需要安装cbase的代理moxi
	CBASE: false,

	// 是否开启本机缓存，需要安装memcached
	LOCACHE: false,
	
	//如果此处不配置端口，则默认使用8001
	//PORT: 80,

	// 某种标记，比如用做某个功能的灰度发布标记
	SOME_FLAG: false
};
