

var app={

    toggle:function(el,collectionName,attr,id){
        $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(data){
            console.log("返回数据："+JSON.stringify(data))
            if(data.success){
                // alert($(el).children(":first").attr('class')) 
                if($(el).children(":first").attr('class').indexOf('icon-ok')!=-1){
                    $(el).attr('class','btn btn-xs btn-default');
                    $(el).children(":first").attr('class','icon-remove bigger-120 ')
                }else{
                    $(el).attr('class','btn btn-xs btn-success');
                    $(el).children(":first").attr('class','icon-ok bigger-120')
                }
            }
        })
    },
    confirmDelete(){
        $('.del').click(function(){
            var flag=confirm('确定删除？');
            return flag
        })
    },
    changeSort(el,collectionName,id){
        var sortvalue=el.value;
        $.get('/admin/changeSort',{collectionName:collectionName,id:id,sortvalue},function(data){
           console.log(data)
        })
    },
    delnav(el,collectionName,id,is_sys){

        if(is_sys==1){
            alert('系统默认分类，不可删除');
            return;
        }

        var flag=confirm('确定删除？');

        if(flag){


            $.get('/admin/delnav',{collection:collectionName,id:id},function(data){
                console.log(data);
                if(data.success){
                    window.location.reload();
                    // window.history.go(0)
                }
             })
             
        }

       

    }
}

$(function(){
    app.confirmDelete();
})