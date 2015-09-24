var mongoose = require('mongoose');

var MovieSchemas = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
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
MovieSchemas.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next();
})

//静态方法，去除数据库中所有的数据，
MovieSchemas.statics = {
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

module.exports = MovieSchemas;