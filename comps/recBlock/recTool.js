var dir = "./comps/recBlock/";
var recConfig = {
    //a1:对于需要换的而言，a1就是上面不动的那几个；
    // 对于不需要换的而言，a1是比较特殊的个数，比如大图带小还图就是1，
    //   文字加图文的就是2，也有可能是0，
    //d:下面部分的一行的单倍数，
    //changeOneChange:是否需要换一换，不区分换一换的必需不配
    //titleBar:标题，false理论上就不应该有，实际上更不会有，即便是cms配置了，也不会显示;true的话在根据模板渲染
    //loadChange：查看更多或者换一换的那一栏，true可以显示但是不一定能显示；false就不然她显示
    168: {
        describe: "M站焦点图有标题",
        template: "./comps/focus/focus.html",
        titleBar: true,
        loadChange: false,
    },
    169: {
        describe: "M站焦点图无标题",
        template: "./comps/focus/focus.html",
        titleBar: true,
        loadChange: false,
    },
    170: {
        describe: "M站服务区",
        template: dir + "/servicearea.html",
        titleBar: false,
        loadChange: false,
    },
    171: {
        describe: "M站直播区",
        template: dir + '/hotLive.html',
        titleBar: true,
        loadChange: true,
    },
    172: {
        describe: "M站横图有换一换",
        a1: 0,
        d: 2,
        changeOneChange: true,
        template: dir + '/recBlock.html',
        titleBar: true,
        loadChange: true,
    },
    173: {
        describe: "M站横图无换一换",
        a1: 0,
        d: 2,
        changeOneChange: false,
        template: dir + '/recBlock.html',
        titleBar: true,
        loadChange: true,
    },
    174: {
        describe: "M站竖图有换一换",
        a1: 0,
        d: 3,
        changeOneChange: true,
        template: dir + '/vertical.html',
        titleBar: true,
        loadChange: true,
    },
    175: {
        describe: "M站竖图无换一换",
        a1: 0,
        d: 3,
        changeOneChange: false,
        template: dir + '/vertical.html',
        titleBar: true,
        loadChange: true,
    },
    176: {
        describe: "M站今日头条图文有换一换",
        a1: 2,//首项,不动的
        d: 2,//
        changeOneChange: true,//理论上要不要换一换，当然实际结果可能会发生变化，比如理论上是要换一换，但是给的数据不够，就只能不换了
        template: dir + "/todayHotPicWord.html",
        titleBar: true,
        loadChange: true,
    },
    177: {
        describe: "M站今日头条图文无换一换",
        a1: 2,
        d: 2,
        changeOneChange: false,
        template: dir + "/todayHotPicWord.html",
        titleBar: true,
        loadChange: true,
    },
    178: {
        describe: "M站今日头条文字有换一换",
        a1: 0,
        d: 2,
        changeOneChange: true,
        template: dir + "/todayHotWord.html",
        titleBar: true,
        loadChange: true,
    },
    179: {
        describe: "M站今日头条文字无换一换",
        a1: 0,
        d: 2,
        changeOneChange: false,
        template: dir + "/todayHotWord.html",
        titleBar: true,
        loadChange: true,
    },
    180: {
        describe: "M站大图带小图有换一换",
        a1: 1,
        d: 2,
        changeOneChange: true,
        template: dir + '/bigSmall.html',
        titleBar: true,
        loadChange: true,
    },
    181: {
        describe: "M站大图带小图无换一换",
        a1: 1,
        d: 2,
        changeOneChange: false,
        template: dir + '/bigSmall.html',
        titleBar: true,
        loadChange: true,
    },
    182: {//没有换一换
        describe: "M站专题",
        template: dir + '/special.html',
        titleBar: true,
        loadChange: true,
    },
    183: {
        describe: "M站应用推荐",
        template: dir + '/recAppList.html',
        titleBar: true,
        loadChange: false,
    },
    184: {
        describe: "M站通栏导流位",
        titleBar: false,
        loadChange: false,
        template: dir + '/tonglandaoliu.html',
    },
    185: {
        describe: "M站筛选栏",
        a1: 0,
        d: 2,
        changeOneChange: false,
        template: dir + '/selectBar.html',
        titleBar: false,
        loadChange: false,
    },
    186: {
        describe: "M站横划板块",
        template: dir + '/sideslip.html',
        titleBar: true,
        loadChange: true,
    },
    187: {
        describe: "M站排行榜",
        template: dir + '/rankinglist.html',
        titleBar: true,
        loadChange: true,
    },
    188: {
        describe: "M站上拉加载",
        template: dir + "/dragLoad.html",
        titleBar: false,
        loadChange: false,
    }
};


/**
 *
 * @param block
 *force:强制不换一换
 *比如有两条数据是不动的，每次换4条，但是给了我15条数据，我就能算出来有一条数据得被干掉，
 * 同时能给出到底有几组可以换,
 * 根据有没有换一换（组数，公差），计算出到底保留多长的videoList
 */
function howLong(block, force) {
    if (!block.videoList || !block.videoList.length) {
        return block;
    }
    var conf = recConfig[block.contentStyle];
    if (!conf || conf.changeOneChange==undefined) {
        if (block.videoList.length > block.num) {
            block.videoList = block.videoList.slice(0, block.num);
        }
        return block;
    }
    var groupLen = 0;
    if (!conf.changeOneChange || force) {//配置的就是不需要换一换的，或者强制不换一换
        block.a1 = conf.a1;
        //应该是2n+a,3n+a这种，2，3是一行的个数
        for (var i = 1; ; i++) {
            var an = conf.a1 + i * conf.d;//没有换一换，公差是conf.d
            if (an > block.videoList.length) {
                groupLen = i - 1;
                break;
            }
        }
        if (block.videoList.length > block.num) {
            block.videoList = block.videoList.slice(0, block.num);
        }
        //删掉多余的
        block.videoList = block.videoList.slice(0, conf.a1 + groupLen * conf.d);
        block.d = block.videoList.length - block.a1;//下面的，不包括上面的特殊的
        groupLen = 1;//赋值成0或者1都行，删掉这行也行
    } else {
        block.d = block.num - conf.a1;//num是包括上面不动的加上下面动的一屏
        //有换一换的，需要给产品容错;比如总条数应该填6，但是他们填了7，
        while (block.d % conf.d) {
            block.d--;
        }
        //等差数列，计算换一换的总组数
        for (var i = 1; block.d > 0; i++) {
            var an = conf.a1 + i * block.d;//有换一换，公差是block.d
            if (an > block.videoList.length) {
                groupLen = i - 1;
                break;
            }
        }
        if (groupLen==0) {
            //他是想要换一换，但是给的数据连一组完整的都不够显示的，只能强制不换一换,甚至有可能被删掉一些数据
            return arguments.callee(block, true);
        }
        //把多余的数据删掉
        groupLen > 3 && (groupLen = 3);//最多三組
        block.videoList = block.videoList.slice(0, conf.a1 + groupLen * block.d);
        block.a1 = conf.a1;
    }
    block.changeOneChange = groupLen > 1;
    //block.groupLen = groupLen;
    block.num = block.videoList.length;
    return block;
}
exports.howLong = howLong;
exports.recConfig = recConfig;
