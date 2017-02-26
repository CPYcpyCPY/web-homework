module.exports = function(db) {
    var userManager = require('../../models/user')(db);
    var homeworkManager = require('../../models/homework')(db);
    var submissionManager = require('../../models/submit')(db);
    var api = require('express').Router();

    // 添加TA或学生
    api.post('/addUser', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            userManager.addUser(req.body).then(function (result) {
                res.json(result.ops[0].info);
            });
        }
    });

    // 发布作业
    api.post('/publishHomework', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            homeworkManager.addHomework(req.body).then(function (result) {
                res.json(result.ops[0]);
            });
        }
    });

    // 修改作业状态(未开始->开始->结束)
    api.get('/changeHomeworkStatus/:homeworkId', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            homeworkManager.changeStatus(req.params.homeworkId).then(function (result) {
                res.json(result);
            });
        }
    });

    // 获取作业完成情况
    api.get('/finishDetail/:homeworkId', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            submissionManager.finishDetail(req.params.homeworkId).then(function (result) {
                res.json(result);
            });
        }
    });

    // 教师确认分数
    api.get('/confirmScore/:submissionId', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            submissionManager.confirmScore(req.params.submissionId).then(function () {
                res.json({});
            });
        }
    });

    // 教师修改作业评价
    api.post('/remark', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            submissionManager.remark(req.body)
            .then(function () {
                res.json({});
            });
        }
    });

    // 获取所有TA或学生
    api.get('/getAll/:auth', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            userManager.getAll(req.params.auth).then(function (result) {
                res.json(result);
            });
        }
    });

    // 已发布的所有作业
    api.get('/getAllHomework', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            homeworkManager.getAllHomework().then(function (result) {
                res.json(result);
            });
        }
    });

    // 对分数进行排名
    api.get('/ranking/:homeworkId', function (req, res) {
        if (!req.session.user || req.session.user.authority != 'teacher') {
            res.json({error:true});
        } else {
            submissionManager.ranking(req.params.homeworkId, 'A').then(function () {
                res.json({});
            });
        }
    });

    return api;
}
