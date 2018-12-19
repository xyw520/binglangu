//推荐管理


var router = require('koa-router')();

var DB = require('../../model/db');

router.get('/add', async (ctx) => {

    await ctx.render('admin/recommend/add');
    
})


router.post('/doAdd', async (ctx) => {

    var addData = ctx.request.body;
    // console.log(" addData:"+ JSON.stringify (addData));
    let add_time = tools.getTime();

    addData['add_time']=add_time;

    var result = DB.insert('recommend', addData);

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/recommend');

})

module.exports = router.routes();