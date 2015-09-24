var mongoose = require('mongoose') ;
var MovieSchemas = require('../schemas/movie') ;
var Movie = mongoose.model('skb', MovieSchemas);  //编译生成movie模型 表集合

module.exports = Movie;
