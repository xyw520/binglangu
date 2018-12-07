var router=require('koa-router')();

var DB=require('../../model/db');

var tools=require('../../model/tools');


router.get('/',async (ctx)=>{
    var result = await DB.find('focus', {});
    await ctx.render('admin/focus/index', {
        list: result
       
    });
})


router.get('/add',async (ctx)=>{
    // await ctx.render('admin/user/add');

    ctx.body='轮播图增加'
})

router.get('/del',async (ctx)=>{
    ctx.body='删除用户'
})

router.get('/edit',async (ctx)=>{

    

    ctx.body='编辑用户'
})

module.exports=router.routes();
