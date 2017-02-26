module.exports = function(db) {
    var userManager = require('../models/user')(db);
    var blogManager = require('../models/blog')(db);
    var commentManager = require('../models/comment')(db);
    var api = require('express').Router();

    // 管理员查看全部用户
    api.get('/alluser', function(req, res) {
        if (!req.session.user || req.session.user.username !== '~Admin') {
            res.json({message:'not admin'});
        } else {
            userManager.findAll().then(function(users) {
                res.json({message:'', users:users});
            });
        }
    });

    // 管理员查看某个用户的所有博客
    api.get('/onesblog/:username', function(req, res) {
        if (!req.session.user || req.session.user.username !== '~Admin') {
            res.json({message:'not admin'});
        } else {
            blogManager.findBlog(req.params.username).then(function(data) {
                res.json({
                    message:'',
                    blogs:data
                });
            });
        }
    });

    // 管理员隐藏博客
    api.get('/hideblog/:id', function(req, res) {
        if (!req.session.user || req.session.user.username !== '~Admin') {
            req.json({message:'not admin'});
        } else {
            blogManager.changeBlogContent(req.params.id, {
                hide: true,
                'blog.text': '该内容已被管理员隐藏'
            }).then(function() {
                res.json({});
            });
        }
    });

    // 管理员隐藏评论
    api.get('/hidecomment/:id', function(req, res) {
        if (!req.session.user || req.session.user.username !== '~Admin') {
            res.json({message:'not admin'});
        } else {
            commentManager.changeComment(req.params.id, {
                'comment.commentText':'该内容已被管理员隐藏',
                'comment.hide':true
            }).then(function() {
                res.json({});
            });
        }
    });

    return api;
};