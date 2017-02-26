var index = require('express').Router();

index.get('/', function(req, res) {
    res.render('index');
});

index.get('/partials/:filename', function(req, res) {
    res.render('partials/'+req.params.filename);
});

module.exports = index;