const router = require('koa-router')();

const tools = require('../../model/tools');

const DB = require('../../model/db');

//验证码模块
var svgCaptcha = require('svg-captcha');

router.get('/', async (ctx) => {
    // ctx.body='login'

    await ctx.render('admin/login')
})

router.get('/loginOut', async (ctx) => {
    // ctx.body='login'

   ctx.session.userinfo=null;
   ctx.redirect(ctx.state.__HOST__+"/admin/login");
})

router.post('/doLogin', async (ctx) => {
    // ctx.body='login'

    // await ctx.render('admin/doLogin')

    let username = ctx.request.body.username;
    let pwd = ctx.request.body.pwd;
    let code=ctx.request.body.code;

    //1.验证用户名密码是否合法
    //2.去数据库匹配
    //3.成功以后把用户信息写入session
    console.log("code:"+ctx.session.code)
    if(code.toLocaleLowerCase()==ctx.session.code.toLocaleLowerCase()){
        // console.log("tools.md5(pwd):"+tools.md5(pwd))

        //后台也要验证用户名密码验证码是否合法，防止有特殊字符，sql注入等

        var result = await DB.find('user', { "username": username, "pwd": tools.md5(pwd) })
    
        // console.log(result)
    
        if (result.length > 0) {
            console.log("login ok");
    
            ctx.session.userinfo = result[0];

            //更新用户表 改变用户登录时间

           var objid= DB.getObjectId(result[0]._id)

            await DB.update('user',{"_id":DB.getObjectId(result[0]._id)},{
                last_time:new Date()
            })
    
            ctx.redirect(ctx.state.__HOST__ + '/admin')
        } else {
            console.log('login no');

            ctx.render('admin/error',{
                message:'用户名或者密码错误',
                redirect:ctx.state.__HOST__+ '/admin/login'
            })
        }
    }else{
        console.log('code no');

        ctx.render('admin/error',{
            message:'验证码错误',
            redirect:ctx.state.__HOST__+ '/admin/login'
        })


    }
   

    // console.log(ctx.request.body)
})

router.get('/code', async (ctx) => {
    //svgCaptcha.createMathExpr  加法验证码
    var captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 120,
        height: 34,
        background: '#cc9966'
    });
    
    console.log("captcha.text:"+captcha.text)

    //保存生成的验证码
    ctx.session.code=captcha.text;
    //设置响应头
    ctx.response.type='image/svg+xml';

    // res.type('svg');
    // res.status(200).send(captcha.data);

    ctx.body = captcha.data

})


module.exports = router.routes();
