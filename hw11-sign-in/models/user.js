module.exports = function(db) {
    var check = require('../public/javascripts/checker');

    // 数据库
    var users = db.collection('users');

    // 网站用户管理
    var userManager = {

        // 加密用户密码之后向数据库添加用户
        addUser : function(userData) {
            userData.password = md5(userData.password);
            users.insert(userData);
        },

        // 查找用户，返回一个promise
        // 查找之后若用户未注册或密码错误都给相应提示，便于后续渲染之后提示用户
        findUser : function(userData) {
            var result = { user : {},
                           error : {usernameError:"", passwordError:""},
                           isOk : false };
            return users.findOne({username:userData.username})
            .then(function(user) {
                if (!!user) {
                    if (md5(userData.password) == user.password) {
                        result.isOk = true;
                        result.user = user;
                    } else {
                        result.error.passwordError = "The password is error";
                    }
                } else {
                    result.error.usernameError = "The username is not registed";
                }
                return result;
            });
        }
    };

    return userManager;
}