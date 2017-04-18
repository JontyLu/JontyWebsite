//创建一个user的模型类

var mongoose = require("mongoose");
var usersSchema = require("../schemas/users");

//完成一个模型类的创建
module.eports = mongoose.model("User",usersSchema);