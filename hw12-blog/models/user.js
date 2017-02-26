module.exports = function(db) {
    var check = require('../public/javascripts/lib/checker');
    var crypto = require('crypto');

    // 加密函数
    var md5 = function(data) {
        return crypto.createHash('md5').update(data).digest('hex');
    };

    // 数据库
    var users = db.collection('users');

    // 网站用户管理
    var userManager = {
        // 检查注册数据合法性及重复性
        // 返回一个promise
        checkData : function(userData) {
            // 检查格式合法
            var c = check(userData);
            return new Promise(function(reslove, reject) {
                users.find({$or:[{username:userData.username}, {id:userData.id},
                {phone:userData.phone}, {email:userData.email}]}).toArray(function(err, docs) {
                    if(err) reject(err);
                    else reslove(docs);
                });
            }).then(function(result) {
                // 若出现重复数据则给出相应提示，便于后续渲染之后将错误信息提示给用户
                if (result.length) {
                    for (var i = 0; i < result.length; ++i) {
                        if (result[i].username == userData.username)
                            c.error.nameError = "该用户名已被注册";
                        if (result[i].phone == userData.phone)
                            c.error.phoneError = "该电话已被注册";
                        if (result[i].id == userData.id)
                            c.error.idError = "该学号已被注册";
                        if (result[i].email == userData.email)
                            c.error.emailError = "该邮箱已被注册";
                    }
                    c.isOk = false;
                }
                return c;
            });
        },

        // 加密用户密码之后向数据库添加用户
        addUser : function(userData) {
            userData.password = md5(userData.password);
            users.insert(userData);
        },

        // 登陆用户，返回一个promise
        // 查找之后若用户未注册或密码错误都给相应提示，便于后续渲染之后提示用户
        signIn : function(userData) {
            var result = { user : {},
                           error : {usernameError:"", passwordError:""},
                           isOk : false };
            return users.findOne({username:userData.username})
            .then(function(user) {
                if (!!user) {
                    if (md5(userData.password) == user.password) {
                        result.isOk = true;
                        result.user = {
                            username: user.username,
                            id: user.id,
                            phone: user.phone,
                            email: user.email
                        };
                    } else {
                        result.error.passwordError = "密码错误";
                    }
                } else {
                    result.error.usernameError = "用户名未注册";
                }
                return result;
            });
        },

        // 查找数据库中所有用户
        findAll: function() {
            return new Promise(function(resolve, reject) {
                users.find().toArray(function(err, docs) {
                    resolve(docs);
                });
            }).then(function(docs) {
                allUser = [];
                for (var i = 0; i < docs.length; ++i)
                    allUser.push(docs[i].username);
                return allUser;
            });
        },

        // 查找某个用户
        findUser: function(username) {
            return users.findOne({username:username});
        }
    };

    return userManager;
}