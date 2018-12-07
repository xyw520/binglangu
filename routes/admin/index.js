var router = require('koa-router')();

var DB = require('../../model/db');

router.get('/', async (ctx) => {
    await ctx.render('admin/index');
})


//改变排序的ajax接口
router.get('/changeSort', async (ctx) => {


    var collectionName = ctx.query.collectionName;
    var id = ctx.query.id;
    var sortvalue = ctx.query.sortvalue;

    //更新的数据

    var json={
        sort:sortvalue
    }

    let updateResult = await DB.update(collectionName, { '_id': DB.getObjectId(id) }, json);


    if (updateResult) {
        console.log('更新成功')
        ctx.body = { "message": "更新成功", "success": true }
    } else {
        console.log('更新失败')
        ctx.body = { "message": "更新失败", "success": false }
    }


    // var data2=await DB.find(collectionName,{'_id':DB.getObjectId(id)});

    // console.log("JSON.stringify(data2):"+JSON.stringify(data2))


    // await ctx.render('admin/manage/add');
})




router.get('/changeStatus', async (ctx) => {

    // console.log(ctx.query);

    // ctx.body={'message':'更新成功','success':true};

    var collectionName = ctx.query.collectionName;
    var attr = ctx.query.attr;
    var id = ctx.query.id;

    var data = await DB.find(collectionName, { '_id': DB.getObjectId(id) });

    console.log("JSON.stringify(data):" + JSON.stringify(data))

    if (data.length > 0) {
        if (data[0][attr] == 1) {
            var json = {  //es6属性名表达式
                [attr]: 0
            };
        } else {
            var json = {
                [attr]: 1
            }
        }

        let updateResult = await DB.update(collectionName, { '_id': DB.getObjectId(id) }, json);


        if (updateResult) {
            console.log('更新成功')
            ctx.body = { "message": "更新成功", "success": true }
        } else {
            console.log('更新失败')
            ctx.body = { "message": "更新失败", "success": false }
        }
    } else {
        ctx.body = { "message": "更新失败,参数错误", "success": false }
    }

    // var data2=await DB.find(collectionName,{'_id':DB.getObjectId(id)});

    // console.log("JSON.stringify(data2):"+JSON.stringify(data2))


    // await ctx.render('admin/manage/add');
})

router.get('/del', async (ctx) => {


    try {
        var collectionName = ctx.query.collection;
        var id = ctx.query.id;

        var result = await DB.remove(collectionName, { "_id": DB.getObjectId(id) });

        await ctx.redirect(ctx.state.G.prevPage);   //因为是公共的方法，所以需要从哪儿来到哪儿去
    } catch (error) {
        await ctx.redirect(ctx.state.G.prevPage);
    }

})



module.exports = router.routes();
