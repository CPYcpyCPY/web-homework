/*
 * 本模块用于检验用户post数据是否合法
 * 若数据合法则继续检测是否已被注册
 */

/*
 * 检测数据的正则表达式
 */
var regExp = {
    username : /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/,
    id : /^[1-9][0-9]{7}$/,
    phone : /^[1-9][0-9]{10}$/,
    email : /^[a-zA-Z0-9_]+@[a-z0-9]{2,8}\.[a-z]{2,4}$/
};

/*
 * 几种不同类型的错误提示信息
 */
var errorMessage = {
    username : "Invalid username",
    id : "Invalid id",
    phone : "Invalid phone",
    email : "Invalid email"
};

var nullMessage = {
    username : "username can't be null",
    id : "id can't be null",
    phone : "phone can't be null",
    email : "email can't be null"
};

var hasBeenUsed = {
    username : "the name has been used",
    id : "the id has been used",
    phone : "the phone has been used",
    email : "the email has been used"
};

/*
 * 匹配错误信息在HTML中应该显示的位置的正则表达式
 */
var errorArea = {
    username : /nameError/,
    id : /idError/,
    phone : /phoneError/,
    email : /emailError/
};

/*
 * 对postData进行检验，若数据异常则在template中将提示消息写入
 * template为HTML模板，allData为网站数据中存储的所有学生信息
 */
var check = function(postData, template, allData) {
    var isValid = true;
    for (i in postData) {
        if (!postData[i]) {// 检查是否为空
            template = template.replace(errorArea[i], nullMessage[i]);
            isValid = false;
        } else if (!regExp[i].test(postData[i])) { // 检查格式是否正确
            template = template.replace(errorArea[i], errorMessage[i]);
            isValid = false;
        } else {// 检查数据是否已被注册
            var used = false;
            for (j in allData) {
                if (allData[j][i] == postData[i]) {
                    template = template.replace(errorArea[i], hasBeenUsed[i]);
                    used = true;
                    isValid = false;
                }
            }
            if (!used)// 若数据正常则错误显示区置空
                template = template.replace(errorArea[i], "");
        }
    }
    return {isOk : isValid, html : template};
};

exports.check = check;