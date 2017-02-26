module.exports = function(db) {
    var userManager = require('../models/user')(db);
    var blogManager = require('../models/blog')(db);
    var commentManager = require('../models/comment')(db);
    var api = require('express').Router();

    // 用户注册
    api.post('/signup', function(req, res, next) {
        userManager.checkData(req.body).then(function(result) {
            if (result.isOk) {
                userManager.addUser(req.body);
                req.session.user = {
                    username: req.body.username,
                    isAdmin: false
                };
                req.session.cookie.maxAge = 3600000;
                res.json({ error:false });
            } else {
                res.json({ error:result.error });
            }
        });
    });

    // 查看用户资料
    api.get('/detail', function(req, res, next) {
        if (!req.session.user) {
            res.json({ message: "not signin" });
        } else {
            if (req.session.user.username === '~Admin') {
                res.json({
                    message: '',
                    user: {
                        id: '14331085',
                        phone: '110',
                        email: 'hongchh_sysu@qq.com'
                    }
                });
            } else {
                userManager.findUser(req.session.user.username)
                .then(function(userData) {
                    res.json({
                        message: '',
                        user: userData
                    });
                });
            }
        }
    });

    // 退出登录
    api.get('/signout', function(req, res, next) {
        delete req.session.user;
        res.json(true);
    });

    // 用户登录
    api.post('/signin', function(req, res, next) {
        // 管理员登录
        if (req.body.username === '[admin]hongchh') {
            if (req.body.password === '14331085') {
                req.session.user = {
                    username: '~Admin',
                    isAdmin: true
                };
                res.json({error: false, message:'admin'});
            } else {
                res.json({error:{passwordError:'The password is error'}});
            }
        }
        // 普通用户登录
        else {
            userManager.signIn(req.body).then(function(result) {
                if (result.isOk) {
                    req.session.user = {
                        username: result.user.username,
                        isAdmin: false
                    };
                    req.session.cookie.maxAge = 3600000;
                    res.json({ error:false });
                } else {
                    res.json({ error:result.error });
                }
            });
        }
    });

    // 获取全部博客
    api.get('/allblog', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            blogManager.findAllBlog().then(function(result) {
                res.json({
                    username: req.session.user.username,
                    blogs: result
                });
            });
        }
    });

    // 添加博客
    api.post('/addblog', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            blogManager.addBlog({blog: req.body,
                username: req.session.user.username,
                hide: false
            }).then(function() {
                res.json({message:''});
            });
        }
    });

    // 删除博客
    api.get('/deleteblog/:id', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            blogManager.deleteBlog(req.params.id, req.session.user.username)
            .then(function(isOk) {
                if (isOk) {
                    commentManager.deleteAllComment(req.params.id).then(function() {
                        res.json({message:''});
                    });
                } else {
                    res.json({message:'can not delete blog of other user'});
                }
            });
        }
    });

    // 根据id获取某条博客
    api.get('/blog/:id', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            blogManager.findSpecificBlog(req.params.id).then(function(blog) {
                res.json({message:'', blog:blog, username: req.session.user.username});
            });
        }
    });

    // 获取某条博客的评论
    api.get('/comment/:blogid', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            commentManager.findComment(req.params.blogid).then(function(comments) {
                res.json({message:'', comments:comments});
            });
        }
    });

    // 发表评论
    api.post('/addcomment/:id', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            var comment = {
                whoComment: req.session.user.username,
                commentText: req.body.text,
                hide: false
            };
            commentManager.addComment(req.params.id, comment)
            .then(function(data) {
                res.json({message:'', comment: data.ops[0]});
            });
        }
    });

    // 修改博客
    api.post('/changeblog/:id', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            blogManager.findSpecificBlog(req.params.id)
            .then(function(data) {
                if (data.username !== req.session.user.username) {
                    res.json({message:'你无权修改他人博客'});
                } else if (data.hide) {
                    res.json({message:'该博客已被管理员隐藏, 无法修改'})
                } else {
                    blogManager.changeBlogContent(req.params.id, {
                        'blog.title': req.body.title,
                        'blog.text': req.body.text
                    }).then(function() {
                        res.json({});
                    });
                }
            });
        }
    });

    // 修改评论
    api.post('/changecomment/:id', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            commentManager.findSpecificComment(req.params.id)
            .then(function(data) {
                if (data.comment.whoComment !== req.session.user.username) {
                    res.json({message:'你无权修改他人评论'});
                } else if (data.comment.hide) {
                    res.json({message:'该评论已被管理员隐藏，无法修改'});
                } else {
                    commentManager.changeComment(req.params.id, {
                        'comment.commentText': req.body.text
                    }).then(function() {
                        res.json({});
                    });
                }
            });
        }
    });

    // 删除评论
    api.get('/deletecomment/:id', function(req, res) {
        if (!req.session.user) {
            res.json({message:'not signin'});
        } else {
            commentManager.findSpecificComment(req.params.id)
            .then(function(data) {
                if (data.comment.whoComment !== req.session.user.username) {
                    res.json({message:'你无权删除他人评论'});
                } else if (data.comment.hide) {
                    res.json({message:'该评论已被管理员隐藏，无法删除'});
                } else {
                    commentManager.deleteComment(req.params.id).then(function() {
                        res.json({});
                    });
                }
            });
        }
    });

    return api;
};
