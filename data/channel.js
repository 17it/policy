/*--
    各频道对应的ptvcid/频道名称/焦点图/推荐pageid/排行榜接口等
    新增频道的话，记得把对应频道的统计用的信息也一并添加上，data/statInfo.js
*/
module.exports = {
    'home': {
        'ptvcid': 0,
        'focus': {
            'id': 810,
            'num': 6
        },
        'recommend': 1003221696
    },
   'tv': {
        'ptvcid': 2,
        'channelName': '电视剧',
        'bodyClass': 'tv',
        'focus': {
            'id': 388,
            'num': 6
        },
        'recommend': 1002800180,
        'topUrl':{//排行榜
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayTVPlay.jsn',
           },
            'home': 'http://top.le.com/tvhp.html'
        }
    },
    'movie': {
        'ptvcid': 1,
        'channelName': '电影',
        'bodyClass': 'movie',
        'focus': {
            'id': 2772,
            'num': 6
        },
        'recommend': 1002800204,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFilmPlay.jsn',
            },
            'home':'http://top.le.com/filmhp.html'
        }
    },
    'comic': {
        'ptvcid': 5,
        'channelName': '动漫',
        'bodyClass': 'comic',
        'focus': {
            'id': 77,
            'num': 6
        },
        'recommend': 1002800179,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayComicPlay.jsn',
            },
            'home': 'http://top.le.com/comichp.html'
        }
    },
    'zongyi': {
        'ptvcid': 11,
        'channelName': '综艺',
        'bodyClass': 'zongyi',
        'focus': {
            'id': 6386,
            'num': 4
        },
        'recommend': 1002839266,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayVarPlay.jsn',
            },
            'home': 'http://top.le.com/varhp.html'
        }
    },
    'sports': {
        'ptvcid': 4,
        'channelName': '体育',
        'bodyClass': 'sports',
        'focus': {
            'id': 51,
            'num': 6
        },
        'recommend': 1002849266,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/daySportPlay.jsn',
            },
            'home': 'http://top.le.com/sporthp.html'
        }
    },
    'nba': {
        'ptvcid': 4,
        'channelName': 'NBA',
        'bodyClass': 'nba',
        'focus': {
            'id': 239,
            'num': 6
        },
        'recommend': 1003230611
    },
    'csl': {
        'ptvcid': 4,
        'channelName': '中超',
        'bodyClass': 'music',
        'focus': {
            'id': 2826,
            'num': 5
        },
        'recommend': 1003331290
    },
    'ent': {
        'ptvcid': 3,
        'channelName': '娱乐',
        'bodyClass': 'ent',
        'focus': {
            'id': 82,
            'num': 6
        },
        'recommend': 1002849150,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayEntPlay.jsn',
            },
            'home': 'http://top.le.com/enthp.html'
        }
    },
    'games': {
        'ptvcid': 30,
        'channelName': '游戏',
        'bodyClass': 'games',
        'focus': {
            'id': 2118,
            'num': 5
        },
        'recommend': 1003347209,
        'topUrl':{
            'playCount': {
                'day': 'http://top.le.com/json/dayGameHotPlay.jsn',
            },
            'home': 'http://top.le.com'
        }
    },
    'music': {
        'ptvcid': 9,
        'channelName': '音乐',
        'bodyClass': 'music',
        'focus': {
            'id': 390,
            'num': 6
        },
        'recommend': 1002848646,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayMusicPlay.jsn',
            },
            'home': 'http://top.le.com/musichp.html'
        }
    },
    'jilu': {
        'ptvcid': 16,
        'channelName': '纪录片',
        'bodyClass': 'jilu',
        'focus': {
            'id': 393,
            'num': 6
        },
        'recommend': 1002849252,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayDocPlay.jsn',
            },
            'home': 'http://top.le.com/dochp.html'
        }
    },
    'finance': {
        'ptvcid': 22,
        'channelName': '财经',
        'bodyClass': 'finance',
        'focus': {
            'id': 4846,
            'num': 6
        },
        'recommend': 1002856733,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFinancePlay.jsn',
            },
            'home': 'http://top.le.com/financehp.html'
        }
    },
    'us': {
        'ptvcid': 2,
        'channelName': '美剧',
        'bodyClass': 'tv',
        'focus': {
            'id': 1667,
            'num': 6
        },
        'recommend': 1002856807
    },
    'qinzi': {
        'ptvcid': 34,
        'channelName': '亲子',
        'bodyClass': 'comic',
        'focus': {
            'id': 405,
            'num': 6
        },
        'topUrl': {
            'playCount': {
                'day': 'http://top.le.com/json/dayQinziPlay.jsn',
            },
            'home': 'http://top.le.com/qinzihp.html'
        },
        'recommend': 1002849230
    },
    'news': {
        'ptvcid': 1009,
        'channelName': '资讯',
        'bodyClass': 'music',
        'focus': {
            'id': 4211,
            'num': 6
        },
        'topUrl' : {
            'playCount': {
                'day': 'http://top.le.com/json/dayNewsPlay.jsn',
            },
            'home':'http://top.le.com/newshp.html'
        },
        'recommend': 1002856829
    },
    'fashion': {
        'ptvcid': 20,
        'channelName': '风尚',
        'bodyClass': 'fashion',
        'focus': {
            'id': 84,
            'num': 4
        },
        'recommend': 1003257257,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFashionPlay.jsn',
            },
            'home':'http://top.le.com/fashionhp.html'
        }
    },
    'travel': {
        'ptvcid': 23,
        'channelName': '旅游',
        'bodyClass': 'travel',
        'focus': {
            'id': 98,
            'num': 4
        },
        'recommend': 1003257289,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayTravelPlay.jsn',
            },
            'home':'http://top.le.com/travelhp.html'
        }
    },
    'pet': {
        'ptvcid': 30,
        'channelName': '宠物',
        'bodyClass': 'music',
        'focus': {
            'id': 2122,
            'num': 6
        },
        'topUrl':{
            'playCount': {
                'day': 'http://top.le.com/json/dayPetHotPlay.jsn',
            },
            'home':'http://top.le.com'
        },
        'recommend': 1003347255
    },
    'girls': {
        'ptvcid': 30,
        'channelName': '美女',
        'bodyClass': 'girls',
        'focus': {
            'id': 2041,
            'num': 2
        },
        'topUrl':{
            'playCount': {
                'day': 'http://top.le.com/json/dayBelleHotPlay.jsn',
            },
            'home':'http://top.le.com'
        },
        'recommend': 1003347265
    },
    'tech': {
        'ptvcid': 30,
        'channelName': '科技',
        'bodyClass': 'tech',
        'focus': {
            'id': 2120,
            'num': 4
        },
        'topUrl':{
            'playCount': {
                'day': 'http://top.le.com/json/dayTechnologyHotPlay.jsn',
            },
            'home':'http://top.le.com'
        },
        'recommend': 1003347320
    },
    'edu': {
        'ptvcid': 1021,
        'channelName': '教育',
        'bodyClass': 'music',
        'focus': {
            'id': 4230,
            'num': 4
        },
        'topUrl':{
            'playCount': {
                'day': 'http://top.le.com/json/dayEducationalPlay.jsn',
            },
            'home':'http://top.le.com'
        },
        'recommend': 1003162511
    },
    'auto': {
        'ptvcid': 14,
        'channelName': '汽车',
        'bodyClass': 'auto',
        'focus': {
            'id': 5649,
            'num': 6
        },
        'recommend': 1003347247,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayCarPlay.jsn',
            },
            'home':'http://top.le.com/carhp.html'
        }
    },
    'ugc': {
        'ptvcid': 1029,
        'channelName': '乐享',
        'bodyClass': 'ugc',
        'focus': {
            'id': 3652,
            'num': 6
        },
        'topUrl': {
            'playCount': {
                'day': 'http://top.le.com/json/dayUgcPlay.jsn',
            },
            'home': 'http://top.le.com'
        },
        'recommend': 1003331462
    },
    'fun': {
        'ptvcid': 10,
        'channelName': '搞笑',
        'bodyClass': 'fun',
        'focus': {
            'id': 3858,
            'num': 6
        },
        'topUrl': {
            'home': 'http://top.le.com'
        },
        'recommend': 1003331305
    },
    'hot': {
        'ptvcid': 30,
        'channelName': '热点',
        'bodyClass': 'hot',
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayHotPlay.jsn',
            },
            'home':'http://top.le.com/'
        }
    },
    'top': {
        'bodyClass': 'rank',
        'channelName': '排行榜'
    },
    'vip': {
        'ptvcid': 1,
        'bodyClass': 'vip',
        'channelName': '影视会员',
        'recommend': 1003384798,
        'column': [
            {
                'id': 697,
                'name': '热映大片',
                'num': 12,
                'more': '/list/hot-cg_1.html',
                'clickMore': true
            }
        ]
    },
    'test': {
        'ptvcid': 0,
        'channelName': '测试',
        'bodyClass': 'test',
        'focus': {
            'id': 6203,
            'num': 6
        },
        'recommend': 1003372922
    },

    'default':{
        'ptvcid': 0
    }
};