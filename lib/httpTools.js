/**
 * Created by liangshan on 16/9/23.
 */

"use strict";

const http = require('http');
const request = $require('lib/request');
const parseJson = $require('lib/parseJson');


exports.get = function* (url, num) {
    let data = yield request(url, num || 2, (data) => {
        return data || '';
    });
    return data || '';
};

const get = (url, cb) => {
    http.get(url, function (res) {
        let msg = '';
        res.on('data', (chunk) => {
            msg += chunk;
        });
        res.on('end', () => {
            return cb(null, msg);
        });
    }).on('error', (e) => {
        console.error('-----error----');
        console.error(e);
        return cb(err);
    });
};

exports.getPartials = (url) => {
    return request(url, 2);
};

exports.getHttpReq = (url) => {
    return new Promise(function (resolve, reject) {
        get(url, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(parseJson(result));
            }
        });
    });

    //promise.then(function (data) {
    //    return data;
    //}, function (error) {
    //    console.info(error);
    //    if (error) {
    //        console.error(error);
    //        return null;
    //    }
    //});
};

