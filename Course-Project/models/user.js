module.exports = function(db) {
    var crypto = require('crypto');

    // 加密函数
    var md5 = function(data) {
        return crypto.createHash('md5').update(data).digest('hex');
    };

    var users = db.collection('users');

    // 网站用户管理
    var userManager = {
        // 登陆用户，返回一个promise
        // 查找之后若用户未注册或密码错误都给相应提示，便于后续渲染之后提示用户
        signin : function(userData) {
            var result = { user : {},
                           error : {usernameError:"", passwordError:""},
                           isOk : false };
            return users.findOne({'info.username':userData.username})
            .then(function(user) {
                if (!!user) {
                    if (md5(userData.password) == user.info.password) {
                        result.isOk = true;
                        result.user = user;
                    } else {
                        result.error.passwordError = "密码错误";
                    }
                } else {
                    result.error.usernameError = "用户名未注册";
                }
                return result;
            });
        },

        // 添加用户
        addUser: function(userData) {
            userData.info.password = md5(userData.info.password);
            return users.insert(userData);
        },

        // 获取所有TA或学生
        getAll: function(auth) {
            return new Promise(function (resolve, reject) {
                users.find({authority: auth}).toArray(function (err, docs) {
                    var allUser = [];
                    for (var i = 0; i < docs.length; ++i)
                        allUser.push(docs[i].info);
                    resolve(allUser);
                });
            });
        }
    };

    return userManager;
}