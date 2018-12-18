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

    var page = ctx.query.page || 1;

    var pageSize = 5;

    var result = await DB.find('article', {}, {}, {
        'page': page, 'pageSize': pageSize,  sortJson:{
            'add_time':-1
        }
    });


    var count = await DB.count('article', {});

    // ctx.body='articlecate'
    await ctx.render('admin/article/index', {
        list: result,
        page: page,
        totalPage: Math.ceil(count / pageSize)
    });

})

router.get('/add', async (ctx) => {

    //查询分类数据

    var cateList = await DB.find('articlecate', {});


    await ctx.render('admin/article/add', {
        catelist: cateList
    });
})

router.get('/edit', async (ctx) => {


    //查询分类数据

    var id = ctx.query.id;
    console.log("id:" + id);
    var cateList = await DB.find('articlecate', {});
    //当前要编辑的数据
    var articlelist = await DB.find('article', { "_id": DB.getObjectId(id) });


    await ctx.render('admin/article/edit', {
        catelist: tools.cateToList(cateList),
        articlelist: articlelist[0]
    });

})

router.post('/doEdit', upload.single('img_url'), async (ctx) => {

    console.log("ctx.req.body:" + JSON.stringify(ctx.req.body))

    let prevPage = ctx.req.body.prevPage || '';  /*上一页的地址*/
    let id = ctx.req.body.id;
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let pic = ctx.req.body.author;
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '';

    img_url=img_url.replace(/\\/g, "/");    //正则替换 

    let add_time = tools.getTime();
    //属性的简写
    //注意是否修改了图片          var           let块作用域
    if (img_url) {
        var json = {
            pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url,add_time
        }
    } else {
        var json = {
            pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content,add_time
        }
    }

    console.log("json:" + JSON.stringify(json))
    console.log("id:" + id)
    await DB.update('article', { "_id": DB.getObjectId(id) }, json);


    //跳转
    if (prevPage) {
        ctx.redirect(prevPage);

    } else {
        ctx.redirect(ctx.state.__HOST__ + '/admin/article');
    }


})



// router.post('/doAdd',upload.single('img_url'), async (ctx) => {


//     ctx.body={
//         filename:ctx.req.file?ctx.req.file.filename:'',//返回文件名
//         body:ctx.req.body
//     }

//     var result=DB.insert('article',ctx.body.body);

//      ctx.redirect(ctx.state.__HOST__+'/admin/article');

// })

//post接收数据
router.post('/doAdd', upload.single('img_url'), async (ctx) => {

    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    // let pic=ctx.req.body.author;
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '';

    img_url=img_url.replace(/\\/g, "/");    //正则替换  

    console.log('img_url:'+img_url)

    let add_time = tools.getTime();

    //console.log(img_url);
    //属性的简写
    let json = {
        pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url, add_time
    }

    var result = DB.insert('article', json);

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/article');

})

router.get('/ueditor', async (ctx) => {

    // ctx.body='ue';
    // return;
    await ctx.render('admin/article/ueditor');


})


module.exports = router.routes();
