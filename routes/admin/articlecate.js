var router = require('koa-router')();

var DB = require('../../model/db');

var tools = require('../../model/tools');


router.get('/', async (ctx) => {



    var result = await DB.find('articlecate', {});

    // ctx.body='articlecate'
    await ctx.render('admin/articlecate/index', {
        list: tools.cateToList(result)
    });

})

router.get('/add', async (ctx) => {

    //获取一级分类
    var result = await DB.find('articlecate', { 'pid': '0' })

    console.log(result)


    await ctx.render('admin/articlecate/add', {
        catelist: result
    });
    // ctx.body='articlecate/add'
})

router.post('/doAdd', async (ctx) => {
    //1.获取表单提交的数据
    //2.验证表单数据是否合法
    //3.在数据库查询当前要增加的管理员是否存在
    //4.增加管理员
    var addData = ctx.request.body;

    // console.log("addData:" + JSON.stringify(addData))

    var result = await DB.insert('articlecate', addData);

    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate');

    // var username = ctx.request.body.username;

    // var pwd = ctx.request.body.pwd;

    // var repwd = ctx.request.body.repwd;

    // if (!/^\w{3,20}/.test(username)) {
    //   await  ctx.render('admin/error', {
    //         message: '用户名不合法',
    //         redirect: ctx.state.__HOST__ + '/admin/manage/add'
    //     })
    // } else if (pwd != repwd || pwd.length > 6) {
    //     await  ctx.render('admin/error', {
    //         message: '密码和确认密码不一致，或者密码长度小于6位',
    //         redirect: ctx.state.__HOST__ + '/admin/manage/add'
    //     })
    // } else {
    //     //数据库查询当前管理员是否存在
    //     var result = await DB.find('user', { "username": username });
    //     if (result.length > 0) {
    //         await    ctx.render('admin/error', {
    //             message: '此管理员已经存在，请换个用户名',
    //             redirect: ctx.state.__HOST__ + '/admin/manage/add'
    //         })

    //     } else {
    //         //增加管理员
    //         var result2 = await DB.insert('user', { "username": username, "pwd": tools.md5(pwd), "status": 1, "last_time": '' });

    //         ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
    //     }
    // }



})

router.get('/del', async (ctx) => {
    ctx.body = '删除用户'
})

router.get('/edit', async (ctx) => {

    //获取一级分类
    var listAll = await DB.find('articlecate', { 'pid': '0' });

    // console.log("listAll:" + JSON.stringify(listAll));

    // ctx.body='edit'
    var id = ctx.query.id;
    console.log("editid:"+id)
    var result = await DB.find('articlecate', { "_id": DB.getObjectId(id) });   

    // console.log("edit--result:" + JSON.stringify(result))

    await ctx.render('admin/articlecate/edit', {
        listAll: listAll,
        list: result[0]
      
    })

})

router.post('/doEdit', async (ctx) => {

    var id = ctx.request.body.id;
   

    var result = await DB.find('articlecate', { "_id": DB.getObjectId(id) });   

   

    try {
        var id = ctx.request.body.id;

        var title = ctx.request.body.title;

        var pid = ctx.request.body.pid;

        var keywords = ctx.request.body.keywords;

        var description = ctx.request.body.description;

        // console.log("pwd.length:" + pwd.length)

        // var result = await DB.insert('articlecate', addData);

        var updateResult = await DB.update('articlecate', { "_id": DB.getObjectId(id) }, { title,pid,keywords,description });

        // console.log()

        ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate');

        // if (pwd != '') {
        //     if (pwd != repwd || pwd.length > 6) {
        //         await ctx.render('admin/error', {
        //             message: '密码和确认密码不一致，或者密码长度小于6位',
        //             redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
        //         })
        //     } else {
        //         //更新密码
        //         var updateResult = await DB.update('user', { "_id": DB.getObjectId(id) }, { "pwd": tools.md5(pwd) });
        //         ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
        //     }

        // } else {
        //     ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
        // }


    } catch (error) {
        await ctx.render('admin/error', {
            message: error,
            redirect: ctx.state.__HOST__ + '/admin/articlecate/edit?id=' + id
        })
    }


})

module.exports = router.routes();
