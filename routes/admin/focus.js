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
    var result = await DB.find('focus', {},{},{
        sort:{ 'add_time':-1}
    });

    await ctx.render('admin/focus/index', {
        list: result

    });
})

router.get('/add', async (ctx) => {

    await ctx.render('admin/focus/add');
    
})


router.post('/doAdd',upload.single('pic'), async (ctx) => {

    console.log("ctx.req.body:"+JSON.stringify(ctx.req.body))

    let title = ctx.req.body.title.trim();
    // let pic=ctx.req.body.author;
    let status = ctx.req.body.status;
    let desc = ctx.req.body.desc || '';
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let url = ctx.req.body.url;
   
    pic=pic.replace(/\\/g, "/");    //正则替换  

    let add_time = tools.getTime();

    //console.log(img_url);
    //属性的简写
    let json = {
        title, status, desc, pic, url, add_time
    }

    var result = DB.insert('focus', json);
    console.log("result:"+result)

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');

})

router.get('/del', async (ctx) => {
    ctx.body = '删除用户'
})

router.get('/edit', async (ctx) => {

    var id = ctx.query.id;
    var list = await DB.find('focus', { '_id': DB.getObjectId(id) });

    console.log("list:"+JSON.stringify(list))

    await ctx.render('admin/focus/edit', {
        list: list[0]

    });


})

router.post('/doEdit',upload.single('pic'), async (ctx) => {

    console.log("ctx.req.body:" + JSON.stringify(ctx.req.body))

    let id = ctx.req.body.id;
    let title = ctx.req.body.title.trim();
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let desc = ctx.req.body.desc ;

    console.log("desc:"+desc)

    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';

    pic=pic.replace(/\\/g, "/");    //正则替换  
    // console.log("ctx.req.file.path:"+ctx.req.file.path)

    let add_time = tools.getTime();

     //注意是否修改了图片          var           let块作用域
     if (pic) {
        var json = {
            title, url, status, desc, pic,add_time
        }
    } else {
        var json = {
            title, url, status, desc,add_time
        }
    }
   
    await DB.update('focus', { "_id": DB.getObjectId(id) }, json);

    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');


})

module.exports = router.routes();
