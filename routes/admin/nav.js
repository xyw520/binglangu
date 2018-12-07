var router = require('koa-router')();

var DB = require('../../model/db');

var tools = require('../../model/tools');




router.get('/', async (ctx) => {

    var result = await DB.find('nav', {}, {},{
        sort:{ 'add_time':-1}
    });

    await ctx.render('admin/nav/index', {
        list: result
    });
})

router.get('/add', async (ctx) => {

    await ctx.render('admin/nav/add');
    
})


router.post('/doAdd', async (ctx) => {

    var addData = ctx.request.body;
    // console.log(" addData:"+ JSON.stringify (addData));
    let add_time = tools.getTime();

    addData['add_time']=add_time;

    var result = DB.insert('nav', addData);

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/nav');

})

router.get('/del', async (ctx) => {
    ctx.body = '删除用户'
})

router.get('/edit', async (ctx) => {

    var id = ctx.query.id;
    var list = await DB.find('nav', { '_id': DB.getObjectId(id) });

    await ctx.render('admin/nav/edit', {
        list: list[0]
    });


})

router.post('/doEdit', async (ctx) => {
    var id= ctx.request.body.id;
    var addData = ctx.request.body;
    console.log(" addData:"+ JSON.stringify (addData));
    let add_time = tools.getTime();

    addData['add_time']=add_time;

    await DB.update('nav', { "_id": DB.getObjectId(id) }, addData);

    ctx.redirect(ctx.state.__HOST__ + '/admin/nav');

})

module.exports = router.routes();
