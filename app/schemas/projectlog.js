var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ProjectSchemas = new Schema({
    name:String,
    content:String,
    principal:String,
    finishtime:String,
    from:{type:ObjectId,ref:'user'},
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

//存储前判断数据是否是新加的
ProjectSchemas.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next();
})

//静态方法，去除数据库中所有的数据，
ProjectSchemas.statics = {
    fetch: function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id,cb){
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = ProjectSchemas;