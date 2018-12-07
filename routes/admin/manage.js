var router = require('koa-router')();

var DB = require('../../model/db');

var tools = require('../../model/tools');

router.get('/', async (ctx) => {

    var result = await DB.find('user', {});

    console.log(result)
    await ctx.render('admin/manage/list', {
        list: result
    });
})



router.get('/', async (ctx) => {
    await ctx.render('admin/manage/list');
})

router.get('/add', async (ctx) => {
    await ctx.render('admin/manage/add');
})

router.post('/doAdd', async (ctx) => {
    //1.获取表单提交的数据
    //2.验证表单数据是否合法
    //3.在数据库查询当前要增加的管理员是否存在
    //4.增加管理员

    var username = ctx.request.body.username;

    var pwd = ctx.request.body.pwd;

    var repwd = ctx.request.body.repwd;

    if (!/^\w{3,20}/.test(username)) {
      await  ctx.render('admin/error', {
            message: '用户名不合法',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })
    } else if (pwd != repwd || pwd.length > 6) {
        await  ctx.render('admin/error', {
            message: '密码和确认密码不一致，或者密码长度小于6位',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })
    } else {
        //数据库查询当前管理员是否存在
        var result = await DB.find('user', { "username": username });
        if (result.length > 0) {
            await    ctx.render('admin/error', {
                message: '此管理员已经存在，请换个用户名',
                redirect: ctx.state.__HOST__ + '/admin/manage/add'
            })

        } else {
            //增加管理员
            var result2 = await DB.insert('user', { "username": username, "pwd": tools.md5(pwd), "status": 1, "last_time": '' });

            ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
        }
    }



})

router.get('/del', async (ctx) => {
    ctx.body = '删除用户'
})

router.get('/edit', async (ctx) => {
    var id = ctx.query.id;
    var result = await DB.find('user', { "_id": DB.getObjectId(id) });

    await ctx.render('admin/manage/edit', {
        list: result
    })

})

router.post('/doEdit', async (ctx) => {
    try {
        var id = ctx.request.body.id;

        var username = ctx.request.body.username;

        var pwd = ctx.request.body.pwd;

        var repwd = ctx.request.body.repwd;

        console.log("pwd.length:"+pwd.length)

        if (pwd != '') {
            if (pwd != repwd || pwd.length > 6) {
                await    ctx.render('admin/error', {
                    message: '密码和确认密码不一致，或者密码长度小于6位',
                    redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
                })
            } else {
                //更新密码
                var updateResult = await DB.update('user', { "_id": DB.getObjectId(id)},{"pwd":tools.md5(pwd)} );
                ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
            }

        }else{
            ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
        }

       
    } catch (error) {
        await ctx.render('admin/error', {
            message: error,
            redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
        })
    }


})

module.exports = router.routes();
