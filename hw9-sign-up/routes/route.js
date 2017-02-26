/*
 * 本模块处理路由方面的问题
 * 根据路径的不同给出不同的响应
 */

/*
 * 导入网站数据
 */
var data = require("../model/data");
data.load();
/*
 * 引入数据检验器
 */
var checker = require("../model/checker");

/*
 * 每个请求相应的响应处理
 */
var handler = {};
/*
 * 主页
 * 需要判断注册页面和信息详情页面
 * 根据不同类型的请求写入相应响应
 */
handler["/"] = function(response, username, postData) {
    response.writeHead(200, {"Content-Type":"text/html"});
    /*
     * 带查询的请求
     * 若数据库非空且要查询的用户存在则返回用户的详细信息
     */
    if (username && data.student && data.student[username]) {
        response.end(data.mainPage.replace(/name/g, username)
                                        .replace(/studentId/, data.student[username].id)
                                        .replace(/phone/, data.student[username].phone)
                                        .replace(/email/, data.student[username].email));
    }
    /*
     * 用户注册
     * 检验用户信息是否非法
     * 若非法则返回注册页面，否则返回用户详情并将用户信息添加进数据库
     */
    else if (postData) {
        var ch = checker.check(postData, data.signupPage, data.student);
        if (!ch.isOk) {
            response.end(ch.html);
        } else {
            response.end(data.mainPage.replace(/name/g, postData.username)
                                        .replace(/studentId/, postData.id)
                                        .replace(/phone/, postData.phone)
                                        .replace(/email/, postData.email));
            data.add(postData);
        }
    }
    /*
     * 若以其他方式请求主页均返回注册页面
     */
    else {
        response.end(data.signupPage.replace(/nameError/, "")
                                        .replace(/idError/, "")
                                        .replace(/phoneError/, "")
                                        .replace(/emailError/, ""));
    }
};

/*
 * 静态文件
 */
handler["/public/css/signup.css"] = function(response) {
    response.writeHead(200, {"Content-Type":"text/css"});
    response.end(data.signupCss);
};

handler["/public/css/index.css"] = function(response) {
    response.writeHead(200, {"Content-Type":"text/css"});
    response.end(data.mainCss);
};

handler["/public/js/signup.js"] = function(response) {
    response.writeHead(200, {"Content-Type":"text/js"});
    response.end(data.signupJs);
};

handler["/public/img/bg.jpg"] = function(response) {
    response.writeHead(200, {"Content-Type":"image/jpeg"});
    response.end(data.bgImage, "binary");
};

/*
 * 路由函数
 * 若请求的路径存在则调用相应的处理函数
 * 不存在则返回404 not found页面
 */
var route = function(pathname, response, username, postData) {
    if (typeof handler[pathname] === "function") {
        if (username) {
            handler[pathname](response, username);
        } else if (postData) {
            handler[pathname](response, "", postData);
        } else {
            handler[pathname](response);
        }
    } else {
        response.writeHead(404, {"Content-Type":"text/html"});
        response.end("<h1>404 Not Found</h1>");
    }
};

exports.route = route;