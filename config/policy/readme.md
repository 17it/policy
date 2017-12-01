##
---

本机端口号：8080

本机路由为：http://127.0.0.1:8080/

nginx 配置路由可以为：
```
location  ~ ^/* {
    proxy_pass  http://127.0.0.1:8080;
    expires     1m;
}
```

运行script配置在package.json文件中

> node运行方式：

```
$ npm run policy
```

> pm2运行方式：

```
$ npm run policy:pm2
```