var mongoose = require('mongoose');
var User = require('../models/user');


exports.signup = function(req,res){
     var _user = req.body.user;

    console.log(_user);
    User.find({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user && user.length> 0){
            return res.redirect('/signin');
        }else{
            user = new User(_user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                res.redirect('/admin/user/userlist');
            })
        }
    })

}

//signup page
exports.showSignup = function (req, res){
    res.render('signup',{
        title: '注册页面'
    })
}

//signin page
exports.showSignin = function (req, res){
    res.render('signin',{
        title: '登录页面'
    })
}



exports.userlist = function(req,res){
    User.fetch(function(err,users){
        if(err){
             console.log(err);
        }

        res.render('userlist',{
            title:'用户列表页',
            users:users
        });

    })

}



//sign in
exports.signin = function(req,res){

    var name = req.body.names;
    var password = req.body.passwords;
    var result = {};

    console.log(req.body);
    console.log(req.body,1212);

    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err);
        }

        if(!user){
            return res.redirect('/signup');
        }

        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                req.session.user = user;
                result.code = 1;
                console.log(user.name)
                console.log(req.session.user)
                console.log("1223")
                //return res.redirect('/');
            }else{
                return res.redirect('/siginin');
            }
            res.end(JSON.stringify(result, undefined, '\t'));

        });



    });

}


//logout
exports.logout = function(req, res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
}




