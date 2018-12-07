const Koa = require('koa'),
    router = require('koa-router')(),
    path = require('path'),
    render = require('koa-art-template'),
    static = require('koa-static'),
    session=require('koa-session'),
    bodyParser=require('koa-bodyparser'),
    jsonp=require('koa-jsonp'),
    sd=require('silly-datetime');//格式化日期

//实例化
var app = new Koa();

//配置jsonp中间件
app.use(jsonp());


//配置 post提交数据的中间价
app.use(bodyParser());


//配置session中间件
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', 
  maxAge: 86400000,
  autoCommit: true, 
  overwrite: true, 
  httpOnly: true,
  signed: true,
  rolling: true,    //每次请求都重新设置session
  renew: false, 
};
 
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(value,'YYYY-MM-DD HH:mm') //扩展模板里面的方法
    }
});

//配置 静态资源中间件

app.use(static(__dirname + '/statics'))


//引入子模块

const admin = require('./routes/admin.js');
const api = require('./routes/api.js');
const index = require('./routes/index.js')

//配置路由
router.use('/admin', admin);
router.use('/api', api);
router.use(index);

//启动路由

app.use(router.routes()).use(router.allowedMethods());

app.listen(8001);