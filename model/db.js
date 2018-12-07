
var MongoDB=require('mongodb');
const ObjectID = MongoDB.ObjectID;

var MongoClient = require('mongodb').MongoClient;

var Config = require('./config.js');



class Db {

    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor() {
        this.dbClient = '';
        this.connect();
    }

    connect() {
        let _that = this;
        return new Promise((resolve, reject) => {
            if (!_that.dbClient) { //解决数据库多次连接的问题
                MongoClient.connect(Config.dbUrl,{useNewUrlParser:true}, (err, client) => {
                    if (err) {
                        reject(err);
                        return;
                    } else {
                        _that.dbClient=client.db(Config.dbName);
                        resolve(_that.dbClient)
                    }
                })
            }else{
                resolve(_that.dbClient)
            }

        })

    }
/*
    find(collecionName, json) {

        return new Promise((resolve, reject) => {

            this.connect().then((db) => {
                var result = db.collection(collecionName).find(json);
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs)
                })
            })

        })


    }

    */

    //js中实参和形参可以不一样  arguments对象接收实参传过来的数据

   find(collecionName, json1,json2,json3) {
    /*
        DB.find('user',{}) //返回所有数据
        DB.find('user',{},{'title':1}) //返回所有数据 只返回一列
        DB.find('user',{},{'title':1},{
            page:2,
            pageSize20
        }) //返回第二页数据  

        DB.find('user',{},{'title':1},{
            page:2,
            pageSize20，
            sort:-1
        }) //返回第二页数据  并且排序

        */

        if(arguments.length==2){

            var attr={};
            var skipNum=0;
            var pageSize=0;

        }else if(arguments.length==3){

            var attr=json2;
            var skipNum=0;
            var pageSize=json2.pageSize || 20;

        }else if(arguments.length==4){
            
            var attr=json3;
            var page=json3.page || 1;
           
            var pageSize=json3.pageSize || 20;

            var skipNum=(page-1)*pageSize;

            if(json3.sort){
                var sortJosn=json3.sort;
            }else{
                var sortJosn={}
            }

        }else{
            console.log('参数错误')
        }


    return new Promise((resolve, reject) => {

        this.connect().then((db) => {
            // var result = db.collection(collecionName).find(json);

            var result = db.collection(collecionName).find(json1,{field:attr}).skip(skipNum).limit(pageSize).sort(sortJosn);

            result.toArray(function (err, docs) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(docs)
            })
        })

    })


}

    insert(collecionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collecionName).insertOne(json,function(err,result){
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }

    update(collecionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collecionName).updateOne(json1,{
                    $set:json2
                },(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }

    
    remove(collecionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collecionName).removeOne(json,(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }

    //统计数量的方法
    count(collecionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
               var result= db.collection(collecionName).countDocuments(json);
               result.then(function(count){
                   resolve(count);
               })
            })
        })
    }

    getObjectId(id){    /*mongodb里面查询 _id 把字符串转换成对象*/

        return new ObjectID(id);
    }




}


// var mdb = Db.getInstance();

// setTimeout(function () {
//     console.time('start')
//     mdb.find('user', {}).then(function (data) {
//         // console.log(data);
//         console.timeEnd('start')
//     })
// }, 100)

// setTimeout(function () {
//     console.time('start1')
//     mdb.find('user', {}).then(function (data) {
//         // console.log(data);
//         console.timeEnd('start1')
//     })
// }, 2000)

// var mdb2 = Db.getInstance();

// setTimeout(function () {
//     console.time('start2')
//     mdb2.find('user', {}).then(function (data) {
//         // console.log(data);
//         console.timeEnd('start2')
//     })
// }, 5000)

module.exports=Db.getInstance()