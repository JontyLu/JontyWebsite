/*加载express模块
* 可以设置中间件来响应HTTP请求；定义路由表用来执行不同的HTTP请求；向模板传递参数来动态渲染HTML页面
*/
var express = require('express');
/*路径模块
* 可以用来处理和转换路径
* http://www.cnblogs.com/duhuo/p/4752640.html
*/
var path = require('path');
//请求网页的logo
var favicon = require('serve-favicon');
//控制台中，显示req请求信息
var logger = require('morgan');
//解析cookie的工具，通过req.cookies可以取到传过来的cookie并转成对象
var cookieParser = require('cookie-parser');
//处理JSON、Buffer流、文本和UTF-8编码的数据
var bodyParser = require('body-parser');
//加载mysql模块
//var mysql = require("mysql");

//路由信息（接口地址），存放在routes的根目录
var index = require('./routes/index');
var users = require('./routes/users');

//创建app应用 => NodeJs Http.createServer()
var app = express();

// view engine setup模板开始
//设置视图根目录
app.set('views', path.join(__dirname, 'views'));
//设置视图格式（这里用的是jade格式）
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//载入中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置路由
/* 定义一个路由的基本格式
* app.method(path,handler);
* method是HTTP请求方法，path是服务器上的路径，handler是在路由匹配时执行的函数
* 即：在根路由上的主页对get请求进行相应
*/
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
