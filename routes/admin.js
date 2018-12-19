var router = require('koa-router')();

var user = require('./admin/user');
var login = require('./admin/login');
var manage = require('./admin/manage');
var index = require('./admin/index');
var articlecate = require('./admin/articlecate');
var article = require('./admin/article');
var ueditor=require('koa2-ueditor');
var focus=require('./admin/focus');
var link=require('./admin/link');
var nav=require('./admin/nav');
var recommend=require('./admin/recommend');
var setting=require('./admin/setting');
var url = require('url')

//配置中间件  获取url的地址

router.use(async (ctx, next) => {
    //模板引擎配置全局变量

    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;


    var path = url.parse(ctx.request.url).pathname;

    //左侧菜单选中
    var splitPath=path.substring(1).split('/');
    // console.log("splitPath:"+JSON.stringify(splitPath))
    ctx.state.G={
        url:splitPath,
        userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers['referer'] //上一页的地址
    }


    //权限判断
    if (ctx.session.userinfo) {
        await next();
    } else {
        if (path == '/admin/login' || path == '/admin/login/doLogin' || path == '/admin/login/code') {
            await next();
        } else {
            ctx.redirect('/admin/login');
        }

    }

})

router.get('/', async (ctx) => {

    ctx.render('admin/index')
})

//后台首页
router.use(index);

router.use('/login', login);
router.use('/user', user);
router.use('/manage', manage);
router.use('/articlecate', articlecate);
router.use('/article', article);
router.use('/focus', focus);
router.use('/link', link);
router.use('/nav', nav);
router.use('/recommend', recommend);
router.use('/setting', setting);

router.all('/editor/controller', ueditor(['statics', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports = router.routes();

