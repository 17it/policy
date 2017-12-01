## 详情页配置页面
## 动漫 综艺 电影 电视剧四大频道
---

本机端口号：8013

本机路由为：http://127.0.0.1:8013/tv/10037872.html

线上路由为：http://www.le.com/tv/10037872.html

nginx 配置路由可以为：
```
location  ~ ^/(tv|zongyi|comic|movie) {
    proxy_pass  http://127.0.0.1:8013;
    expires     1m;
}
```

运行script配置在package.json文件中

> node运行方式：

```
$ npm run detail
```

> pm2运行方式：

```
$ npm run detail:pm2
```