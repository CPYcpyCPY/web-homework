module.exports = function(db) {
    var ObjectId = require('mongodb').ObjectID;
    var blogs = db.collection('blogs');

    // 博客管理
    var blogManager = {
        // 添加博客
        addBlog: function(blogData) {
            return blogs.insert(blogData);
        },

        // 删除博客
        deleteBlog: function(blogId, username) {
            id = new ObjectId(blogId);
            return blogs.findOne({_id: id}).then(function(data) {
                if (data.username == username) {
                    blogs.remove({_id: id}).then(function() {
                        return true;
                    });
                } else {
                    return false;
                }
            })
        },

        // 查找某个用户的所有博客
        findBlog: function(username) {
            return new Promise(function(reslove, reject) {
                blogs.find({username:username}).toArray(function(err, docs) {
                    if(err) reject(err);
                    else reslove(docs);
                });
            });
        },

        // 查找所有博客
        findAllBlog: function() {
            return new Promise(function(reslove, reject) {
                blogs.find({}).toArray(function(err, docs) {
                    if (err) reject(err);
                    else reslove(docs);
                });
            });
        },

        // 查找具体某一条博客
        findSpecificBlog: function(id) {
            return blogs.findOne({ _id: new ObjectId(id) });
        },

        // 修改博客内容
        changeBlogContent: function(id, newContent) {
            return blogs.updateOne({ _id: new ObjectId(id) },
                { $set: newContent });
        }
    };

    return blogManager;
}