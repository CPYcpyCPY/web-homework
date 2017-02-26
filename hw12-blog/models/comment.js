module.exports = function(db) {
    var ObjectId = require('mongodb').ObjectID;
    var comments = db.collection('comments');

    var commentManager = {
        // 添加评论
        addComment: function(blogId, comment) {
            return comments.insert({
                blogId: blogId,
                comment: comment
            });
        },

        // 删除某一条评论
        deleteComment: function(commentId) {
            return comments.remove({_id: new ObjectId(commentId)});
        },

        // 查找某篇博客的所有评论
        findComment: function(blogId) {
            return new Promise(function(resolve, reject) {
                comments.find({blogId:blogId}).toArray(function(err, docs) {
                    resolve(docs);
                });
            });
        },

        // 查找具体某一条评论
        findSpecificComment: function(commentId) {
            return comments.findOne({_id: new ObjectId(commentId)});
        },

        // 删除某条博客的全部评论
        deleteAllComment: function(blogId) {
            return comments.remove({blogId: blogId});
        },
        
        // 修改评论
        changeComment: function(commentId, newContent) {
            return comments.updateOne({ _id: new ObjectId(commentId) },
                {$set:newContent});
        }
    };

    return commentManager;
};