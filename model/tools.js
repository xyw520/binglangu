var md5 = require('md5');

const multer = require('koa-multer')


let tools = {

    multer() {   /*上传图片的配置*/
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
        return upload
    },

    getTime() {

        return new Date()
    },
    md5(str) {
        return md5(str)
    },
    cateToList(data) {

        //1.获取一级分类
        var firstArr = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i].pid == '0') {
                firstArr.push(data[i]);
            }
        }

        //2.获取二级分类
        for (var i = 0; i < firstArr.length; i++) {
            firstArr[i].list = [];
            //遍历所有的数据  看谁的pid等于当前数据的_id
            for (var j = 0; j < data.length; j++) {
                if (firstArr[i]._id == data[j].pid) {
                    firstArr[i].list.push(data[j]);
                }
            }
        }

        // console.log(JSON.stringify(firstArr) )
        return firstArr;
    }
}

module.exports = tools;