var  router=require('koa-router')();

var DB=require('../model/db.js')

router.get('/',async(ctx)=>{
    // ctx.body='前台首页'
   console.time('start')
    var navResult=await DB.find('nav',{$or:[{"status":"1"},{"status":1}]},{},{
        sortJson:{'sort':1}
    });
    console.log(navResult);

    var focusResult=await DB.find('focus',{$or:[{"status":"1"},{"status":1}]},{},{
        sortJson:{'sort':1}
    });

    var articleCateResult=await DB.find('articlecate',{$or:[{"status":"1"},{"status":1}]},{},{
        sortJson:{'sort':1}
    });

    var articleResult=[]

    for(let i=0;i<4;i++){
        console.log("i:"+i);
        console.log("articleCateResult[i].title"+articleCateResult[i].title)
        articleResult[i]=await DB.find('article',{$or:[{"status":"1"},{"status":1}],'pid':(articleCateResult[i]._id).toString() },{},{
            sortJson:{'sort':1}
        });
        console.log(" articleResult[i]:"+JSON.stringify( articleResult[i]))
    }


    console.log("articleResult:"+JSON.stringify(articleResult) )
    console.timeEnd('start')

    ctx.render('default/index',{
        nav:navResult,
        focus:focusResult,
        article:articleResult,
        cate:articleCateResult
    });
})

router.get('/news',(ctx)=>{
    ctx.render('default/list-news');
})

router.get('/about',(ctx)=>{
    ctx.body='关于我们'
})

router.get('/case',(ctx)=>{
    ctx.body='案例'
})

router.get('/connect',(ctx)=>{
    ctx.body='联系我们'
})


module.exports=router.routes()

