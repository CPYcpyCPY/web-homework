module.exports = function(db) {
    var userManager = require('../../models/user')(db);
    var api = require('express').Router();

    // 登陆
    api.post('/signin', function (req, res) {
        // 教师登陆
        if (req.body.username === 'wangqing') {
            if (req.body.password === '12345678') {
                req.session.user = {
                    username: 'wangqing',
                    name: '王青',
                    authority: 'teacher'
                };
                req.session.cookie.maxAge = 3600000;
                res.json({
                    error: false,
                    user: req.session.user
                });
            } else {
                res.json({
                    error: {passwordError: '密码错误'}
                });
            }
        }
        // TA或学生登陆
        else {
            userManager.signin(req.body).then(function (result) {
                if (result.isOk) {
                    req.session.user = result.user;
                    req.session.cookie.maxAge = 3600000;
                    res.json({
                        error: false,
                        user: {
                            username: result.user.info.username,
                            name: result.user.info.name,
                            groups: result.user.info.groups,
                            authority: result.user.authority
                        }
                    });
                } else {
                    res.json({ error: result.error });
                }
            });
        }
    });

    // 退出登录
    api.get('/signout', function (req, res) {
        if (req.session.user)
            delete req.session.user;
        res.json({});
    });

    return api;
};