var router = require('koa-router')();

var DB = require('../../model/db');

var tools = require('../../model/tools');



router.get('/', async (ctx) => {

    var result = await DB.find('setting', {}, {}, {
        sort: { 'add_time': -1 }
    });

    console.log(result);

    await ctx.render('admin/setting/index', {
        list: result[0]
    });


})

router.post('/doEdit', tools.multer().single('site_logo'), async (ctx) => {
    let site_title = ctx.req.body.site_title.trim();
    let site_keywords = ctx.req.body.site_keywords.trim();
    let site_description = ctx.req.body.site_description.trim();
    let site_kefuQQ = ctx.req.body.site_kefuQQ.trim();
    let site_icp = ctx.req.body.site_icp.trim();
    let site_status = ctx.req.body.site_status.trim();
    let site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : '';

    if (site_logo) {
        //属性的简写
        var  json = {
            site_title, site_keywords, site_description, site_kefuQQ, site_icp, site_status, site_logo
        }
    } else {
        //属性的简写
        var json = {
            site_title, site_keywords, site_description, site_kefuQQ, site_icp, site_status, 
        }
    }


    await DB.update('setting', {}, json)

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/setting');


})





module.exports = router.routes();
