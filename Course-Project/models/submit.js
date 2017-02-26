module.exports = function(db) {
    var submission = db.collection("submission");
    var ObjectId = require('mongodb').ObjectID;
    var fs = require('fs');
    // 管理学生提交的作业
    var submissionManager = {
        // 作业完成情况
        finishDetail: function(homeworkId) {
            return new Promise(function (resolve, reject) {
                submission.find({homeworkId: homeworkId})
                .toArray(function (err, docs) {
                    resolve(docs);
                });
            });
        },

        // 确认最终分数
        confirmScore: function(submissionId) {
            return submission.findOneAndUpdate({
                _id:new ObjectId(submissionId)
            }, {
                $set: {isConfirm: true}
            });
        },

        // 查找某个学生的所有作业
        getOnesSubmissions: function(user) {
            return new Promise(function (resolve, reject) {
                submission.find({user:user}).toArray(function (err, docs) {
                    resolve(docs);
                });
            });
        },

        // 查找某一份作业
        getSpecificSubmission: function(submissionId) {
            return submission.findOne({_id:new ObjectId(submissionId)});
        },

        // 提交作业信息
        submitHomework: function(submissionData) {
            submissionData.src = null;
            submissionData.img = null;
            submissionData.remark = {};
            submissionData.isConfirm = false;
            // 先进行查找删除，若之前已有过提交记录则删除(包括文件)
            // 实现重复提交时覆盖以前的记录
            submission.findOneAndDelete({
                homeworkId: submissionData.homeworkId,
                user: submissionData.user
            }).then(function (result) {
                if (result.ok && result.value.src !== null)
                    fs.unlink(result.value.src[0].path, function (err) {
                        if (err)
                            console.log(err);
                    });
                if (result.ok && result.value.img !== null)
                    fs.unlink(result.value.img[0].path, function (err) {
                        if (err)
                            console.log(err);
                    });
            });
            return submission.insert(submissionData);
        },

        // 添加作业文件
        // 添加时重命名文件使得文件名唯一且保留文件拓展名
        addFileTo: function(submissionId, fileField, file) {
            var filename = file[0].filename+file[0].originalname;
            var path = file[0].path;
            fs.rename(path, file[0].destination+'/'+filename, function (err) {
                if (err)
                    console.log(err);
            });
            file[0].filename = filename;
            file[0].path = path+file[0].originalname;
            var objId = null;
            try {
                objId = new ObjectId(submissionId);
            } catch(Exception) {
                console.log(Exception);
            }
            if (fileField === 'src')
                return submission.findOneAndUpdate({
                    _id: objId
                }, {
                    $set: {src: file}
                });
            else
                return submission.findOneAndUpdate({
                    _id: objId
                }, {
                    $set: {img: file}
                });
        },

        // 根据作业ID和负责小组获取学生提交的作业(TA用)
        homeworkToBeCheck: function(homeworkId, group) {
            var groups = eval(group);
            for (var i = 0; i < groups.length; ++i) {
                groups[i] = groups[i].toString();
            }
            return new Promise(function (resolve, reject) {
                submission.find({
                    homeworkId: homeworkId,
                    group: {$in: groups}
                }).toArray(function (err, docs) {
                    resolve(docs);
                });
            });
        },

        // 评分
        remark: function(remarkInfo) {
            var info = {
                score: remarkInfo.score,
                message: remarkInfo.message,
            };
            return submission.findOneAndUpdate({
                _id: ObjectId(remarkInfo.submissionId)
            }, {
                $set: {remark: info}
            });
        },

        // 查看作业的最终得分和评语
        finalScore: function(homeworkId, user) {
            return submission.findOne({
                homeworkId: homeworkId,
                user: user
            }).then(function (mySubm) {
                if (!mySubm)
                    return null;
                else
                    return mySubm.remark;
            });
        },

        // 根据作业ID和小组获取提交记录(学生用)
        homeworksIShouldRemark: function(homeworkId, group) {
            return new Promise(function (resolve, reject) {
                submission.find({
                    homeworkId: homeworkId,
                    group: group
                }).toArray(function (err, docs) {
                    resolve(docs);
                });
            });
        },

        // 排名
        ranking: function(homeworkId, whichClass) {
            return new Promise(function (resolve, reject) {
                submission.find({
                    homeworkId: homeworkId,
                    class: whichClass
                }).toArray(function (err, docs) {
                    if (!err) {
                        docs.sort(function (a, b) {
                            return parseInt(a.remark.score) < parseInt(b.remark.score) ? 1 : -1;
                        });
                        for (var i = 0; i < docs.length; ++i) {
                            submission.findOneAndUpdate({
                                _id: docs[i]._id
                            }, {
                                $set: {'remark.rank': i+1}
                            });
                        }
                    }
                    resolve();
                })
            });
        }
    };

    return submissionManager;
};