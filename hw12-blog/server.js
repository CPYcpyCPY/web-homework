var http = require('http');
var mongo = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/';
var port = normalizePort(process.env.PORT || '8000');

// 连接数据库后启动服务器
mongo.connect(dbUrl, function(err, db) {
    if (err) {
        console.log(err);
    } else {
        var app = require('./app')(db);
        app.set('port', port);
        var server = http.createServer(app);
        server.listen(port);
        console.log("Server start to listen on localhost:" + port);
    }
});

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}