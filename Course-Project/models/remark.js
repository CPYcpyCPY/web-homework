module.exports = function(db) {
    var remarks = db.collection("remarks");
    var ObjectId = require('mongodb').ObjectID;

    var remarkManager = {
        // 添加评论(再次添加对同一份作业的评论则覆盖掉以前的评论)
        addRemark: function(info, user) {
            remarks.findOneAndDelete({
                submissionId: info.submissionId,
                whoRemark: user
            });
            info.whoRemark = user;
            return remarks.insert(info);
        },
        // 被评论者查看自己某次作业被评论的情况
        othersRemarksToMe: function(homeworkId, user) {
            return new Promise(function(resolve, reject) {
                remarks.find({
                    homeworkId: homeworkId,
                    remarkWhom: user
                }).toArray(function(err, docs) {
                    if (!err)
                        resolve(docs);
                });
            });
        },

        // 评论者查看某次作业自己对他人的评论
        allMyRemarksToOthers: function(homeworkId, user) {
            return new Promise(function(resolve, reject) {
                remarks.find({
                    homeworkId: homeworkId,
                    whoRemark: user
                }).toArray(function(err, docs) {
                    if (!err)
                        resolve(docs);
                });
            });
        }
    };

    return remarkManager;
};