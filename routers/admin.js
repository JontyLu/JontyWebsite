var express = require("express");
var router = express.Router();
var multer = require("multer");
var connection = require("../database/connection");
var url = require("url");
//因为表单提交是multipart/form-data，需要用formidable中间件来解析
//非文件类型的input数据
var formidable = require("formidable");
//后面用于删除文件
var fs = require("fs");

var path = require("path");

//统一返回格式,初始化的处理
var  responseData;
//中间件判断一下
router.use(function(req,res,next){
    if(req.userInfo.isadmin != 1){
        res.send("对不起，只有管理员才可以进入后台管理");
        return;
    }
    responseData = {
        code:0,
        message: ""
    };
    next();
});

//监听路由
//这里的路径"/"代表的其实是/admin/
router.get("/",function(req,res,next){
    res.render("admin/index",{
        userInfo: req.userInfo//req.userInfo哪里来的
    });//在localhost:3000/admin/user可以得到该值
});

/*
* 用户管理
* */
router.get("/user", function (req,res) {
    /**
     * 我们需要显示数据库所有的用户数据
     */
    connection.getConnection(function(err,connection){
        var queryCount = connection.query("select count(*) from user");
        queryCount.on("result", function (result) {
            //limit限制了最多查询的数据
            //初始化是第一页，暴露了一个接口
            //在/user?page=2的时候会显示第二页，原因是地址传参page=2给服务器
            var page = Number(req.query.page )|| 1;//默认第一页
            var limit = 2;
            var sql = "select * from user limit " + (page-1)*limit + "," + page*limit;
            var count =   result["count(*)"];
            var pages = Math.ceil(count/limit);
            //取值不能超过pages
            page = Math.min(page,pages);
            //取值不能小于1
            page = Math.max(page,1);
            console.log(count);
            queryUser(sql,page, pages, limit,count );
        });
        function queryUser(sql,page, pages, limit,count){
            connection.query(sql  ,function(err,result,fields){
                if(err) throw err;
                if(result[0] == null){
                    console.log("该用户不存在");
                }else{
                    //console.log(result);
                    res.render("admin/user_index",{
                        userInfo:req.userInfo,
                        users: result,
                        pages: pages,
                        limit: limit,
                        count: count,
                        page: page
                    });
                    connection.release();
                    return;
                }

            });
        }

    });


});

/**
 * 分类管理
 */
router.get("/category" ,function(req, res){
    /**
     * 我们需要显示数据库所有的用户数据
     */
    connection.getConnection(function(err,connection){
        var queryCount = connection.query("select count(*) from category");
        queryCount.on("result", function (result) {
            //limit限制了最多查询的数据
            //初始化是第一页，暴露了一个接口
            //在/user?page=2的时候会显示第二页，原因是地址传参page=2给服务器
            //var page = Number(req.query.page )|| 1;//默认第一页
            //var limit = 2;
            var sql = "select * from category ";
            //var count =   result["count(*)"];
            //var pages = Math.ceil(count/limit);
            //取值不能超过pages
            //page = Math.min(page,pages);
            //取值不能小于1
            //page = Math.max(page,1);
            //console.log(count);
            queryUser(sql);
        });
        function queryUser(sql,page, pages, limit,count){
            connection.query(sql  ,function(err,result,fields){
                if(err) throw err;
                if(result[0] == null){
                    console.log("该用户不存在");
                }else{
                    //console.log(result);
                    res.render("admin/category_index",{
                        userInfo:req.userInfo,
                        catefories: result,
                    });
                    connection.release();
                    return;
                }

            });
        }

    });
});

/**
 * 分类的添加
 */
router.get("/category/add",function(req,res){
    res.render("admin/category_add",{
        userInfo: req.userInfo
    });
});

/**
 * 分类的保存
 */
router.post("/category/add", function (req, res) {
    //之前在app.js里通过body可以得到表单提交过来的信息
    //console.log(req.body);
    var name = req.body.name || "";
    if(name == ""){
        //如果提交的内容有误，显示一个信息
        res.render("admin/category_add",{
            userInfo:req.userInfo,
            message: "名字不能为空"
        });
    }else{
        //判断数据库是否已经存在分类名称
        var sql = "select * from category where categoryname = '" + name + "';";
        //console.log(sql);
        connection.query(sql, function (err,result,fields) {
            //console.log(result + "+" + name);
            var categoryname = "";
            if(result != "" ){
                categoryname = result[0].categoryname;
                if(categoryname == name){
                    //console.log("分类已经存在");
                    res.render("admin/category_add",{
                        userInfo:req.userInfo,
                        message: "分类已经存在"
                    });
                    return;
                }
            }else{
                //数据库中不存在该分类，可以保存
                connection.query("insert into category(categoryname) values('" + name + "');", function (err, result, fields) {
                    if(err) throw err;
                    //第二个参数是返回前端，给前端的信息
                    res.render("admin/category_add",{
                        userInfo:req.userInfo,
                        message: "分类保存成功"
                    });
                    return;
                });

            }
        });
    }

});

/**
 * 分类修改
 */
router.get("/category/edit",function(req,res){
    //获取要修改的分类的信息，用表单的形式展示出来
    //获取传递过来的名字,该name指的是post请求中表单页中一个属性name为name输入框的提交
    //name="user" -> req.query.user
    var name = req.query.name || "";
    //获取需要修改的分类信息

    var sql = "SELECT * FROM category where categoryname = '"+name + "';";

    connection.query(sql  ,function(err,result,fields){
        if(err) throw err;
        if(result[0] == null){
            res.render("admin/category_edit",{
                message: "分类信息不存在",
                userInfo: req.userInfo
            })
        }else{
            //console.log(result[0].categoryname);
            //console.log(name + "dsdd");
            res.render("admin/category_edit",{
                userInfo:req.userInfo,
                catefories: result,
                categoryname: result[0].categoryname
            });

        }


    });
});
/**
 * 分类的修改保存
 */

router.post("/category/edit", function (req, res) {
    var name = req.body.name || "";
    var originalName = req.query.name;
    var sql = "SELECT * FROM category where categoryname = '"+name + "';";
    connection.query(sql, function (err, result, fields) {
        if(err) throw  err;
        //当前修改名字存在
        console.log(name + "&" + originalName );
        console.log(result);
        if(result[0] == null){
            //不在数据库存在，修改分类
            var updateSql = "update category set categoryname = '" + name + "' where categoryname = '" + originalName + "';";
            connection.query(updateSql, function (err, result, fields) {
                if(err) throw  err;
                res.render("admin/category_edit",{
                    userInfo:req.userInfo,
                    message: "修改成功"
                });
            });
        }else {
            if(name == result[0].categoryname){
                res.render("admin/category_edit",{
                    userInfo:req.userInfo,
                    message: "该名字已存在",
                    categoryname: name
                });
            }
        }
    })
});

/**
 * 分类删除
 */
router.get("/category/delete",function(req,res){
    //获取要修改的分类的信息，用表单的形式展示出来
    //获取传递过来的名字,该name指的是post请求中表单页中一个属性name为name输入框的提交
    //name="user" -> req.query.user
    var name = req.query.name || "";
    //直接删除
    var sql = "delete from category where categoryname = '"+ name + "';";
    connection.query(sql, function (err, result, fields) {
        res.render("admin/category_delete",{
            userInfo:req.userInfo,
            message: "删除成功"
        });
    });
});

/**
 * 内容首页
 */
router.get("/content", function (req, res) {
    connection.query("select * from content",function(err,result,fields){
        res.render("admin/content_index",{
            userInfo: req.userInfo,
            contents: result
        });
    });
});

/**
 * 内容添加
 */
router.get("/content/add", function (req, res) {
    connection.query("select categoryname from category",function(err,result,fields){
        res.render("admin/content_add",{
            userInfo: req.userInfo,
            categories: result
        });
    });
});

/**
 * 内容保存
 */
var storage = multer.diskStorage({
    //设置上传后文件路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../src"));
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//添加配置文件到multer对象。
var upload = multer({
    storage: storage
});
router.post("/content/add", upload.single ("file"), function (req, res) {
    var contentTitle = req.body.contentTitle;
    var description = req.body.description;
    var categoryName = req.body.categoryName;
    var filepath = req.file.filename;
    console.log(req.file.filename);
    if(req.body.contentTitle == ""){
        res.render("admin/content_add",{
            userInfo: req.userInfo,
            message: "标题不能为空"
        });
    }else{
        var sql = "insert into content(title,description,categoryname,filepath) values ('"+contentTitle + "','"+description+"','"+categoryName+"','"+filepath + "');";
        connection.query(sql,function(err,result,fields){
            connection.query("select categoryname from category",function(err,categoryname,fields){
                res.render("admin/content_add",{
                    userInfo: req.userInfo,
                    message: "提交成功",
                    categories: categoryname
                });
            });

        });
    }
});

/**
 * 内容编辑
 */
router.get("/content/edit", function (req, res) {
    var originalId = req.query.idcontent;
    var sql = "select * from content where idcontent = '" + originalId + "';";
    connection.query(sql, function (err, result, fields) {
        connection.query("select categoryname from category", function (err, categoryname, fields) {
            res.render("admin/content_edit",{
                userInfo: req.userInfo,
                content: result[0],
                categories: categoryname
            });
        });
    });
});

/**
 * 内容修改保存
 */
router.post("/content/edit", function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields,files) {
        var originalIdContent = req.query.idcontent;
        console.log("fields",fields);
        res.render("admin/content_edit");

        /*connection.query("select * from content where idcontent = '"+ originalIdContent + "';", function (err, result) {
            //原有的内容
            var originalContentTitle = result[0].contentTitle;
            var originalDescription = result[0].description;
            var originalCategoryName = result[0].categoryName;
            var originalPathName = result[0].pathname;
            //修改的内容
            var contentTitle = fields.contentTitle;
            var description = fields.description;
            var categoryName = fields.categoryName;
            console.log("files",files);
            var newFile = req.file.filename;//新提交的文件名
            //如果不为空，删除原有的文件
            if(files != null){
                var filepath = path.join(__dirname,"../src/"+ originalPathName);
                fs.unlinkSync(filepath)
            }
            var sql = "update content set contentTitle='"+ contentTitle+"',description='"+ description+"',categoryName='"+ categoryName+"',filepath='"+filepath+"'";
            connection.query(sql,function(err){
                res.render("admin/content_edit");
            });
        });*/
    });

});
module.exports = router;