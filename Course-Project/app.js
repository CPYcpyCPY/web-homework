module.exports = function(db) {
    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var FileStore = require('session-file-store')(session);
    var userApi = require('./routes/api/user')(db);
    var teacherApi = require('./routes/api/teacher')(db);
    var studentApi = require('./routes/api/student')(db);
    var taApi = require('./routes/api/ta')(db);
    var index = require('./routes/index');

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
    app.use('/', index);

    // user api
    app.use('/api/user', userApi);
    // teacher api
    app.use('/api/teacher', teacherApi);
    // student api
    app.use('/api/student', studentApi);
    // TA api
    app.use('/api/ta', taApi);

    return app;
};
