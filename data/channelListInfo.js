/*--
    各频道对应的cid/ptvcid转化,频道列表页的url采用的是旧的cid，所以转化成新的；
    以及频道列表页的类型等筛选项
*/
exports.changeCid = {
      '4' : 1, //电影
      '5' : 2, //电视剧
      '86' : 3, //娱乐
      '221' : 4, //体育
      '6' : 5, //动漫
      '0' : 8, //其他
      '66' : 9, //音乐
      '78' : 11, //综艺
      '12' : 12, //科教
      '13' : 13, //生活
      '169' : 14, //汽车
      '15' : 15, //电视节目
      '111' : 16, //纪录片
      '92' : 17, //公开课
      '164' : 19, //乐视制造
      '186' : 20, //风尚
      '202' : 21, //乐视出品
      '298' : 22, //财经
      '307' : 23, //旅游
      '1000003' : 1021 // 教育
};
exports.categoryInfo = {//dt 数据类型：1专辑 2视频 3明星，多参数逗号分隔
      '1': {
            'cname' : 'movie',
            'ptvcid' : 1,
            'nameCon': 'x021',
            'dt' : '1',
            'sort': {//频道list页排序
                  'new': {
                      'id': 1,
                      'name': '最新',
                      'vt': 180001
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热',
                      'vt': 180001
                  },
                  'rate': {
                      'id': 8,
                      'name': '好看',
                      'vt': 180001,
                      'isScore': '1'
                  }
            }
      },
      '5': {
            'cname' : 'comic',
            'ptvcid' : 5,
            'nameCon' : 'x022',
            'dt' : '1',
            'sort': {//频道list页排序
                  'lianzai': {
                      'id': 5,
                      'name': '连载',
                      'isEnd': '0'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热',
                      'isEnd': '1'
                  },
                  'qinzi': {
                      'id': 2,
                      'name': '亲子',
                      'ag': 511001
                  }
            }
      },
      '3': {
            'cname' : 'ent',
            'ptvcid' : 3,
            'nameCon' : 'x027',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'dayhot': {
                      'id': 4,
                      'name': '昨日热播'
                  },
                  'hot': {
                      'id': 2,
                      'name': '历史热播'
                  }
            }
      },
      '4': {
            'cname' : 'sports',
            'ptvcid' : 4,
            'nameCon' : 'x024',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热'
                  }
            }
      },
      '2': {
            'cname' : 'tv',
            'ptvcid' : 2,
            'nameCon' : 'x020',
            'dt' : '1',
            'sort': {//频道list页排序
                  'new': {
                      'id': 5,
                      'name': '跟播',
                      'isEnd': '0',
                      'vt': 180001
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热',
                      'isEnd': '1',
                      'vt': 180001
                  },
                  'rate': {
                      'id': 8,
                      'name': '好评',
                      'vt': 180001,
                      'isScore': '1'
                  }
            }
      },
      '9': {
            'cname' : 'music',
            'ptvcid' : 9,
            'nameCon' : 'x029',
            'dt' : '2',
            'sort': {//频道list页排序
                  'release': {
                      'id': 1,
                      'name': '最近发行'
                  },
                  'new': {
                      'id': 6,
                      'name': '最近更新'
                  },
                  'dayhot': {
                      'id': 4,
                      'name': '昨日热播'
                  },
                  'hot': {
                      'id': 2,
                      'name': '历史热播'
                  }
            }
      },
      '11': {
            'cname' : 'zongyi',
            'ptvcid' : '11',
            'nameCon' : 'x023',
            'dt' : '1',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最近更新'
                  },
                  'dayhot': {
                      'id': 4,
                      'name': '昨日热播'
                  },
                  'hot': {
                      'id': 2,
                      'name': '历史热播'
                  }
            }
      },
      '14': {
            'cname' : 'auto',
            'ptvcid' : '14',
            'nameCon' : 'x040',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热'
                  },
                  'rate': {
                      'id': 8,
                      'name': '好评',
                      'isScore': '1'
                  }
            },
            'secondSort':{
                  'model': '按车型',
                  'content': '按内容'
            }
      },
      '16': {
            'cname' : 'jilu',
            'ptvcid' : '16',
            'nameCon' : 'x030',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热'
                  },
                  'rate': {
                      'id': 8,
                      'name': '好评',
                      'isScore': '1'
                  }
            },
            'secondSort':{
                  'type': '类型'
            }
      },
      '20': {
            'cname' : 'fashion',
            'ptvcid' : '20',
            'nameCon' : 'x035',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热'
                  },
                  'rate': {
                      'id': 8,
                      'name': '好评',
                      'isScore': '1'
                  }
            },
            'secondSort':{
                  'videoType': '视频类型',
                  'conType': '内容类型'
            }
      },
      '22': {
            'cname' : 'finance',
            'ptvcid' : '22',
            'nameCon' : 'x031',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热'
                  },
                  'rate': {
                      'id': 8,
                      'name': '好评',
                      'isScore': '1'
                  }
            },
            'secondSort':{
                  'attribute': '属性',
                  'hot': '热点'
            }
      },
      '23': {
            'cname' : 'travel',
            'ptvcid' : '23',
            'nameCon' : 'x036',
            'dt' : '2',
            'sort': {//频道list页排序
                  'new': {
                      'id': 6,
                      'name': '最新'
                  },
                  'hot': {
                      'id': 2,
                      'name': '最热'
                  },
                  'rate': {
                      'id': 8,
                      'name': '好评',
                      'isScore': '1'
                  }
            },
            'secondSort':{
                  'style': '旅游方式',
                  'subject': '旅游主题'
            }
      },
      '8': {
            'cname' : 'default',
            'ptvcid' : '8',
            'nameCon' : '其他',
            'dt' : '2'
      },
      '1021': {
            'cname' : 'edu',
            'ptvcid' : '1021',
            'nameCon' : 'x039',
            'dt' : '1',
            'sort': {
                  'new': {
                      'id': 6,
                      'name': '最新更新'
                  },
                  'dayhot': {
                      'id': 4,
                      'name': '昨日热播'
                  },
                  'hot': {
                      'id': 2,
                      'name': '历史热播'
                  }
            },
            'secondSort':{
                  'age': '年龄',
                  'type': '类型'
            }
      },
      //热点
      '30': {
            'nameCon' : 'x043',
      },
      //亲子
      '34': {
            'cname' : 'qinzi',
            'nameCon' : 'x033',
      },
      //资讯
      '1009': {
            'cname' : 'news',
            'nameCon' : 'x034',
      },
      //乐享
      '1029': {
            'cname' : 'ugc',
            'nameCon' : 'x041',
      }
}