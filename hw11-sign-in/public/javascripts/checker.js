/*
 * 信息合法性检查
 */

// 相应条目的正则表达式和错误信息提示
var regExp = {
    username : /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/,
    password : /^[a-zA-Z0-9_\-]{6,12}$/,
    id : /^[1-9][0-9]{7}$/,
    phone : /^[1-9][0-9]{10}$/,
    email : /^[a-zA-Z0-9_]+@[a-z0-9]{2,8}\.[a-z]{2,4}$/
};

var errorMessage = {
    username : "Invalid username",
    password : "Invalid password",
    password2 : "The password is not same as before",
    id : "Invalid id",
    phone : "Invalid phone",
    email : "Invalid email"
};

var nullMessage = {
    username : "username can't be null",
    password : "password can't be null",
    password2 : "password can't be null",
    id : "id can't be null",
    phone : "phone can't be null",
    email : "email can't be null"
};

// 如果在后台使用需要导出此模块
if (typeof window !== "object") {
    module.exports = function (user) {
        var error = {
            nameError : "",
            passwordError : "",
            passwordError2 : "",
            idError : "",
            phoneError : "",
            emailError : ""
        };
        var isOk = true;
        if (!regExp.username.test(user.username)) {
            error.nameError = errorMessage.username;
            isOk = false;
        }
        if (!regExp.password.test(user.password)) {
            error.passwordError = errorMessage.password;
            isOk = false;
        }
        if (user.password2 != user.password) {
            error.passwordError2 = errorMessage.password2;
            isOk = false;
        }
        if (!regExp.id.test(user.id)) {
            error.idError = errorMessage.id;
            isOk = false;
        }
        if (!regExp.phone.test(user.phone)) {
            error.phoneError = errorMessage.phone;
            isOk = false;
        }
        if (!regExp.email.test(user.email)) {
            error.emailError = errorMessage.email;
            isOk = false;
        }
        return {error:error, isOk:isOk};
    }
}