module.exports = function(db) {
    var userManager = require('../models/user')(db);
    var router = require('express').Router();

    // 注册页面
    router.get('/regist', function(req, res, next) {
      res.render('signup', { user:{}, error:{} });
    });

    // 提交注册表单
    router.post('/regist', function(req, res, next) {
        userManager.checkData(req.body).then(function(result) {
            if (result.isOk) {
                userManager.addUser(req.body);
                req.session.user = req.body;
                req.session.cookie.maxAge = 3600000;
                res.redirect('/?username='+req.session.user.username);
            } else {
                res.render('signup', { user:req.body, error:result.error });
            }
        });
    });

    // 详情页面
    router.get('/', function(req, res, next) {
        if (!req.session.user) {
            res.redirect('/signin');
        } else {
            if (!!req.query.username && req.query.username != req.session.user.username)
                res.render('detail', { message:"You can't visit the information of others!",
                    user:req.session.user });
            else
                res.render('detail', { message:"", user:req.session.user });
        }
    });

    // 退出登录
    router.get('/signout', function(req, res, next) {
        delete req.session.user;
        res.redirect('/signin');
    });

    // 登录页面
    router.get('/signin', function(req, res, next) {
        res.render('signin', { user:{}, error:{} });
    });

    // 提交登录表单
    router.post('/signin', function(req, res, next) {
        userManager.findUser(req.body).then(function(result) {
            if (result.isOk) {
                req.session.user = result.user;
                req.session.cookie.maxAge = 3600000;
                res.redirect('/?username='+result.user.username);
            } else {
                res.render('signin', { user:req.body, error:result.error });
            }
        });
    });

    // 其他路径
    router.all('*', function(req, res, next) {
        res.status(404).render('notfound');
    });

    return router;
};
