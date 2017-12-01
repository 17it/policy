var channelInfo = $require('data/channelInfo');
var fragment = $require('comps/fragment/fragment');
var downgrade = $require('base/globalize/downgrade');//降级处理策略...

module.exports = function*(write) {
    var include = this.include;
    //不同地域，使用不同的频道配置文件
    var fsName = '';
    var channelData = $require('data/' + fsName);
    var data = channelData['home'];
    write(yield include('base/header', {
        css: ['m_new_index'],
        info: {
            pageid: 'home'
        },
        title: lang.x002,
        keywords: lang.x003,
        description: lang.x004,
        bodyClass: ''
    }));
    var channel = yield include('base/channel', { pageid: "home" });
    write(channel.nav || "");
    var res = yield {
        'bottomNav': include('base/bottomNav'),
        'footer': include('base/footer', {
            js: ['base_home', 'home'],
            baiduStat: false,
            channelWall: channel.wall,
            cards: this.render("comps/recBlock/cards.html", {
                lang: lang,
                region: this.region
            }),
            pageid: 'home',
        }),
        'recBlock': include('comps/recBlock', {
            recPageId: data.recommend,
            region: this.region,
            langName: lang.name,
            pageid: 'home'
        })
    };

    var gtm = `
        <!-- Google Tag Manager -->
		<noscript>
			<iframe src="//www.googletagmanager.com/ns.html?id=GTM-N84MPJ" height="0" width="0"style="display:none;visibility:hidden">
			</iframe>
		</noscript>
		<script>
			setTimeout(function(){
			    var w=window,d=document,s='script',l='dataLayer',i='GTM-N84MPJ';
			    w[l]=w[l]||[];
			    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
			    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
			    j.async=true;
				j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;
				f.parentNode.insertBefore(j,f);
			},200);
		</script>
		<!-- End Google Tag Manager -->
		</body>`;

    var cardsContents = `<div id="j-content"></div>`;//前端向里面塞东西,前端的结构

    write(res.recBlock.res + cardsContents);

    write(fragment.manageCard.replace(/IP/g, this.region).replace("glkp", lang.x807) + fragment.arkBox);

    write(res.bottomNav + res.recBlock.script + res.footer.replace('</body>', gtm));
};
