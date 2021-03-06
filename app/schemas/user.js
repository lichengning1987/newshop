var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchemas = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:{
        unique:true,
        type:String
    },
    role:{
        type:Number,
        default: 0
    },
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
UserSchemas.pre('save',function(next){
    var user = this;

    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password, null, null, function (err, hash){
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
        })

    });
})

UserSchemas.methods = {
    comparePassword : function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if(err) return cb(err)

            cb(null,isMatch)
        })
    }
}


//静态方法，去除数据库中所有的数据，
UserSchemas.statics = {
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

module.exports = UserSchemas;