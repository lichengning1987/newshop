var Movie = require('../models/movie');

exports.index = function(req, res){
    Movie.fetch(function(err,moviess){
        if(err) {
            console.log(err);
        }
        res.render('index',{
            title:'首页',
            moviess:moviess
        })
    })
    console.log(Movie.fetch);
    /*res.render('index',{
        title:'首页',
        moviess:[{}]
    })*/
}

