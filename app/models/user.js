var mongoose = require('mongoose') ;
var UserSchemas = require('../schemas/user') ;
var User = mongoose.model('user', UserSchemas);  //编译生成movie模型 表集合

module.exports = User;
