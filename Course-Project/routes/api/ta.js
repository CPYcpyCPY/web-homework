module.exports = function(db) {
    var homeworkManager = require('../../models/homework')(db);
    var submissionManager = require('../../models/submit')(db);
    var api = require('express').Router();

    // 查看作业列表
    api.get('/allHomework', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'TA') {
            res.json({error:true});
        } else {
            homeworkManager.getAllHomework().then(function (result) {
                res.json(result);
            });
        }
    });

    // 获取需要批改的作业(某次作业)
    api.post('/checkHomework', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'TA') {
            res.json({error:true});
        } else {
            submissionManager.homeworkToBeCheck(req.body.homeworkId, req.body.groups)
            .then(function (result) {
                res.json(result);
            });
        }
    });

    // 评分
    api.post('/remark', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'TA') {
            res.json({error:true});
        } else {
            submissionManager.remark(req.body)
            .then(function () {
                res.json({});
            });
        }
    });

    return api;
};