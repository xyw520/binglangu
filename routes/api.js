 var router =require('koa-router')();


 router.get('/',(ctx)=>{
    ctx.body='api'
})

 router.get('/newslist',(ctx)=>{
     ctx.body={"title":"这是一个新闻接口"}
 })

 router.get('/focus',(ctx)=>{
    ctx.body={"title":"这是一个轮播图接口"}
})

module.exports=router.routes()