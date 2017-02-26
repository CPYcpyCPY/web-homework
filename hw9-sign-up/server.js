/*
 * 服务器模块
 */

var http = require("http");
var querystring = require("querystring");
var url = require("url");
var router = require("./routes/route");

/*
 * 启动服务器
 */
http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    if (request.method == "POST") {// 如果是POST请求需要读取POST的数据
        var postData = "";
        request.on("data", function(data) {// 读取POST的数据
            postData += data;
        });
        request.on("end", function() {// 读取完毕后再调用路由函数，避免因为异步而传了空数据给路由
            postData = querystring.parse(postData);
            router.route(pathname, response, "", postData);
        });
    } else {
        var query = querystring.parse(url.parse(request.url).query);
        if (query.username) {// 如果username存在表示用户查询信息
            router.route(pathname, response, query.username);
        } else {// 否则直接加载出注册页面
            router.route(pathname, response, "");
        }
    }
}).listen(8000);

console.log("* server begin to listen on http://localhost:8000/");
