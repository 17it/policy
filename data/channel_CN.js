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
       // 'recommend': 1003221696,
        'recommend': 1003441549
    },
   'tv': {
        'ptvcid': 2,
        'cname': 'x020',
        'focus': {
            'id': 388,
            'num': 6
        },
        // 'recommend': 1002800180,
        'recommend': 1003441371,
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
            'id': 2772,
            'num': 6
        },
        // 'recommend': 1002800204,
        'recommend': 1003441383,
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
            'id': 77,
            'num': 6
        },
        // 'recommend': 1002800179,
        'recommend': 1003441367,
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
            'id': 6386,
            'num': 4
        },
        // 'recommend': 1002839266,
        'recommend': 1003441392,
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
            'id': 51,
            'num': 6
        },
        // 'recommend': 1002849266,
        'recommend': 1003441520,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/daySportPlay.jsn',
            }
        }
    },
    'nba': {
        'ptvcid': 4,
        'cname': 'x025',
        'focus': {
            'id': 239,
            'num': 6
        },
        // 'recommend': 1003230611,
        'recommend': 1003441552,
    },
    'csl': {
        'ptvcid': 4,
        'cname': 'x026',
        'focus': {
            'id': 2826,
            'num': 6
        },
        // 'recommend': 1003331290,
        'recommend': 1003441555,
    },
    'ent': {
        'ptvcid': 3,
        'cname': 'x027',
        'focus': {
            'id': 82,
            'num': 6
        },
        // 'recommend': 1002849150,
        'recommend': 1003441506,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayEntPlay.jsn',
            }
        }
    },
    'games': {
        'ptvcid': 104,
        'cname': 'x028',
        'focus': {
            'id': 2118,
            'num': 5
        },
        // 'recommend': 1003347209,
        'recommend': 1003441784,
    },
    'music': {
        'ptvcid': 9,
        'cname': 'x029',
        'focus': {
            'id': 390,
            'num': 6
        },
        // 'recommend': 1002848646,
        'recommend': 1003441407,
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
            'id': 393,
            'num': 6
        },
        // 'recommend': 1002849252,
        'recommend': 1003441517,
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
            'id': 4846,
            'num': 6
        },
        // 'recommend': 1002856733,
        'recommend': 1003441541,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayFinancePlay.jsn',
            }
        }
    },
    'us': {
        'ptvcid': 2,
        'cname': 'x032',
        'focus': {
            'id': 1667,
            'num': 6
        },
        // 'recommend': 1002856807,
        'recommend': 1003441376,
    },
    'qinzi': {
        'ptvcid': 34,
        'cname': 'x033',
        'focus': {
            'id': 405,
            'num': 6
        },
        // 'recommend': 1002849230,
        'recommend': 1003441512,
    },
    'news': {
        'ptvcid': 1009,
        'cname': 'x034',
        'focus': {
            'id': 4211,
            'num': 6
        },
        // 'recommend': 1002856829,
        'recommend': 1003441544,
    },
    'fashion': {
        'ptvcid': 20,
        'cname': 'x035',
        'focus': {
            'id': 84,
            'num': 4
        },
        // 'recommend': 1003257257,
        'recommend': 1003441553,
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
            'id': 98,
            'num': 4
        },
        // 'recommend': 1003257289,
        'recommend': 1003441554,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayTravelPlay.jsn',
            }
        }
    },
    'pet': {
        'ptvcid': 35,
        'cname': 'x037',
        'focus': {
            'id': 2122,
            'num': 6
        },
        // 'recommend': 1003347255,
        'recommend': 1003441857,
    },
    'girls': {
        'ptvcid': 37,
        'cname': 'x038',
        'focus': {
            'id': 2041,
            'num': 2
        },
        // 'recommend': 1003347265,
        'recommend': 1003441893,
    },
    'tech': {
        'ptvcid': 12,
        'cname': 'x049',
        'focus': {
            'id': 2120,
            'num': 4
        },
        // 'recommend': 1003347320,
        'recommend': 1003441908,
    },
    'edu': {
        'ptvcid': 1021,
        'cname': 'x039',
        'focus': {
            'id': 4230,
            'num': 4
        },
        // 'recommend': 1003162511,
        'recommend': 1003441935,
    },
    'auto': {
        'ptvcid': 14,
        'cname': 'x040',
        'focus': {
            'id': 10,
            'num': 6
        },
        // 'recommend': 1003347247,
        'recommend': 1003441808,
        'topUrl':{
            'playCount': {
                'day': 'http://i.top.letv.com/json/dayCarPlay.jsn',
            }
        }
    },
    'ugc': {
        'ptvcid': 1029,
        'cname': 'x041',
        'focus': {
            'id': 3652,
            'num': 6
        },
        // 'recommend': 1003331462,
        'recommend': 1003441777,
    },
    'fun': {
        'ptvcid': 10,
        'cname': 'x042',
        'focus': {
            'id': 3858,
            'num': 6
        },
        // 'recommend': 1003331305,
        'recommend': 1003441775,
    },
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
    'vip': {
        'ptvcid': 1,
        'cname': 'x045',
        'focus': {
            'id': 696,
            'num': 6
        },
        // 'recommend': 1003384798,
        'recommend': 1003441926,
    },
    'chuang': {
        'ptvcid': 1036,
        'cname': 'x060',
        'recommend': 1003497964,
    },
    'mengmian2': {
        'ptvcid': 11,
        'cname': 'x061',
        'recommend': 1003505984,
    },
    'test': {
        'ptvcid': 0,
        'cname': 'x046',
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