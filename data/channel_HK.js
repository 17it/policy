/*--
    各频道对应的ptvcid/频道名称/焦点图/推荐pageid/排行榜接口等
    新增频道的话，记得把对应频道的统计用的信息也一并添加上，data/statInfo.js
*/
module.exports = {
    'home': {
        'ptvcid': 0,
        'focus': {
            'id': 3222,
            'num': 3
        },
        'recommend': 1003410843
    },
   'tv': {
        'ptvcid': 2,
        'cname': 'x020',
        'focus': {
            'id': 3372,
            'num': 3
        },
        'recommend': 1003415615,
        'topUrl':{//排行榜
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayTVPlay.jsn',
           }
        }
    },
    'movie': {
        'ptvcid': 1,
        'cname': 'x021',
        'focus': {
            'id': 3264,
            'num': 3
        },
        'recommend': 1003415598,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFilmPlay.jsn',
            }
        }
    },
    'comic': {
        'ptvcid': 5,
        'cname': 'x022',
        'focus': {
            'id': 3392,
            'num': 3
        },
        'recommend': 1003415668,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayComicPlay.jsn',
            }
        }
    },
    'zongyi': {
        'ptvcid': 11,
        'cname': 'x023',
        'focus': {
            'id': 3381,
            'num': 3
        },
        'recommend': 1003415659,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayVarPlay.jsn',
            }
        }
    },
    'sports': {
        'ptvcid': 4,
        'cname': 'x024',
        'focus': {
            'id': 3396,
            'num': 3
        },
        'recommend': 1003415679,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/daySportPlay.jsn',
            }
        }
    },
    'ent': {
        'ptvcid': 3,
        'cname': 'x027',
        'focus': {
            'id': 3401,
            'num': 3
        },
        'recommend': 1003415669,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayEntPlay.jsn',
            }
        }
    },
    'music': {
        'ptvcid': 9,
        'cname': 'x029',
        'focus': {
            'id': 3413,
            'num': 3
        },
        'recommend': 1003415660,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayMusicPlay.jsn',
            }
        }
    },
    'jilu': {
        'ptvcid': 16,
        'cname': 'x030',
        'focus': {
            'id': 3439,
            'num': 3
        },
        'recommend': 1003415674,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayDocPlay.jsn',
            }
        }
    },
    'finance': {
        'ptvcid': 22,
        'cname': 'x031',
        'focus': {
            'id': 3433,
            'num': 3
        },
        'recommend': 1003415671,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFinancePlay.jsn',
            }
        }
    },
    'us': {
        'ptvcid': 2,
        'cname': 'x047',
        'focus': {
            'id': 3388,
            'num': 3
        },
        'recommend': 1003415638
    },
    'qinzi': {
        'ptvcid': 34,
        'cname': 'x033',
        'focus': {
            'id': 3418,
            'num': 3
        },
        'recommend': 1003415666
    },
    'fashion': {
        'ptvcid': 20,
        'cname': 'x051',
        'focus': {
            'id': 3423,
            'num': 3
        },
        'recommend': 1003415678,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFashionPlay.jsn',
            }
        }
    },
    'travel': {
        'ptvcid': 23,
        'cname': 'x036',
        'focus': {
            'id': 3446,
            'num': 3
        },
        'recommend': 1003415672,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayTravelPlay.jsn',
            }
        }
    },
    'auto': {
        'ptvcid': 14,
        'cname': 'x040',
        'focus': {
            'id': 3428,
            'num': 3
        },
        'recommend': 1003415664,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayCarPlay.jsn',
            }
        }
    },
    // 'ugc': {
    //     'ptvcid': 1029,
    //     'cname': 'x041',
    //     'focus': {
    //         'id': 3652,
    //         'num': 6
    //     },
    //     'recommend': 1003331462
    // },
    // 'fun': {
    //     'ptvcid': 10,
    //     'cname': 'x042',
    //     'focus': {
    //         'id': 3858,
    //         'num': 6
    //     },
    //     'recommend': 1003331305
    // },
    'hot': {
        'ptvcid': 30,
        'cname': 'x043',
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayHotPlay.jsn',
            }
        }
    },
    'top': {
        'cname': 'x044'
    },
    'shenghuo': {
        'ptvcid': 13,
        'cname': 'x048',
        'focus': {
            'id': 3452,
            'num': 3
        },
        'recommend': 1003415677
    },
    'best': {
        'ptvcid': 1008,
        'cname': 'x050',
        'focus': {
            'id': 3407,
            'num': 3
        },
        'recommend': 1003415642
    },
    'vip': {
        'ptvcid': 1,
        'cname': 'x045',
        'focus': {
            'id': 5809,
            'num': 3
        },
        'recommend': 1003424095
    },
    'test': {
        'ptvcid': 0,
        'cname': 'x046',
        'focus': {
            'id': 6203,
            'num': 3
        },
        'recommend': 1003372922
    },
    'default':{
        'ptvcid': 0
    }
};