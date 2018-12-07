var router = require('koa-router')();

var DB = require('../../model/db');

var tools = require('../../model/tools');

//引入图片上传模块

const multer = require('koa-multer');
// const file = require('file');
//配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'statics/upload/') //注意路径必须存在,上传的目录
    },//修改文件名称
    filename: function (req, file, cb) {    //重命名上传后的图片
        var fileFormat = (file.originalname).split(".");    //获取后缀名  分割数组
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage })



router.get('/', async (ctx) => {

    var result = await DB.find('link', {}, {},{
        sort:{ 'add_time':-1}
    });

    await ctx.render('admin/link/index', {
        list: result
    });
})

router.get('/add', async (ctx) => {

    await ctx.render('admin/link/add');
    
})


router.post('/doAdd',upload.single('pic'), async (ctx) => {

    let title = ctx.req.body.title.trim();
    // let pic=ctx.req.body.author;
    let status = ctx.req.body.status;
    let url = ctx.req.body.url;
    let add_time = tools.getTime();

    //console.log(img_url);
    //属性的简写
    let json = {
        title, status,url, add_time
    }

    var result = DB.insert('link', json);

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/link');

})

router.get('/del', async (ctx) => {
    ctx.body = '删除用户'
})

router.get('/edit', async (ctx) => {

    var id = ctx.query.id;
    var list = await DB.find('link', { '_id': DB.getObjectId(id) });

    await ctx.render('admin/link/edit', {
        list: list[0]
    });


})

router.post('/doEdit', async (ctx) => {

    let id = ctx.request.body.id;
    let title = ctx.request.body.title.trim();
    let url = ctx.request.body.url;
    let status = ctx.request.body.status;
    let add_time = tools.getTime();

    let json = {
        title, status,url, add_time
    }

    await DB.update('link', { "_id": DB.getObjectId(id) }, json);

    ctx.redirect(ctx.state.__HOST__ + '/admin/link');

})

module.exports = router.routes();
