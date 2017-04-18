var express = require("express");
var router = express.Router();
var connection = require("../database/connection");//返回一个对象

//统一返回格式,初始化的处理
var  responseData;
router.use(function(req,res,next){
    responseData = {
        code:0,
        message: ""
    };
    next();
});

//监听路由
/**
 * 注册逻辑
 * 1. 用户名不能为空
 * 2. 密码不能为空
 * 3. 两次输入密码必须一致
 * 
 * 1. 用户名是否已被注册
 *    数据库的查询，查询是否存在
 * 
 */
router.post("/user/register",function(req,res,next){
   // res.send("API - user");//在localhost:3000/admin/user可以得到该值
   //console.log("register");
   //获取post提交过来的数据，body属性是在app.js里添加了app.use
   //console.log(req.body);
   var username = req.body.username;
   var password = req.body.password;
   var repassword = req.body.repassword;
    console.log("点击了登陆");
   //用户是否为空
   if( username == ""){
       responseData.code = 1;
       responseData.message = "用户不能为空";
       //错误信息不应该再继续运行下去
       //转换成json格式,返回给前端
       res.json(responseData);
       return;
   }

   //密码不能为空
   if (password == ""){
       responseData.code = 2;
       responseData.message = "密码不能为空";
       res.json(responseData);
       return;
   }
   if( password != repassword){
       responseData.code = 3;
       responseData.message = "两次输入的密码不一致";
       res.json(responseData);
       return;
   }
   
   //需要用数据库查询用户名是否已经被注册了
    //连接数据库
    connection.getConnection(function(err,connection){
        connection.query("select * from user where username='" + username +"'",function(err,result,fields){
            if(err) throw err;
            if(result[0] == null){
                console.log("该用户不存在");
                //add操作，保存用户的信息到数据库
                var addSql ="insert into user(username, password) values('" + username +"','"+password + "');";
                connection.query(addSql,function(err, result){
                    if(err){
                        console.log("insert error", err.message);
                        return;
                    }
                });

            }else{
                console.log("查询结果: " , result[0].password);
                responseData.code = 4;
                responseData.message = "该用户存在";
                console.log("该用户存在");
                res.json(responseData);
                //关闭连接
                connection.release();
                return;
            }

        });
    });



});

router.post("/user/login", function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    if(username == "" || password == ""){
        console.log("用户名或密码不能为空")
        responseData.code = 1;
        responseData.message = "用户名或密码不能为空";
        res.json(responseData);
        return;
    }
//      connection.connect();
    //查询用户名是否存在，如果存在则登录
    connection.getConnection(function(err,connection){
        connection.query("select * from user where username='" + username +"'",function(err,result,fields){
            if(err) throw err;
            if(result[0] == null){
                console.log("该用户不存在");
            }else{
                console.log("查询结果: " , result[0].isadmin);
                responseData.code = 4;
                responseData.message = "该用户存在";
                responseData.userInfo = {
                    username: username,
                    isadmin: result[0].isadmin
                };
                //保存一个cookies,将该字符串存进userInfo里面
                req.cookies.set("userInfo",JSON.stringify({
                    username: username,
                    isadmin: result[0].isadmin
                }));
                console.log("该用户存在");
                res.json(responseData);
                //关闭连接
                connection.release();
            }
        });
    });


});

//点击退出的时候，Ajax发送一个请求，请求把cookies清除掉
router.get("/user/logout", function (req,res) {
    //将null存进userInfo
    req.cookies.set("userInfo",null);
    responseData.message = "退出";
    res.json(responseData);
});
module.exports = router;