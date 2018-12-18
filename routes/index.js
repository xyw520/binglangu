var router = require('koa-router')();

var DB = require('../model/db.js');
var url = require('url')

router.use(async (ctx, next) => {
    //模板引擎配置全局变量

    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;

    ctx.state.nav = await DB.find('nav', { $or: [{ "status": "1" }, { "status": 1 }] }, {}, {
        sortJson: { 'sort': 1 }
    });

    ctx.state.pathname = url.parse(ctx.request.url).pathname.substring(1);


    console.log(" ctx.state.__HOST__:" + ctx.state.__HOST__);

    await next();
})


router.get('/', async (ctx) => {
    // ctx.body='前台首页'
    console.time('start')
    // navResult=await DB.find('nav',{$or:[{"status":"1"},{"status":1}]},{},{
    //     sortJson:{'sort':1}
    // });
    // console.log(navResult);

    var focusResult = await DB.find('focus', { $or: [{ "status": "1" }, { "status": 1 }] }, {}, {
        sortJson: { 'sort': 1 }
    });

    var articleCateResult = await DB.find('articlecate', { $or: [{ "status": "1" }, { "status": 1 }] }, {}, {
        sortJson: { 'sort': 1 }
    });

    var articleResult = []

    for (let i = 0; i < 4; i++) {
        console.log("i:" + i);
        console.log("articleCateResult[i].title" + articleCateResult[i].title)
        articleResult[i] = await DB.find('article', { $or: [{ "status": "1" }, { "status": 1 }], 'pid': (articleCateResult[i]._id).toString() }, {}, {
            sortJson: { 'sort': 1 }
        });
        console.log(" articleResult[i]:" + JSON.stringify(articleResult[i]))
    }


    console.log("articleResult:" + JSON.stringify(articleResult))
    console.timeEnd('start')

    ctx.render('default/index', {
        // nav:navResult,
        focus: focusResult,
        article: articleResult,
        cate: articleCateResult
    });
})

router.get('/gonglue', async (ctx) => {

    // var navResult=await DB.find('nav',{$or:[{"status":"1"},{"status":1}]},{},{
    //     sortJson:{'sort':1}
    // });

    // let articleCateResult=await DB.find('articlecate',{$or:[{"status":"1"},{"status":1}],'_id':DB.getObjectId('5c062de0e5c96b23843576d0')},{},{
    //     sortJson:{'sort':1}
    // });

    let articleGonglue = await DB.find('article', { $or: [{ "status": "1" }, { "status": 1 }], 'pid': '5c062de0e5c96b23843576d0' }, {}, {
        sortJson:{
            'sort':1
        }
    });

    //db.article.find({},{title:1}).sort('sort':1)  查询指定字段，排序

    // console.log("articleGonglue:" + JSON.stringify(articleGonglue))

    ctx.render('default/list', {
        list: articleGonglue,
        // nav:navResult,
    });

})

router.get('/hotel',async (ctx) => {
    let articleGonglue = await DB.find('article', { $or: [{ "status": "1" }, { "status": 1 }], 'pid': '5c062d89e5c96b23843576cd' }, {}, {
        sortJson:{
            'sort':1
        }
    });

    ctx.render('default/list', {
        list: articleGonglue,
        // nav:navResult,
    });

})

router.get('/food',async (ctx) => {
    let articleGonglue = await DB.find('article', { $or: [{ "status": "1" }, { "status": 1 }], 'pid': '5c062daae5c96b23843576ce' }, {}, {
        sortJson:{
            'sort':1
        }
    });

    ctx.render('default/list', {
        list: articleGonglue,
        // nav:navResult,
    });

})

router.get('/about', (ctx) => {
    console.log("ctx.params:" + JSON.stringify(ctx.query))
    ctx.body = '关于我们'
})



router.get('/connect', (ctx) => {
    ctx.body = '联系我们'
})

router.get('/info/:id', async (ctx) => {
    console.log("ctx.params:" + JSON.stringify(ctx.params));

    let id = ctx.params.id;

    let content = await DB.find('article', { '_id': DB.getObjectId(id) });

    console.log("content:" + JSON.stringify(content))

    //获取当前文章的分类信息
    var cateResult = await DB.find('articlecate', { '_id': DB.getObjectId(content[0].pid) });

    if (cateResult[0].pid!="0") {
        //找到当前分类的父分类
        var pcateResult = await DB.find('articlecate', { '_id': DB.getObjectId(cateResult[0].pid) });

        var navResult = await DB.find('nav', { $of: [{ 'title': cateResult[0].title }, { 'title': pcateResult[0].title }] })

    } else {
        //在导航表查找当前分类对应的url信息
        var navResult = await DB.find('nav', { 'title': cateResult[0].title })

    }

    if (navResult) {
        //把url赋值给pathname
        ctx.state.pathname = navResult[0]['url']
    } else {
        ctx.state.pathname = '/'
    }




    ctx.render('default/info', {
        content: content[0]
    })

})


module.exports = router.routes()

