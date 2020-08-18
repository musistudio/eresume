const fs = require('fs');
const path = require('path');
const process = require('child_process');
const CryptoJS = require('crypto-js');


class Protect {
    constructor(pwd) {
        this.options = {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        }
        this.key = pwd;
    }
    decode(str) {
        let decryptedStr;
        try {
            let decryptedData = CryptoJS.AES.decrypt(str, this.key, this.options);
            decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.log('密码错误');
        }
        return decryptedStr;
    }
    encode(str) {
        var encryptedData = CryptoJS.AES.encrypt(str, this.key, this.options);
        var encryptedBase64Str = encryptedData.toString();
        return encryptedBase64Str;
    }
}


module.exports = {
    Protect,
    exec: function exec(cmd) {
        return new Promise((resolve, reject) => {
            process.exec(cmd, err => {
                if(err) {
                    reject(err);
                }else{
                    resolve();
                }
            })
        })
    },
    isFile: function isFile(tempPath) {
        return new Promise((resolve, reject) => {
            fs.stat(tempPath, (err, data) => {
                if(!err) {
                    if(data.isFile()) {
                        resolve(true);
                    }else{
                        reject('文件有误!')
                    }
                }else{
                    reject('文件不存在!');
                }
            })
        })
    },
    readFile: function readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if(err) {
                    reject(err);
                }else{
                    resolve(data.toString());
                }
            })
        })
    }
}