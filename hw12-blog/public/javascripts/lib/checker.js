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
    username : "6~18位英文字母、数字或下划线，必须以英文字母开头",
    password : "6~12位数字、大小写字母、中划线、下划线",
    password2 : "两次密码输入不一致",
    id : "学号8位数字，不能以0开头",
    phone : "电话11位数字，不能以0开头",
    email : "请不要使用非法邮箱"
};

var nullMessage = {
    username : "用户名不能为空",
    password : "密码不能为空",
    password2 : "密码不能为空",
    id : "学号不能为空",
    phone : "电话不能为空",
    email : "邮箱不能为空"
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