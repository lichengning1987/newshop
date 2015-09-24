var mongoose = require('mongoose')
var Movie = require('../models/movie');
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
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie=null;

    if(id != 'undefined'){
        Movie.findById(id, function(err,movie){
            if(err){
                console.log(err)
            }

            _movie = _.extend(movie,movieObj);

            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }

                res.redirect('/movie/'+ movie._id);

            })

        })
    }else{
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })

        console.log(_movie);

        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+ movie._id);

        })
    }

}


exports.list = function(req,res){
    Movie.fetch(function(err,moviess){
        if(err) {
            console.log(err);
        }
        res.render('list',{
            title:'列表页',
            moviess:moviess
        })
    })

}
