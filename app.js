/* 应用启动入口文件 */
/* 用户通过URL访问web应用，
* web后盾根据用户访问的URL处理不同的业务逻辑
*/

var express = require("express");
//加载模板模块
var swig = require("swig");
//加载mongoose模块
//var mongoose = require("mongoose");
/* 创建app应用，方法就是类似于http.createServer() */
var app = express();
//加载body-parser，用来处理post提交过来的数据，加载完还要配置
var bodyParser = require("body-parser"); 
//加载cookies模块
var cookies = require("cookies");
//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + "/public"下的文件
app.use("/public" , express.static(__dirname + "/public"));
app.use("/views", express.static(__dirname + "/views/main"))
//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称（后缀名）；第二个参数用来解析处理模板内容的方法
app.engine("html",swig.renderFile);
//设置模板文件存放的目录，第一个目录必须是views，第二个是目录
app.set("views","./views");
/*注册所使用的模板引擎，第一个参数必须是view engine，
* 第二个参数和app.engine中定义的模板引擎的名称是一致的
*/
app.set("view engine","html");
//在开发过程需要取消模板缓存
swig.setDefaults({cache:false});


//bodyParser设置,给路由添加了一个body的属性
app.use(bodyParser.urlencoded({extended:true}));

//对cookies进行相关设置,无论用户怎么访问这个网站，都会走该中间件
app.use(function(req,res,next){
    req.cookies = new cookies(req,res);
    
    //解析登录用户的cookies信息,还要实时验证当前是否是管理员
    req.userInfo = {};
    if(req.cookies.get("userInfo")){
        try{
            //在admin中提交的{userInfo: req.userInfo}是从这里得到的
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            //console.log(req.userInfo.isadmin);
            //获取当前登录用户的类型。是否为管理员
            req.userInfo.isadmin = Boolean(userInfo.isadmin);
            console.log(req.userInfo.isadmin);
            //  console.log("双击666");
            next();
        }catch(e){
            next();
        }
    }else{
        next();
    }
});
/* app.get()和app.post()可以把一个url路径和一个或多个函数进行绑定
* app.get("/", function(req,res,next){})
* next：方法，执行下一步的函数
*/

//访问首页
/*app.get("/",function(req,res,next){
    //res.send("<h1>welcome to my website</h1>");//页面会显示该词段
    /*读取view目录下的指定文件，解析并返回给客户端
     * 第一个参数：表示模板的文件，相对于views目录
     //
    res.render("index");//找道views/index.html文件
});*/

/**
 * 这是根据不同的功能划分模块
 */

app.use("/admin",require("./routers/admin"));
//app.use("/work",require("./routers/api"));
app.use("/api", require("./routers/api"));
app.use("/", require("./routers/main"));

//监听http请求
//连接数据库
/*mongoose.connect("mongodb://localhost:27018/blog",function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
    
    }
});*/

app.listen(3000);
