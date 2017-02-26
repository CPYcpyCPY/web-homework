module.exports = function(db) {
    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var FileStore = require('session-file-store')(session);
    var routes = require('./routes/router')(db);

    var app = express();

    // 视图
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // 中间件
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
        store: new FileStore(),
        secret: 'hongchh',
        resave: false,
        saveUninitialized: false
    }));

    // 静态文件和路由
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', routes);

    return app;
};
