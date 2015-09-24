
var Index = require('../app/control/index');
var Movie = require('../app/control/movie');
var User = require('../app/control/user');
var Project = require('../app/control/projectlog');

module.exports = function(app){

    app.use(function(req, res, next) {
           var _user = req.session.user;
           app.locals.user = _user;
           next();
       })

    app.get("/",Index.index)

    app.get("/movie/:id",Movie.detail)

    app.get("/admin/list",Movie.list)

    app.get('/admin/movie/update/:id',Movie.update);

    app.get('/admin/movie',Movie.movie)

    app.post('/admin/movie/new',Movie.save)

    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);

    app.get('/admin/user/userlist',User.userlist)


    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);


    app.get('/logout',User.logout);

    app.post('/user/log',Project.save)
    app.get('/user/loglist',Project.list)

    app.get("/test",Project.test)


}

