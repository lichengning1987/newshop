var mongoose = require('mongoose') ;
var ProjectSchemas = require('../schemas/projectlog') ;
var Project = mongoose.model('project', ProjectSchemas);  //编译生成movie模型 表集合

module.exports = Project;
