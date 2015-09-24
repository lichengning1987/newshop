var mongoose = require('mongoose')
var Project = require('../models/projectlog');
var _ = require('underscore');
var path = require('path');

exports.detail = function(req,res){
    var id = req.params.id;
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'详情页',
            movie:movie
        })
    })
}

exports.movie = function(req,res){
    res.render('admin',{
        title:'后台管理',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
}

exports.update = function(req, res){
    var id = req.params.id;
    if(id){
        Movie.findById(id, function(err,movie){
            res.render('admin',{
                title:'imooc',
                movie:movie
            })
        })
    }

}

exports.save = function(req, res){
    var id = req.body.project._id;
    var projectObj = req.body.project;
    var _project=null;
    var result = {};

    if(req.session.user != undefined){
        Project.find({name:projectObj.name},function(err,project){
                 if(err){
                     console.log(err)
                 }
                _project= new Project(projectObj);
                _project.save(function(err,project){
                    if(err){
                        console.log(err);
                    }
                    result.code = 1;

                })
            })
        res.end(JSON.stringify(result, undefined, '\t'));

    }else{
        res.redirect('/signin');
    }
}


exports.list = function(req,res){
    var id = req.params.id;
    Project.find({})
        .populate('from','name')
        .exec(function(err,project){
            if(err){
                console.log(err);
            }

            console.log(project);

            res.render('projectlist',{
                title:'列表页',
                projects:project
            })
            setTimeout(function(){
                res.end(req.query.callback + '(' + JSON.stringify(project, undefined, '    ') + ');');
            },500)

        })


    /*Project.fetch(function(err,project){
        if(err) {
            console.log(err);
        }

        console.log(project)

        res.render('projectlist',{
            title:'列表页',
            projects:project
        })
    })*/

}

exports.test = function(req,res){
  res.header('Content-Type','application/javascript;charset=utf-8');
  /*var obj = Object.create(null);

    //随机生成一个总页数
    obj.totalPage = parseInt(req.query.totalPage, 10);

    obj.data = [];
    for (var i = 0; i < 6; i++) {
        obj.data.push({
            title:'第' + i + '页，' + Math.random()
        });
    }
    setTimeout(function () {
        res.end(req.query.callback + '(' + JSON.stringify(obj, undefined, '    ') + ');');
    },500)*/
    Project.find({})
        .populate('from','name')
        .exec(function(err,project){
            if(err){
                console.log(err);
            }

            console.log(project);

            setTimeout(function(){
                res.end(req.query.callback + '(' + JSON.stringify(project, undefined, '    ') + ');');
            },500)

        })




}
