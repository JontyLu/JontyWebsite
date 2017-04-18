var express = require("express");
var router = express.Router();
var connection = require("../database/connection");
var markdown = require("markdown").markdown;
var fs = require("fs");
var path = require("path");


//监听路由
router.get("/",function(req,res,next){
    //res.send("首页");//在localhost:3000/admin/user可以得到该值
    res.render("main/index");
});

router.get("/aboutus",function(req,res,next){
    res.render("main/aboutUs/aboutUsPage");
});

router.get("/aboutus/crazePage",function(req,res,next){
    res.render("main/aboutUs/CrazeProfile");
});

router.get("/aboutus/jardenPage",function(req,res,next){
    res.render("main/aboutUs/JardenProfile");
});

router.get("/aboutus/jontyPage",function(req,res,next){
    res.render("main/aboutUs/JontyProfile");
});

/**
 * 博客系统首页
 */
router.get("/work",function(req,res,next){
    //console.log(req.userInfo);
    //第二个参数是分配给模板使用的数据
    //读取所有的分类信息

    var categoryname = req.query.category || "";
   // console.log("categoryname:"+categoryname);

        var sql = "select categoryname from category";
        connection.query(sql, function (err, result, fields) {
            //首页展示，输出所有的文章
            if(categoryname == ""){
                var sql2 = "select * from content";
                connection.query(sql2,function(err,content){
                    //console.log(content);
                    res.render("main/work/work",{
                        userInfo: req.userInfo,
                        categories: result,
                        contents: content
                    });
                });
            }else{
                //console.log(categoryname);
                var sql3 = "select * from content where categoryname ='"+categoryname+"';";
                connection.query(sql3, function (err, content) {
                    //console.log(content);
                    res.render("main/work/work",{
                        userInfo: req.userInfo,
                        categories: result,
                        contents: content
                    })
                })
            }


        });


});

/**
 * 显示全文
 */
router.get("/work/views",function(req,res){
   var idContent = req.query.idcontent || "" ;
    console.log(idContent);
    var sql = "select categoryname from category";
    connection.query(sql, function (err, result, fields) {
        connection.query("select * from content where idcontent='"+idContent+"';", function (err, content) {
            var mdPath = path.join(__dirname,"../src",content[0].filepath);
            console.log(mdPath);
            //读入markdown源文件
            var fileContent = fs.readFileSync(mdPath,"utf8");
            //将源文件转换成HTML源代码
            fileContent = markdown.toHTML(fileContent);
             console.log(fileContent);
            res.render("main/work/views",{
                userInfo: req.userInfo,
                categories: result,
                content: content[0],
                fileContent: fileContent
            });
        });

    });

});
module.exports = router;