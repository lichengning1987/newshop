var express = require('express');
var port = process.env.PORT || 3000 ;
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname,'bower_components'))) ;
app.use(require('body-parser').urlencoded({extended: true}));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);


app.set('views','./app/views/pages');
app.set('view engine','jade');
app.locals.moment = require('moment');
app.listen(port);

console.log('immooc' + port)

var mongoose = require('mongoose');
var dsurl = 'mongodb://localhost/newdata3'
mongoose.connect(dsurl);

app.use(session({
    secret:'newdata3',
    store: new mongoStore({
        url:dsurl,
        collection:'sessions'
    })
}))

require('./config/routes')(app)

app.locals.moment = require('moment');
var logger = require('morgan');
/*配置入口文件*/
if ('development' === app.get('env')){
    app.set('showStackError', true);
    app.use(logger(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}


/*var Movie = require('./app/models/movie');
 var _ = require('underscore');*/
/*

app.get("/",function(req,res){
    Movie.fetch(function(err,moviess){
        if(err) {
            console.log(err);
        }
        res.render('index',{
            title:'首页',
            moviess:moviess
        })
    })

})

app.get("/movie/:id",function(req,res){
    var id = req.params.id;
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'详情页',
            movie:movie
        })
    })
})


app.get("/admin/list",function(req,res){
    Movie.fetch(function(err,moviess){
        if(err) {
            console.log(err);
        }
        res.render('list',{
            title:'列表页',
            moviess:moviess
        })
    })
})

app.get('/admin/update/:id', function(req, res){
    var id = req.params.id;
    if(id){
        Movie.findById(id, function(err,movie){
            res.render('admin',{
                title:'imooc',
                movie:movie
            })
        })
    }

})

app.get("/admin/movie",function(req,res){
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
})

app.post('/admin/movie/new',function(req,res){
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
})

*/
