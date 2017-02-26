module.exports = function(db) {
    var homeworkManager = require('../../models/homework')(db);
    var submissionManager = require('../../models/submit')(db);
    var remarkManager = require('../../models/remark')(db);
    var multer  = require('multer');
    var upload = multer({ dest: __dirname+'../../../public/uploads' }).any();
    var api = require('express').Router();

    // 查看所有作业
    api.get('/allHomework', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'Student') {
            res.json({error: true});
        } else {
            homeworkManager.getAllHomework().then(function (result) {
                res.json(result);
            });
        }
    });

    // 所有提交记录
    api.get('/allSubmission', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'Student') {
            res.json({error: true});
        } else {
            submissionManager.getOnesSubmissions(req.session.user._id)
            .then(function (result) {
                res.json(result);
            });
        }
    });

    // 某一次提交记录
    api.get('/submission/:id', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'Student') {
            res.json({error: true});
        } else {
            submissionManager.getSpecificSubmission(req.params.id)
            .then(function (result) {
                res.json(result);
            });
        }
    });

    // 提交作业
    api.post('/submit', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'Student') {
            res.json({error: true});
        } else {
            var submission = req.body;
            submission.user = req.session.user._id;
            submission.class = req.session.user.info.class;
            submission.userInfo = {
                username: req.session.user.info.username,
                name: req.session.user.info.name};
            submission.group = req.session.user.info.groups;
            submissionManager.submitHomework(submission).then(function (result) {
                res.json(result.ops[0]);
            });
        }
    });

    // 上传文件
    api.post('/upload', function (req, res) {
        if (!req.session.user || req.session.user.authority !== 'Student') {
            res.json({error: true});
        } else {
            upload(req, res, function (err) {
                if (err) {
                    res.json(err);
                } else {
                    submissionManager.addFileTo(req.body.submissionId, req.body.file, req.files)
                    .then(function () {
                        res.json({});
                    });
                }
            });
        }
    });

    // 根据homeworkId和用户id查找某一次提交的最终评分
    api.get('/myFinalScore/:homeworkId', function (req, res) {
        submissionManager.finalScore(req.params.homeworkId, req.session.user._id)
        .then(function (result) {
            res.json(result);
        });
    });

    // 获取他人对我的评价
    api.get('/othersRemarksToMe/:homeworkId', function (req, res) {
        remarkManager.othersRemarksToMe(req.params.homeworkId, req.session.user._id)
        .then(function (result) {
            res.json(result);
        });
    });

    // 获取我需要去评分的作业
    api.get('/homeworksIShouldRemark/:homeworkId', function (req, res) {
        homeworkManager.getRemarkGroup(req.params.homeworkId, req.session.user.info.groups,
            req.session.user.info.class).then(function (group) {
                submissionManager.homeworksIShouldRemark(req.params.homeworkId,
                    group).then(function (submissions) {
                        res.json(submissions);
                    });
            });
    });

    // 获取某次作业中我对他人的评价
    api.get('/allMyRemarksToOthers/:homeworkId', function (req, res) {
        remarkManager.allMyRemarksToOthers(req.params.homeworkId, req.session.user._id)
        .then(function (result) {
            res.json(result);
        });
    });

    // 提交我对他人的评价
    api.post('/myRemarkToOthers', function (req, res) {
        remarkManager.addRemark(req.body, req.session.user._id).then(function (result) {
            res.json(result.ops[0]);
        });
    });

    return api;
};
