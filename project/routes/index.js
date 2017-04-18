var express = require('express');
var router = express.Router();

/* GET home page. */
/* 编写执行文件 */
router.get('/', function(req, res, next) {
  //使用绝对定位打开views下面的html文件
  //res.sendFile("\Career\Web\nodejs\myWebsite\project\views" + "test.html");
  res.render('index', { title: 'Express' });
});

module.exports = router;
